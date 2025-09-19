import {BaseAPI} from '@/api/BaseAPI'
import type {HTTPingParams} from '@/types'
import {buildAPIRequest} from '@/utils'

export class HTTPingAPI extends BaseAPI<HTTPingParams> {
    constructor() {
        super({
            endpoint: 'http'
        });
    }

    protected prepareFormData(params: HTTPingParams): Record<string, string | undefined | null> {
        return {
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
        };
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildAPIRequest(this.options?.baseURL as string, this.config.endpoint, formData);
    }
}