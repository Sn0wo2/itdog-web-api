import {API_BASE_URL, ITDOG_HASH_TOKEN} from '@/data/const'
import {getAllNodes, getDefaultNodes, getNodesByCategory, updateNodesFromHtml} from '@/data/nodes'
import type {APIResponse, ClientOptions, WebSocketMessage} from '@/types'
import {_buildAPIRequest, _md5_16, _parseScriptVariables} from '@/utils'
import {beforeAll, describe, expect, test} from 'vitest'

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
      expect(vars.config).toEqual({ key: 'value', num: 123 })
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
      const result = _buildAPIRequest(
        'https://api.example.com',
        '/ping/',
        { target: 'google.com', port: '80' },
        true
      )

      expect(result.url).toBe('https://api.example.com/ping/google.com')
      expect(result.formData).toEqual({ port: '80' })
    })

    test('builds request without target in URL', () => {
      const result = _buildAPIRequest(
        'https://api.example.com',
        '/batch/',
        { target: 'google.com', port: '80' },
        false
      )

      expect(result.url).toBe('https://api.example.com/batch/')
      expect(result.formData).toEqual({ target: 'google.com', port: '80' })
    })

    test('handles missing target gracefully', () => {
      const result = _buildAPIRequest(
        'https://api.example.com',
        '/ping/',
        { port: '80' },
        true
      )

      expect(result.url).toBe('https://api.example.com/ping/')
      expect(result.formData).toEqual({ port: '80' })
    })

    test('handles empty formData', () => {
      const result = _buildAPIRequest(
        'https://api.example.com',
        '/ping/',
        {},
        true
      )

      expect(result.url).toBe('https://api.example.com/ping/')
      expect(result.formData).toEqual({})
    })
  })
})

describe('Constants', () => {
  test('API_BASE_URL is defined and valid', () => {
    expect(API_BASE_URL).toBeDefined()
    expect(typeof API_BASE_URL).toBe('string')
    expect(API_BASE_URL.length).toBeGreaterThan(0)
    expect(API_BASE_URL.startsWith('http')).toBe(true)
  })

  test('ITDOG_HASH_TOKEN is defined', () => {
    expect(ITDOG_HASH_TOKEN).toBeDefined()
    expect(typeof ITDOG_HASH_TOKEN).toBe('string')
    expect(ITDOG_HASH_TOKEN.length).toBeGreaterThan(0)
  })
})

describe('Types', () => {
  describe('ClientOptions', () => {
    test('accepts valid options', () => {
      const options: ClientOptions = {
        baseURL: 'https://api.example.com',
        hashToken: 'test-token'
      }

      expect(options.baseURL).toBe('https://api.example.com')
      expect(options.hashToken).toBe('test-token')
    })

    test('accepts partial options', () => {
      const options1: ClientOptions = {
        baseURL: 'https://api.example.com'
      }

      const options2: ClientOptions = {
        hashToken: 'test-token'
      }

      const options3: ClientOptions = {}

      expect(options1.baseURL).toBe('https://api.example.com')
      expect(options2.hashToken).toBe('test-token')
      expect(options3).toEqual({})
    })
  })

  describe('WebSocketMessage', () => {
    test('accepts valid message structure', () => {
      const message: WebSocketMessage = {
        task_id: 'test123',
        task_token: 'token123',
        custom_field: 'value'
      }

      expect(message.task_id).toBe('test123')
      expect(message.task_token).toBe('token123')
      expect(message.custom_field).toBe('value')
    })

    test('accepts minimal message', () => {
      const message: WebSocketMessage = {}
      expect(message).toEqual({})
    })
  })

  describe('APIResponse', () => {
    test('accepts valid response structure', () => {
      const response: APIResponse = {
        task_id: 'test123',
        wss_url: 'wss://example.com',
        rawRequest: {
          url: 'https://example.com'
        },
        additional_data: 'value'
      }

      expect(response.task_id).toBe('test123')
      expect(response.wss_url).toBe('wss://example.com')
      expect(response.additional_data).toBe('value')
    })
  })
})

describe('Node Management', () => {
  const testHtml = `
    <select>
      <optgroup label="测试分组1">
        <option value="1">节点1</option>
        <option value="2">节点2</option>
      </optgroup>
      <optgroup label="测试分组2">
        <option value="3">节点3</option>
      </optgroup>
    </select>
  `

  const invalidHtml = `
    <select>
      <optgroup>
        <option>Invalid Node</option>
      </optgroup>
    </select>
  `

  describe('updateNodesFromHtml', () => {
    test('parses valid HTML correctly', () => {
      updateNodesFromHtml(testHtml)
      const nodes = getDefaultNodes()

      expect(Object.keys(nodes)).toHaveLength(2)
      expect(nodes['测试分组1']).toHaveLength(2)
      expect(nodes['测试分组2']).toHaveLength(1)
    })

    test('handles invalid HTML gracefully', () => {
      const originalNodes = getDefaultNodes()
      updateNodesFromHtml(invalidHtml)

      expect(getDefaultNodes()).toEqual(originalNodes)
    })

    test('handles empty HTML input', () => {
      const originalNodes = getDefaultNodes()
      updateNodesFromHtml('')

      expect(getDefaultNodes()).toEqual(originalNodes)
    })
  })

  describe('Node retrieval functions', () => {
    beforeAll(() => {
      updateNodesFromHtml(testHtml)
    })

    test('gets all nodes correctly', () => {
      const allNodes = getAllNodes()
      expect(allNodes).toHaveLength(3)
    })

    test('gets nodes by category correctly', () => {
      const group1Nodes = getNodesByCategory('测试分组1')
      expect(group1Nodes).toHaveLength(2)

      const nonExistentNodes = getNodesByCategory('不存在的分组')
      expect(nonExistentNodes).toHaveLength(0)
    })
  })
})