import {BaseAPI} from '@/api/BaseAPI'
import type {APIConfig, GenericParams} from '@/types'


export class GenericAPI extends BaseAPI<GenericParams> {
    constructor(config: APIConfig) {
        super(config);

    }

    protected prepareFormData(params: GenericParams): Record<string, string> {
        return params as Record<string, string>;
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        const url = `${this.options?.baseURL}${this.config.endpoint}${formData['target'] || ''}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {target: _, ...restFormData} = formData;
        return {
            url,
            formData: restFormData,
        };
    }
}