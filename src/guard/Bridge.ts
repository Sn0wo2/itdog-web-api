import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
import vm from 'vm'

type GuardFn = (guardValue: string) => string | null

export class SafeGuardCalculator {
    private readonly scriptCode: string
    private vmScript: vm.Script

    constructor() {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const scriptPath = path.resolve(__dirname, '_guard_auto.js')
        this.scriptCode = fs.readFileSync(scriptPath, 'utf8')
        if (!this.scriptCode) {
            throw new Error(`failed to load script: ${scriptPath}`)
        }

        this.vmScript = new vm.Script(this.scriptCode, {
            filename: path.basename(scriptPath),
        })
    }

    calculate(guardValue: string): string | null {
        const context = this._createSandbox()
        this.vmScript.runInContext(context)

        const calculateFn: GuardFn = context.module.exports.calculateGuardRet
        if (typeof calculateFn !== 'function') {
            throw new Error('cannot find calculateGuardRet function')
        }

        return calculateFn(guardValue)
    }

    private _createSandbox(): vm.Context {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sandbox: any = {
            module: {exports: {}},
        }

        sandbox.window = sandbox

        sandbox.location = {
            reload: () => {
            },
        }

        sandbox.atob = (str: string) =>
            Buffer.from(str, 'base64').toString('binary')
        sandbox.btoa = (str: string) =>
            Buffer.from(str, 'binary').toString('base64')

        return vm.createContext(sandbox)
    }
}