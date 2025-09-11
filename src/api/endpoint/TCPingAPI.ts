import {TCPingParams} from "../../types";
import {ClientOptions} from '../../types.js';
import {_buildAPIRequest} from '../../utils.js';
import {BaseAPI} from '../BaseAPI.js';


export class TCPingAPI extends BaseAPI<TCPingParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: '/tcping/'
        });
    }

    async execute(params: TCPingParams, onMessage?: (data: unknown) => void) {
        return this.executeWithWebSocket({
            target: params.target,
            line: params.line || '',
            button_click: 'yes',
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
        }, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return _buildAPIRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }
}
