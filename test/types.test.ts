import type {
    APIResponse,
    ClientOptions,
    DNSParams,
    HTTPingParams,
    PingParams,
    TCPingParams,
    TraceRouteParams,
    WebSocketMessage
} from '@/types'
import {describe, expect, test, vi} from 'vitest'

describe('Types', () => {
    describe('ClientOptions', () => {
        test('should accept valid options', () => {
            const options: ClientOptions = {
                baseURL: 'https://api.example.com',
                hashToken: 'test-token'
            }
            expect(options.baseURL).toBe('https://api.example.com')
            expect(options.hashToken).toBe('test-token')
        })

        test('should accept partial options', () => {
            const options1: ClientOptions = {baseURL: 'https://api.example.com'}
            const options2: ClientOptions = {hashToken: 'test-token'}
            const options3: ClientOptions = {}

            expect(options1.baseURL).toBe('https://api.example.com')
            expect(options2.hashToken).toBe('test-token')
            expect(options3).toEqual({})
        })
    })

    describe('WebSocketMessage', () => {
        test('should accept a valid message structure', () => {
            const message: WebSocketMessage = {
                task_id: 'test123',
                task_token: 'token123',
                custom_field: 'value'
            }
            expect(message.task_id).toBe('test123')
            expect(message.task_token).toBe('token123')
            expect(message.custom_field).toBe('value')
        })

        test('should require essential fields', () => {
            const message: WebSocketMessage = {
                task_id: 'minimal_id',
                task_token: 'minimal_token'
            }
            expect(message.task_id).toBe('minimal_id')
            expect(message.task_token).toBe('minimal_token')
        })
    })

    describe('APIResponse', () => {
        test('should hold a WebSocketHandler and a promise of APIResult', async () => {
            const mockWsHandler = {} as any
            const mockApiResult = {
                task_id: 'test123',
                wss_url: 'wss://example.com'
            } as any

            const response: APIResponse = {
                wsHandler: mockWsHandler,
                result: Promise.resolve(mockApiResult),
                execute: vi.fn()
            }

            expect(response.wsHandler).toBe(mockWsHandler)
            await expect(response.result).resolves.toBe(mockApiResult)
        })
    })

    describe('Parameter Types', () => {
        test('PingParams', () => {
            const params: PingParams = {target: '8.8.8.8'}
            expect(params.target).toBe('8.8.8.8')
        })

        test('TCPingParams', () => {
            const params: TCPingParams = {target: 'google.com:80'}
            expect(params.target).toBe('google.com:80')
        })

        test('HTTPingParams', () => {
            const params: HTTPingParams = {host: 'https://google.com'}
            expect(params.host).toBe('https://google.com')
        })

        test('TraceRouteParams', () => {
            const params: TraceRouteParams = {target: '8.8.8.8'}
            expect(params.target).toBe('8.8.8.8')
        })

        test('DNSParams', () => {
            const params: DNSParams = {target: 'google.com', dnsType: 'a'}
            expect(params.target).toBe('google.com')
            expect(params.dnsType).toBe('a')
        })
    })
})