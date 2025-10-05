import {BaseWSAPI} from '@/api/endpoint/ws/common/BaseWSAPI'
import type {PingParams} from '@/types'
import {buildAPIRequestWithTarget} from '@/utils'


export class BasePingAPI extends BaseWSAPI<PingParams> {
    protected prepareFormData(params: PingParams): Record<string, string | undefined | null> {
        return {
            target: params.target,
            line: params.line || '',
            button_click: 'yes',
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && !params.dnsServer ? '' : params.dnsServer || ''
        };
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        if (!this.options?.baseURL) {
            throw new Error('baseURL is not set in options');
        }
        return buildAPIRequestWithTarget(this.options.baseURL, this.config.endpoint, formData);
    }
}