import {BaseAPI} from '@/api/BaseAPI'
import type {DNSParams} from '@/types'
import {buildAPIRequestWithTarget} from "@/utils";

export class DNSAPI extends BaseAPI<DNSParams> {
    constructor() {
        super({
            endpoint: 'dns/'
        });
    }

    protected prepareFormData(params: DNSParams): Record<string, string | undefined | null> {
        return {
            target: params.target,
            line: params.line || '',
            dns_type: params.dnsType || 'a',
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
        };
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildAPIRequestWithTarget(this.options?.baseURL as string, this.config.endpoint, formData);
    }
}
