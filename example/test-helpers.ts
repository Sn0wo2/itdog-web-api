import {Client} from '../src';

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
        console.log('Starting simple API tests...\n');

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            if (!test.enabled) continue;

            console.log(`=== Testing ${test.name} ===`);
            try {
                let result;
                switch (test.name.toLowerCase()) {
                case 'ping':
                    result = await this.client.ping(test.params.target, this.defaultMessageHandler);
                    break;
                case 'tcping':
                    result = await this.client.tcping(test.params.target, test.params.port, this.defaultMessageHandler);
                    break;
                case 'batch tcping':
                    result = await this.client.batchTCPing(test.params.hosts, test.params.port, this.defaultMessageHandler);
                    break;
                default:
                    throw new Error(`Unknown test type: ${test.name}`);
                }
                console.log('Final result:', result);
            } catch (error) {
                console.error(`${test.name} test failed:`, error);
            }

            if (i < tests.length - 1) {
                console.log('\n' + this.separator + '\n');
            }
        }
    }

    async runGenericAPITests(tests: APITestConfig[]) {
        console.log('Starting Generic API tests...\n');

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            if (!test.enabled) continue;

            console.log(`=== Testing ${test.name} ===`);
            try {
                const api = this.client.createAPI({
                    endpoint: test.endpoint,
                    method: test.method || 'POST'
                });

                const result = await api.execute(test.params, this.defaultMessageHandler);
                console.log('Final result:', result);
            } catch (error) {
                console.error(`${test.name} test failed:`, error);
            }

            if (i < tests.length - 1) {
                console.log('\n' + this.separator + '\n');
            }
        }
    }

    private defaultMessageHandler = (data: any) => {
        console.log('Real-time data:', data);
    };
}

export const DEFAULT_SIMPLE_TESTS: TestConfig[] = [
    {
        name: 'Ping',
        enabled: false,
        params: {target: 'baidu.com'}
    },
    {
        name: 'TCPing',
        enabled: false,
        params: {target: 'baidu.com', port: '80'}
    },
    {
        name: 'Batch TCPing',
        enabled: false,
        params: {hosts: 'baidu.com,google.com', port: '80'}
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
    }
];