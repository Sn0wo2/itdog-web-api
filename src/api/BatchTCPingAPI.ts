import {ITDOG_HASH_TOKEN} from "../data/const";
import { BaseAPI } from './BaseAPI';
import { md5_16, parseScriptVariables, parseHtml, findTaskIdScript } from '../utils';
import { ItdogOptions } from '../types';


export interface BatchTCPingParams {
    target: string;
    port?: string;
    line?: string;
    timeout?: string;
}

export class BatchTCPingAPI extends BaseAPI<BatchTCPingParams> {
    constructor(options: ItdogOptions) {
        super(options, {
            baseURL: options.baseURL || 'https://www.itdog.cn',
            endpoint: '/batch_tcping/'
        });
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        // 对于BatchTCPingAPI，所有参数都在表单数据中
        const url = `${this.options.baseURL}${this.config.endpoint}`;
        return { url, formData };
    }

    async execute(params: BatchTCPingParams, onMessage?: (data: unknown) => void) {
        this.clear();
        
        const formData: Record<string, string> = {
            line: params.target || '',
            port: params.port || '80',
            timeout: params.timeout || '3',
            button_click: 'yes'
        };

        const html = await this.makeRequest(formData);
        const $ = parseHtml(html);
        
        const scriptContent = findTaskIdScript($);

        if (!scriptContent) {
            throw new Error("Cannot find script with task_id");
        }

        const vars = parseScriptVariables(scriptContent);
        const task_id = vars["task_id"] as string;
        const wss_url = vars["wss_url"] as string;


        const task_token = md5_16(task_id + (this.options.hashToken || ITDOG_HASH_TOKEN));

        const result = this.createResult(
            task_id,
            task_token,
            wss_url,
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
}