import {BatchTCPingAPI} from '@/api/endpoint/BatchTCPingAPI'
import {DNSAPI} from '@/api/endpoint/DNSAPI'
import {HTTPingAPI} from '@/api/endpoint/HTTPingAPI'
import {PingAPI} from '@/api/endpoint/PingAPI'
import {TCPingAPI} from '@/api/endpoint/TCPingAPI'
import {TraceRouteAPI} from '@/api/endpoint/TraceRouteAPI'
import {GenericAPI} from '@/api/GenericAPI'
import {API_BASE_URL} from '@/data/const'
import type {
    BatchTCPingParams,
    ClientOptions,
    DNSParams,
    FinalResponse,
    GenericParams,
    HTTPingParams,
    PingParams,
    TCPingParams,
    TraceRouteParams
} from './types'


export class Client {
    private readonly options: ClientOptions;

    constructor(options?: ClientOptions) {
        this.options = {
            baseURL: API_BASE_URL,
            ...options
        };
    }

    async ping(options: PingParams, onMessage?: (data: unknown) => void): Promise<FinalResponse> {
        return new PingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async tcping(options: TCPingParams, onMessage?: (data: unknown) => void): Promise<FinalResponse> {
        return new TCPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async batchTCPing(
        options: BatchTCPingParams, onMessage?: (data: unknown) => void
    ): Promise<FinalResponse> {
        return new BatchTCPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }


    async http(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalResponse> {
        return new HTTPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async httping(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalResponse> {
        return new HTTPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async traceRoute(options: TraceRouteParams, onMessage?: (data: unknown) => void): Promise<FinalResponse> {
        return new TraceRouteAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async dns(options: DNSParams, onMessage?: (data: unknown) => void): Promise<FinalResponse> {
        return new DNSAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async generic(
        endpoint: string,
        method: string = 'POST',
        params: GenericParams,
        onMessage?: (data: unknown) => void
    ): Promise<FinalResponse> {
        return new GenericAPI({
            endpoint,
            method
        }).setOptions(this.options).setParams(params).request().execute(onMessage);
    }
}