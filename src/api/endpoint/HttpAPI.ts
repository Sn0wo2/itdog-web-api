import {ClientOptions, HttpParams} from '../../types.js';
import {buildApiRequest} from '../../utils.js';
import {BaseAPI} from '../BaseAPI.js';

export class HttpAPI extends BaseAPI<HttpParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: '/http/'
        });
    }

    async execute(params: HttpParams, onMessage?: (data: unknown) => void) {
        const formData: Record<string, string> = {
            line: params.line || '',
            host: params.host,
            host_s: this.extractHostname(params.host),
            check_mode: params.checkMode || 'fast',
            ipv4: params.ipv4 || '',
            method: params.method || 'get',
            referer: params.referer || '',
            ua: params.userAgent || '',
            cookies: params.cookies || '',
            redirect_num: (params.redirectNum || 5).toString(),
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
        };

        return this.executeWithWebSocket(formData, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildApiRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }

    private extractHostname(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            const match = url.match(/^(?:https?:\/\/)?([^/]+)/);
            return match ? match[1] : url;
        }
    }
}