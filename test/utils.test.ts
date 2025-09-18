import {_md5_16, _parseScriptVariables, buildAPIRequest, buildAPIRequestWithTarget} from '@/utils'
import {describe, expect, test} from 'vitest'

describe('Utils', () => {
    describe('md5_16', () => {
        test('generates correct 16-char md5 hash', () => {
            const hash = _md5_16('test')
            expect(hash).toBe('4621d373cade4e83')
            expect(hash).toHaveLength(16)
        })

        test('generates different hashes for different inputs', () => {
            const hash1 = _md5_16('input1')
            const hash2 = _md5_16('input2')
            expect(hash1).not.toBe(hash2)
        })

        test('generates same hash for same input', () => {
            const input = 'consistent-input'
            const hash1 = _md5_16(input)
            const hash2 = _md5_16(input)
            expect(hash1).toBe(hash2)
        })

        test('handles empty string', () => {
            const hash = _md5_16('')
            expect(hash).toHaveLength(16)
            expect(hash).toBe('8f00b204e9800998')
        })
    })

    describe('parseScriptVariables', () => {
        test('parses string variables', () => {
            const script = 'var test = "value";'
            const vars = _parseScriptVariables(script)
            expect(vars.test).toBe('value')
        })

        test('parses boolean variables', () => {
            const script = 'var isTrue = true; var isFalse = false;'
            const vars = _parseScriptVariables(script)
            expect(vars.isTrue).toBe(true)
            expect(vars.isFalse).toBe(false)
        })

        test('parses number variables', () => {
            const script = 'var count = 42; const pi = 314;'
            const vars = _parseScriptVariables(script)
            expect(vars.count).toBe(42)
            expect(vars.pi).toBe(314)
        })

        test('parses JSON objects', () => {
            const script = 'var config = {"key": "value", "num": 123};'
            const vars = _parseScriptVariables(script)
            expect(vars.config).toEqual({key: 'value', num: 123})
        })

        test('handles single quotes in strings', () => {
            const script = "var message = 'hello world';"
            const vars = _parseScriptVariables(script)
            expect(vars.message).toBe('hello world')
        })

        test('handles multiple variables', () => {
            const script = `
        var task_id = "abc123";
        const wss_url = "wss://example.com";
        var timeout = 5000;
      `
            const vars = _parseScriptVariables(script)
            expect(vars.task_id).toBe('abc123')
            expect(vars.wss_url).toBe('wss://example.com')
            expect(vars.timeout).toBe(5000)
        })

        test('handles malformed JSON gracefully', () => {
            const script = 'var broken = {invalid: json};'
            const vars = _parseScriptVariables(script)
            expect(vars.broken).toBe('{invalid: json}')
        })

        test('returns empty object for no matches', () => {
            const script = 'console.log("no variables here");'
            const vars = _parseScriptVariables(script)
            expect(vars).toEqual({})
        })
    })

    describe('buildApiRequest', () => {
        test('builds request with target in URL', () => {
            const result = buildAPIRequestWithTarget(
                'https://api.example.com',
                '/ping/',
                {target: 'google.com', port: '80'}
            )

            expect(result.url).toBe('https://api.example.com/ping/google.com')
            expect(result.formData).toEqual({port: '80'})
        })

        test('builds request without target in URL', () => {
            const result = buildAPIRequest(
                'https://api.example.com',
                '/batch/',
                {target: 'google.com', port: '80'}
            )

            expect(result.url).toBe('https://api.example.com/batch/')
            expect(result.formData).toEqual({target: 'google.com', port: '80'})
        })

        test('handles missing target gracefully', () => {
            const result = buildAPIRequestWithTarget(
                'https://api.example.com',
                '/ping/',
                {port: '80'}
            )

            expect(result.url).toBe('https://api.example.com/ping/')
            expect(result.formData).toEqual({port: '80'})
        })

        test('handles empty formData', () => {
            const result = buildAPIRequestWithTarget(
                'https://api.example.com',
                '/ping/',
                {}
            )

            expect(result.url).toBe('https://api.example.com/ping/')
            expect(result.formData).toEqual({})
        })
    })
})