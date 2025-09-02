import {API_BASE_URL} from "../data/const";
import { BaseAPI } from './BaseAPI';
import { md5_16, parseScriptVariables, buildApiRequest, isNodeEnvironment, parseHtml, findTaskIdScript } from '../utils';
import { ItdogOptions } from '../types';
import { ApiEndpoint } from '../types';


export class GenericAPI extends BaseAPI<Record<string, any>> {
    private apiConfig: ApiEndpoint;

    constructor(options: ItdogOptions, apiConfig: ApiEndpoint) {
        super(options, {
            baseURL: options.baseURL || 'https://www.itdog.cn',
            endpoint: apiConfig.endpoint,
            method: apiConfig.method || 'POST'
        });
        this.apiConfig = apiConfig;
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildApiRequest(this.options.baseURL || API_BASE_URL, this.config.endpoint, formData, true);
    }

    async execute(params: Record<string, any>, onMessage?: (data: unknown) => void) {
        this.clear();
        
        const formData = this.createFormData(params);
        
        const target = params.target || params.host || '';
        if (!target) {
            throw new Error("Target parameter is required");
        }

        formData['target'] = target;

        const html = await this.makeRequest(formData);
        const $ = parseHtml(html);
        
        const scriptContent = findTaskIdScript($);

        if (!scriptContent) {
            throw new Error("Cannot find script with task_id");
        }

        const vars = parseScriptVariables(scriptContent);
        const task_token = md5_16((vars["task_id"] as string) + "token_20230313000136kwyktxb0tgspm00yo5");

        const result = this.createResult(
            vars["task_id"] as string,
            task_token,
            vars["wss_url"] as string,
            vars
        );

        await this.wsHandler.connect({
            url: result.wssUrl,
            initialMessage: {
                task_id: result.taskId,
                task_token: result.taskToken,
            }
        }, onMessage);

        return result;
    }

    private createFormData(params: Record<string, any>): Record<string, string> {
        const formData: Record<string, string> = { ...this.apiConfig.defaultParams };
        
        Object.entries(params).forEach(([key, value]) => {
            const mappedKey = this.apiConfig.paramMap?.[key] || key;
            if (value !== undefined && value !== null && mappedKey !== 'target') {
                formData[mappedKey] = String(value);
            }
        });
        
        return formData;
    }
}