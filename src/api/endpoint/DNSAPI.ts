import {ClientOptions, DNSParams} from '../../types.js';
import {_buildAPIRequest} from '../../utils.js';
import {BaseAPI} from '../BaseAPI.js';

export class DNSAPI extends BaseAPI<DNSParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: 'dns/'
        });
    }

    async execute(params: DNSParams, onMessage?: (data: unknown) => void) {
        return this.executeWithWebSocket({
            formData: {
                target: params.target,
                line: params.line || '',
                dns_type: params.dnsType || 'a',
                dns_server_type: params.dnsServerType || 'isp',
                dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
            }
        }, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return _buildAPIRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }
}
