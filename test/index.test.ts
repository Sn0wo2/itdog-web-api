import { Itdog, md5_16, parseScriptVariables } from '../src';

describe('Itdog', () => {
  test('should generate md5 hash', () => {
    const hash = md5_16('test');
    expect(hash).toBe('4621d373cade4e83');
  });

  test('should parse script variables', () => {
    const script = 'var test = "value";';
    const vars = parseScriptVariables(script);
    expect(vars.test).toBe('value');
  });
});