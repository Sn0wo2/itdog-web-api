import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
import vm from 'vm'

type GuardFn = (guardValue: string) => string | null

export class SafeGuardCalculator {
    private readonly scriptCode: string
    private vmScript: vm.Script

    constructor() {
        const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '_guard_auto.js');

        try {
            this.scriptCode = fs.readFileSync(scriptPath, 'utf8');
        } catch (error) {
            throw new Error(`Failed to load script: ${scriptPath}. ${error instanceof Error ? error.message : String(error)}`);
        }

        if (!this.scriptCode) {
            throw new Error(`Failed to load script: ${scriptPath}`);
        }

        this.vmScript = new vm.Script(this.scriptCode, {
            filename: path.basename(scriptPath),
        });
    }

    calculate(guardValue: string): string | null {
        const context = this._createSandbox()
        this.vmScript.runInContext(context)

        const calculateFn: GuardFn = context.calculateGuardRet
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
        sandbox.globalThis = sandbox

        sandbox.location = {
            reload: () => {
            },
        }

        sandbox.globalThis.document = {
            get cookie(): string {
                return sandbox._fakeCookieStore;
            },
            set cookie(value) {
                const [name, val] = value.split(';')[0].split('=');
                if (name && val) {
                    if (name.trim() === 'guardret') {
                        sandbox._capturedGuardret = val;
                    }
                    sandbox._fakeCookieStore = value;
                }
            },
        };

        sandbox.calculateGuardRet = function (guardValue: string): string | null {
            sandbox._fakeCookieStore = '';
            sandbox._capturedGuardret = null;

            sandbox.document.cookie = `guard=${guardValue}`;

            const guard = sandbox.getCookie('guard');
            if (!guard) {
                throw new Error("Missing guard cookie")
            }

            sandbox.setRet(guard);

            return sandbox._capturedGuardret;
        };

        sandbox.btoa = (str: string) =>
            Buffer.from(str, 'binary').toString('base64')

        return vm.createContext(sandbox)
    }
}