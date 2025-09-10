import {BatchTCPingParams, Client, HttpParams, PingParams, TCPingParams, TraceRouteParams} from '../src';

export interface TestConfig {
    name: string;
    enabled: boolean;
    params: Record<string, any>;
}

export interface APITestConfig extends TestConfig {
    endpoint: string;
    method?: string;
}

export class TestRunner {
    private client: Client;
    private separator = '='.repeat(50);

    constructor(client: Client) {
        this.client = client;
    }

    async runSimpleTests(tests: TestConfig[]) {
        console.warn('Starting simple API tests...\n');

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            if (!test.enabled) continue;

            console.warn(`=== Testing ${test.name} ===`);
            try {
                let result;
                switch (test.name.toLowerCase()) {
                case 'ping':
                    result = await this.client.ping(test.params as PingParams, this.defaultMessageHandler);
                    break;
                case 'tcping':
                    result = await this.client.tcping(
                        test.params as TCPingParams, this.defaultMessageHandler);
                    break;
                case 'batch tcping':
                    result = await this.client.batchTCPing(test.params as BatchTCPingParams,
                        this.defaultMessageHandler,
                    );
                    break;
                case 'http':
                    result = await this.client.http(test.params as HttpParams, this.defaultMessageHandler);
                    break;
                case 'trace route':
                    result = await this.client.traceRoute(test.params as TraceRouteParams, this.defaultMessageHandler);
                    break;
                default:
                    throw new Error(`Unknown test type: ${test.name}`);
                }
                console.warn('Final result:', result);
            } catch (error) {
                console.error(`${test.name} test failed:`, error);
            }

            if (i < tests.length - 1) {
                console.warn('\n' + this.separator + '\n');
            }
        }
    }

    async runGenericAPITests(tests: APITestConfig[]) {
        console.warn('Starting Generic API tests...\n');

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            if (!test.enabled) continue;

            console.warn(`=== Testing ${test.name} ===`);
            try {
                const api = this.client.createAPI({
                    endpoint: test.endpoint,
                    method: test.method || 'POST'
                });

                const result = await api.execute(test.params, this.defaultMessageHandler);
                console.warn('Final result:', result);
            } catch (error) {
                console.error(`${test.name} test failed:`, error);
            }

            if (i < tests.length - 1) {
                console.warn('\n' + this.separator + '\n');
            }
        }
    }

    private defaultMessageHandler = (data: any) => {
        console.debug('Real-time data:', data);
    };
}

export const DEFAULT_SIMPLE_TESTS: TestConfig[] = [
    {
        name: 'Ping',
        enabled: true,
        params: {target: 'baidu.com'}
    },
    {
        name: 'TCPing',
        enabled: true,
        params: {target: 'openrouter.ai', port: '443'}
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
    }
];

export const DEFAULT_GENERIC_API_TESTS: APITestConfig[] = [
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
    },
    {
        name: 'Custom API (TCPing)',
        enabled: true,
        endpoint: '/tcping/',
        method: 'POST',
        params: {
            target: 'openrouter.ai:443',
            line: '1,3,5',
            button_click: 'yes'
        }
    },
    {
        name: 'Generic API (HTTP)',
        enabled: true,
        endpoint: '/http/',
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
    }
];