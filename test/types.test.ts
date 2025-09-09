import type {APIResponse, ClientOptions, WebSocketMessage} from '../src';

describe('Types', () => {
    describe('ClientOptions', () => {
        test('accepts valid options', () => {
            const options: ClientOptions = {
                baseURL: 'https://api.example.com',
                hashToken: 'test-token'
            };

            expect(options.baseURL).toBe('https://api.example.com');
            expect(options.hashToken).toBe('test-token');
        });

        test('accepts partial options', () => {
            const options1: ClientOptions = {
                baseURL: 'https://api.example.com'
            };

            const options2: ClientOptions = {
                hashToken: 'test-token'
            };

            const options3: ClientOptions = {};

            expect(options1.baseURL).toBe('https://api.example.com');
            expect(options2.hashToken).toBe('test-token');
            expect(options3).toEqual({});
        });
    });

    describe('WebSocketMessage', () => {
        test('accepts valid message structure', () => {
            const message: WebSocketMessage = {
                task_id: 'test123',
                task_token: 'token123',
                custom_field: 'value'
            };

            expect(message.task_id).toBe('test123');
            expect(message.task_token).toBe('token123');
            expect(message.custom_field).toBe('value');
        });

        test('accepts minimal message', () => {
            const message: WebSocketMessage = {};
            expect(message).toEqual({});
        });
    });

    describe('APIResponse', () => {
        test('accepts valid response structure', () => {
            const response: APIResponse = {
                task_id: 'test123',
                wss_url: 'wss://example.com',
                additional_data: 'value'
            };

            expect(response.task_id).toBe('test123');
            expect(response.wss_url).toBe('wss://example.com');
            expect(response.additional_data).toBe('value');
        });
    });
});