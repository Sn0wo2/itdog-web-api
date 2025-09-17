import {BatchTCPingAPI} from '@/api/endpoint/BatchTCPingAPI'
import {DNSAPI} from '@/api/endpoint/DNSAPI'
import {HttpAPI} from '@/api/endpoint/HttpAPI'
import {PingAPI} from '@/api/endpoint/PingAPI'
import {TCPingAPI} from '@/api/endpoint/TCPingAPI'
import {TraceRouteAPI} from '@/api/endpoint/TraceRouteAPI'
import {GenericAPI} from '@/api/GenericAPI'
import {API_BASE_URL} from '@/data/const'
import type {
    BatchTCPingParams,
    ClientOptions,
    DNSParams,
    GenericAPIConfig,
    HttpParams,
    PingParams,
    TCPingParams,
    TraceRouteParams
} from '@/types'

export class Client {
    private readonly options: ClientOptions;

    constructor(options?: ClientOptions) {
        this.options = {
            baseURL: API_BASE_URL,
            ...options
        };
    }

    async ping(options: PingParams, onMessage?: (data: unknown) => void) {
        return new PingAPI(this.options).execute(options, onMessage);
    }

    async tcping(options: TCPingParams, onMessage?: (data: unknown) => void) {
        return new TCPingAPI(this.options).execute(options, onMessage);
    }

    async batchTCPing(
        options: BatchTCPingParams,
        onMessage?: (data: unknown) => void
    ) {
        return new BatchTCPingAPI(this.options).execute(options, onMessage);
    }

    async http(options: HttpParams, onMessage?: (data: unknown) => void) {
        return new HttpAPI(this.options).execute(options, onMessage);
    }

    async traceRoute(options: TraceRouteParams, onMessage?: (data: unknown) => void) {
        return new TraceRouteAPI(this.options).execute(options, onMessage);
    }

    async dns(options: DNSParams, onMessage?: (data: unknown) => void) {
        return new DNSAPI(this.options).execute(options, onMessage);
    }

    async generic(
        endpoint: string,
        params: Record<string, unknown> = {},
        method: string = 'POST',
        onMessage?: (data: unknown) => void
    ) {
        const config: GenericAPIConfig = {
            endpoint,
            method
        };
        return new GenericAPI(this.options, config).execute(params, onMessage);
    }

    createAPI(config: GenericAPIConfig) {
        return new GenericAPI(this.options, config);
    }
}