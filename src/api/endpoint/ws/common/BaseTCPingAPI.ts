import {BaseWSAPI} from '@/api/endpoint/ws/common/BaseWSAPI'
import type {TCPingParams} from '@/types'
import {buildAPIRequestWithTarget} from '@/utils'


export class BaseTCPingAPI extends BaseWSAPI<TCPingParams> {
    protected prepareFormData(params: TCPingParams): Record<string, string | undefined | null> {
        return {
            target: params.target,
            line: params.line || '',
            button_click: 'yes',
            mode: params.mode || null,
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
        };
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildAPIRequestWithTarget(this.options?.baseURL as string, this.config.endpoint, formData);
    }
}