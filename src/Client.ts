import {BatchTCPingAPI} from "./api/endpoint/BatchTCPingAPI.js";
import {PingAPI} from "./api/endpoint/PingAPI.js";
import {TCPingAPI} from "./api/endpoint/TCPingAPI.js";
import {GenericAPI, GenericAPIConfig} from "./api/GenericAPI.js";
import {API_BASE_URL} from "./data/const.js";
import {ClientOptions} from './types.js';

export class Client {
    private readonly options: ClientOptions;

    constructor(options?: ClientOptions) {
        this.options = {
            baseURL: API_BASE_URL,
            ...options
        };
    }

    async ping(target: string, onMessage?: (data: unknown) => void) {
        return new PingAPI(this.options).execute({target}, onMessage);
    }

    async tcping(target: string, port?: string, onMessage?: (data: unknown) => void) {
        return new TCPingAPI(this.options).execute({target, port}, onMessage);
    }

    async batchTCPing(hosts: string[], port?: string, onMessage?: (data: unknown) => void) {
        return new BatchTCPingAPI(this.options).execute({hosts, port}, onMessage);
    }

    async generic(
        endpoint: string,
        params: Record<string, any> = {},
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