import {BatchTCPingAPI} from '@/api/endpoint/ws/BatchTCPingAPI'
import {GenericWSAPI} from '@/api/endpoint/ws/common/GenericWSAPI'
import {DNSAPI} from '@/api/endpoint/ws/DNSAPI'
import {HTTPingAPI} from '@/api/endpoint/ws/HTTPingAPI'
import {PingAPI} from '@/api/endpoint/ws/PingAPI'
import {TCPingAPI} from '@/api/endpoint/ws/TCPingAPI'
import {TraceRouteAPI} from '@/api/endpoint/ws/TraceRouteAPI'
import {API_BASE_URL} from '@/data/const'
import type {
    BatchTCPingParams,
    ClientOptions,
    DNSParams,
    FinalWSResponse,
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

    async ping(options: PingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return new PingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async tcping(options: TCPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return new TCPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async batchTCPing(
        options: BatchTCPingParams, onMessage?: (data: unknown) => void
    ): Promise<FinalWSResponse> {
        return new BatchTCPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }


    async http(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return new HTTPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async httping(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return new HTTPingAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async traceRoute(options: TraceRouteParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return new TraceRouteAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async dns(options: DNSParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return new DNSAPI().setOptions(this.options).setParams(options).request().execute(onMessage);
    }

    async generic(
        endpoint: string,
        method: string = 'POST',
        params: GenericParams,
        onMessage?: (data: unknown) => void
    ): Promise<FinalWSResponse> {
        return new GenericWSAPI({
            endpoint,
            method
        }).setOptions(this.options).setParams(params).request().execute(onMessage);
    }
}