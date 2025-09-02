import { PingAPI } from './api/PingAPI';
import { BatchTCPingAPI } from './api/BatchTCPingAPI';
import {API_BASE_URL} from "./data/const";
import { Registry } from './Registry';
import { ItdogOptions } from './types';
import { GenericAPI } from './api/GenericAPI';
import { API_CONFIGS } from './config/api-config';

Registry.register('ping', PingAPI);
Registry.register('batchtcping', BatchTCPingAPI);

Object.keys(API_CONFIGS).forEach(apiName => {
    if (!Registry.get(apiName)) {
        Registry.register(apiName, class extends GenericAPI {
            constructor(options: ItdogOptions) {
                super(options, API_CONFIGS[apiName]);
            }
        });
    }
});

export class Itdog {
    private options: ItdogOptions;

    constructor(options?: ItdogOptions) {
        this.options = {
            baseURL: API_BASE_URL,
            ...options
        };
    }

    async ping(target: string, onMessage?: (data: unknown) => void) {
        const api = Registry.create('ping', this.options);
        return api.execute({ target }, onMessage);
    }

    async batchtcping(target: string, port?: string, onMessage?: (data: unknown) => void) {
        const api = Registry.create('batchtcping', this.options);
        return api.execute({ target, port }, onMessage);
    }

    async execute(apiName: string, params: Record<string, any>, onMessage?: (data: unknown) => void) {
        const api = Registry.create(apiName, this.options);
        return api.execute(params, onMessage);
    }

    static getAvailableAPIs(): string[] {
        return Registry.list();
    }
}