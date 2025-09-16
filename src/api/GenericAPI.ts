import {APIResult, ClientOptions, GenericAPIConfig, GenericAPIParams} from '../types.js';
import {BaseAPI} from './BaseAPI.js';


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
        return this.executeWithWebSocket({formData: params as Record<string, string>}, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        const targetValue = formData['target'] || '';
        const url = `${this.options.baseURL}${this.apiConfig.endpoint}${targetValue}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {target: _, ...restFormData} = formData;
        return {
            url,
            formData: restFormData,
        };
    }
}