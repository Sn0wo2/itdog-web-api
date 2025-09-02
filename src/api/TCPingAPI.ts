import { BaseAPI } from './BaseAPI';
import { md5_16, parseScriptVariables, buildApiRequest, isNodeEnvironment, parseHtml, findTaskIdScript } from '../utils';
import { ItdogOptions } from '../types';


export interface TCPingParams {
    target: string;
    port?: string;
    line?: string;
    timeout?: string;
}

export class TCPingAPI extends BaseAPI<TCPingParams> {
    constructor(options: ItdogOptions) {
        super(options, {
            baseURL: options.baseURL || 'https://www.itdog.cn',
            endpoint: '/tcping/'
        });
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        // 对于TCPingAPI，target参数用于URL path
        return buildApiRequest(this.options.baseURL || 'https://www.itdog.cn', this.config.endpoint, formData, true);
    }

    async execute(params: TCPingParams, onMessage?: (data: unknown) => void) {
        this.clear();
        
        const formData: Record<string, string> = {
            target: params.target,
            line: params.line || '',
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
}