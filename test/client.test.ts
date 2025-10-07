import {BatchTCPingAPI} from '@/api/endpoint/ws/BatchTCPingAPI';
import {GenericWSAPI} from '@/api/endpoint/ws/common/GenericWSAPI';
import {DNSAPI} from '@/api/endpoint/ws/DNSAPI';
import {HTTPingAPI} from '@/api/endpoint/ws/HTTPingAPI';
import {PingAPI} from '@/api/endpoint/ws/PingAPI';
import {TCPingAPI} from '@/api/endpoint/ws/TCPingAPI';
import {TraceRouteAPI} from '@/api/endpoint/ws/TraceRouteAPI';
import {Client} from '@/Client';
import {beforeEach, describe, expect, test, vi} from 'vitest';

vi.mock('@/api/endpoint/ws/PingAPI');
vi.mock('@/api/endpoint/ws/TCPingAPI');
vi.mock('@/api/endpoint/ws/BatchTCPingAPI');
vi.mock('@/api/endpoint/ws/HTTPingAPI');
vi.mock('@/api/endpoint/ws/TraceRouteAPI');
vi.mock('@/api/endpoint/ws/DNSAPI');
vi.mock('@/api/endpoint/ws/common/GenericWSAPI');

describe('Client', () => {
    let client: Client;
    const mockOptions = {baseURL: 'https://test.com'};

    beforeEach(() => {
        client = new Client(mockOptions);
    });

    const createMockAPI = () => ({
        setOptions: vi.fn().mockReturnThis(),
        setParams: vi.fn().mockReturnThis(),
        request: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({}),
    });

    test('should call PingAPI with correct parameters', async () => {
        const mockAPI = createMockAPI();
        (PingAPI as any).mockImplementation(() => mockAPI);
        const params = {target: 'example.com'};
        await client.ping(params);
        expect(PingAPI).toHaveBeenCalled();
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });

    test('should call TCPingAPI with correct parameters', async () => {
        const mockAPI = createMockAPI();
        (TCPingAPI as any).mockImplementation(() => mockAPI);
        const params = {target: 'example.com'};
        await client.tcping(params);
        expect(TCPingAPI).toHaveBeenCalled();
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });

    test('should call BatchTCPingAPI with correct parameters', async () => {
        const mockAPI = createMockAPI();
        (BatchTCPingAPI as any).mockImplementation(() => mockAPI);
        const params = {hosts: ['example.com'], port: '80'};
        await client.batchTCPing(params);
        expect(BatchTCPingAPI).toHaveBeenCalled();
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });

    test('should call HTTPingAPI with correct parameters for http', async () => {
        const mockAPI = createMockAPI();
        (HTTPingAPI as any).mockImplementation(() => mockAPI);
        const params = {host: 'example.com'};
        await client.http(params);
        expect(HTTPingAPI).toHaveBeenCalled();
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });

    test('should call HTTPingAPI with correct parameters for httping', async () => {
        const mockAPI = createMockAPI();
        (HTTPingAPI as any).mockImplementation(() => mockAPI);
        const params = {host: 'example.com'};
        await client.httping(params);
        expect(HTTPingAPI).toHaveBeenCalled();
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });

    test('should call TraceRouteAPI with correct parameters', async () => {
        const mockAPI = createMockAPI();
        (TraceRouteAPI as any).mockImplementation(() => mockAPI);
        const params = {target: 'example.com'};
        await client.traceRoute(params);
        expect(TraceRouteAPI).toHaveBeenCalled();
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });

    test('should call DNSAPI with correct parameters', async () => {
        const mockAPI = createMockAPI();
        (DNSAPI as any).mockImplementation(() => mockAPI);
        const params = {target: 'example.com'};
        await client.dns(params);
        expect(DNSAPI).toHaveBeenCalled();
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });

    test('should call GenericWSAPI with correct parameters', async () => {
        const mockAPI = createMockAPI();
        (GenericWSAPI as any).mockImplementation(() => mockAPI);
        const params = {some_param: 'value'};
        const endpoint = 'test-endpoint';
        const method = 'POST';
        await client.generic(endpoint, method, params);
        expect(GenericWSAPI).toHaveBeenCalledWith({endpoint, method});
        expect(mockAPI.setOptions).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
        expect(mockAPI.setParams).toHaveBeenCalledWith(params);
        expect(mockAPI.execute).toHaveBeenCalled();
    });
});