import {BaseAPI} from '@/api/BaseAPI'
import type {ClientOptions, HttpParams} from '@/types'
import {buildAPIRequest} from '@/utils'

export class HttpAPI extends BaseAPI<HttpParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: 'http'
        });
    }

    async execute(params: HttpParams, onMessage?: (data: unknown) => void) {
        return this.executeWithWebSocket({
            formData: {
                line: params.line || '',
                host: params.host,
                host_s: params.host,
                check_mode: params.checkMode || 'fast',
                ipv4: params.ipv4 || '',
                method: params.method || 'get',
                referer: params.referer || '',
                ua: params.userAgent || '',
                cookies: params.cookies || '',
                redirect_num: (params.redirectNum || 5).toString(),
                dns_server_type: params.dnsServerType || 'isp',
                dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
            }
        }, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildAPIRequest(this.options.baseURL as string, this.config.endpoint, formData);
    }
}