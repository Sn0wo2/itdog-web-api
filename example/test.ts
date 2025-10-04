import {Client} from '@/Client.ts'
import type {
    BatchTCPingParams,
    DNSParams,
    FinalWSResponse,
    HTTPingParams,
    PingParams,
    TCPingParams,
    TraceRouteParams
} from '@/types.ts'

interface TestConfig {
    name: string
    enabled: boolean
    params: Record<string, any>
}

interface APITestConfig extends TestConfig {
    endpoint: string
    method?: string
}

class TestRunner {
    private readonly client: Client
    private readonly separator = '='.repeat(50)

    constructor(client: Client) {
        this.client = client
    }

    async runSimpleTests(tests: TestConfig[]) {
        console.warn('Starting simple API tests...\n')

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i]
            if (!test.enabled) continue

            console.warn(`=== Testing ${test.name} ===`)
            try {
                let result: FinalWSResponse
                switch (test.name.toUpperCase().replaceAll(" ", "_")) {
                case 'PING':
                    result = await this.client.ping(test.params as PingParams, this.defaultMessageHandler)
                    break
                case 'TCPING':
                    result = await this.client.tcping(test.params as TCPingParams, this.defaultMessageHandler)
                    break
                case 'BATCH_TCPING':
                    result = await this.client.batchTCPing(test.params as BatchTCPingParams, this.defaultMessageHandler)
                    break
                case 'HTTP':
                    result = await this.client.http(test.params as HTTPingParams, this.defaultMessageHandler)
                    break
                case 'TRACE_ROUTE':
                    result = await this.client.traceRoute(test.params as TraceRouteParams, this.defaultMessageHandler)
                    break
                case 'DNS':
                    result = await this.client.dns(test.params as DNSParams, this.defaultMessageHandler)
                    break
                default:
                    throw new Error(`Unknown test type: ${test.name}`)
                }
                console.warn('Final result:', result.result)
            } catch (error) {
                console.error(`${test.name} test failed:`, error)
            }

            if (i < tests.length - 1) {
                console.warn('\n' + this.separator + '\n')
            }
        }
    }

    async runGenericAPITests(tests: APITestConfig[]) {
        console.warn('Starting Generic API tests...\n')

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i]
            if (!test.enabled) continue

            console.warn(`=== Testing ${test.name} ===`)
            try {
                const result = await this.client.generic(test.endpoint, test.method || 'POST', test.params, this.defaultMessageHandler)
                console.warn(`${test.name} Result:`, result)
            } catch (error) {
                console.error(`${test.name} Failed:`, error)
            }

            if (i < tests.length - 1) {
                console.warn('\n' + this.separator + '\n')
            }
        }
    }

    private readonly defaultMessageHandler = (data: any) => {
        console.debug('Handler Data:', data)
    }
}

const DEFAULT_SIMPLE_TESTS: TestConfig[] = [
    {
        name: 'Ping',
        enabled: true,
        params: {target: 'www.baidu.com'}
    },
    {
        name: 'TCPing',
        enabled: true,
        params: {target: 'www.baidu.com', port: '443'}
    },
    {
        name: 'Batch TCPing',
        enabled: true,
        params: {
            hosts: ['www.baidu.com', 'www.google.com'],
            port: '443',
            cidrFilter: true,
            gateway: 'first'
        }
    },
    {
        name: 'HTTP',
        enabled: true,
        params: {
            line: '',
            host: 'https://www.baidu.com',
            host_s: 'www.baidu.com',
            check_mode: 'fast',
            ipv4: '',
            method: 'get',
            referer: '',
            ua: '',
            cookies: '',
            redirect_num: '5',
            dns_server_type: 'isp',
            dns_server: ''
        }
    },
    {
        name: 'Trace Route',
        enabled: true,
        params: {
            host: 'www.baidu.com',
            dns_server_type: 'isp',
            dns_server: ''
        }
    },
    {
        name: 'DNS',
        enabled: true,
        params: {
            target: 'www.baidu.com',
            line: '',
            dnsType: 'a',
            dnsServerType: 'isp',
            dnsServer: ''
        }
    }
]

const DEFAULT_GENERIC_API_TESTS: APITestConfig[] = [
    {
        name: 'Generic API (Ping)',
        enabled: true,
        endpoint: '/ping/',
        params: {
            target: 'baidu.com',
            line: '1,3,5',
            button_click: 'yes',
            dns_server_type: 'isp',
            dns_server: ''
        }
    }
]

const client = new Client()
const testRunner = new TestRunner(client)

async function runAllTests() {
    await testRunner.runSimpleTests(DEFAULT_SIMPLE_TESTS)

    console.warn('='.repeat(50))

    await testRunner.runGenericAPITests(DEFAULT_GENERIC_API_TESTS)
}

await runAllTests().catch(console.error)