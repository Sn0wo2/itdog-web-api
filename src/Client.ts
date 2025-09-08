import {BatchTCPingAPI} from "./api/endpoint/BatchTCPingAPI.js";
import {HttpAPI} from "./api/endpoint/HttpAPI.js";
import {PingAPI} from "./api/endpoint/PingAPI.js";
import {TCPingAPI} from "./api/endpoint/TCPingAPI.js";
import {TraceRouteAPI} from "./api/endpoint/TraceRouteAPI";
import {GenericAPI} from "./api/GenericAPI.js";
import {API_BASE_URL} from "./data/const.js";
import {
    BatchTCPingParams,
    ClientOptions,
    GenericAPIConfig,
    HttpParams,
    PingParams,
    TCPingParams,
    TraceRouteParams
} from './types.js';

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