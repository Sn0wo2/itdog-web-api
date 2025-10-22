import {BatchTCPingAPI} from '@/api/endpoint/ws/BatchTCPingAPI'
import {BaseWSAPI} from '@/api/endpoint/ws/common/BaseWSAPI'
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
        return this._createAPI(PingAPI, options, onMessage, false);
    }

    async pingV6(options: PingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(PingAPI, options, onMessage, true);
    }

    async tcping(options: TCPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(TCPingAPI, options, onMessage, false);
    }

    async tcpingV6(options: TCPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(TCPingAPI, options, onMessage, true);
    }

    async batchTCPing(
        options: BatchTCPingParams, onMessage?: (data: unknown) => void
    ): Promise<FinalWSResponse> {
        return this._createAPI(BatchTCPingAPI, options, onMessage);
    }

    async http(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(HTTPingAPI, options, onMessage, false);
    }

    async httpV6(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(HTTPingAPI, options, onMessage, true);
    }

    async httping(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(HTTPingAPI, options, onMessage, false);
    }

    async httpingV6(options: HTTPingParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(HTTPingAPI, options, onMessage, true);
    }

    async traceRoute(options: TraceRouteParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(TraceRouteAPI, options, onMessage, false);
    }

    async traceRouteV6(options: TraceRouteParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(TraceRouteAPI, options, onMessage, true);
    }

    async dns(options: DNSParams, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        return this._createAPI(DNSAPI, options, onMessage);
    }

    async generic(
        endpoint: string,
        method: string = 'POST',
        params: GenericParams,
        onMessage?: (data: unknown) => void
    ): Promise<FinalWSResponse> {
        const api = new GenericWSAPI({
            endpoint,
            method
        })
        api.setOptions(this.options)
        return api.execute(params, onMessage)
    }

    private _createAPI<T extends BaseWSAPI<P>, P>(
        apiClass: new (useIPv6?: boolean) => T,
        params: P,
        onMessage?: (data: unknown) => void,
        useIPv6: boolean = false
    ): Promise<FinalWSResponse> {
        const apiInstance = new apiClass(useIPv6);
        apiInstance.setOptions(this.options);
        return apiInstance.execute(params, onMessage);
    }
}