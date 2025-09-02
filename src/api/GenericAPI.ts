import {ClientOptions} from '../types.js';
import {APIConfig, APIResult, BaseAPI} from './BaseAPI.js';

export interface GenericAPIParams {
    [key: string]: unknown;
}

export interface GenericAPIConfig extends Partial<APIConfig> {
    endpoint: string;
    method?: string;
}

export class GenericAPI extends BaseAPI<GenericAPIParams> {
    private apiConfig: GenericAPIConfig;

    constructor(options: ClientOptions, config: GenericAPIConfig) {
        super(options, {
            endpoint: config.endpoint,
            method: config.method || 'POST'
        });
        this.apiConfig = config;
    }

    async execute(params: GenericAPIParams, onMessage?: (data: unknown) => void): Promise<APIResult> {
        return this.executeWithWebSocket(params as Record<string, string>, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        const target = formData['target'] || '';
        const url = `${this.options.baseURL}${this.apiConfig.endpoint}${target}`;
        const {target, ...restFormData} = formData;
        // target is used in URL construction above
        return {
            url,
            formData: {
                ...restFormData,
            }
        };
    }
}