import {md516, parseScriptVariables} from "../src/utils";

describe('Itdog', () => {
    test('should generate md5 hash', () => {
        const hash = md516('test');
        expect(hash).toBe('4621d373cade4e83');
    });

    test('should parse script variables', () => {
        const script = 'var test = "value";';
        const vars = parseScriptVariables(script);
        expect(vars.test).toBe('value');
    });
});