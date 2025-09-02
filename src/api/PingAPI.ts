import { BaseAPI } from './BaseAPI';
import { md5_16, parseScriptVariables, buildApiRequest, parseHtml } from '../utils';
import { ItdogOptions } from '../types';


export interface PingParams {
    target: string;
    line?: string;
    dnsServerType?: string;
    dnsServer?: string;
}

export class PingAPI extends BaseAPI<PingParams> {
    constructor(options: ItdogOptions) {
        super(options, {
            baseURL: options.baseURL || 'https://www.itdog.cn',
            endpoint: '/ping/'
        });
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildApiRequest(this.config.baseURL, this.config.endpoint, formData, true);
    }

    async execute(params: PingParams, onMessage?: (data: unknown) => void) {
        this.clear();
        
        const formData: Record<string, string> = {
            target: params.target,
            line: params.line || '',
            button_click: 'yes',
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServer || ''
        };

        const html = await this.makeRequest(formData);
        const $ = parseHtml(html);
        const scriptContent = $('script').eq(14).html();

        if (!scriptContent) {
            throw new Error("Cannot find #15 script");
        }

        const vars = parseScriptVariables(scriptContent);
        const encryptSecrets = this.options.hashToken || "token_20230313000136kwyktxb0tgspm00yo5";
        const task_token = md5_16((vars["task_id"] as string) + encryptSecrets);

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