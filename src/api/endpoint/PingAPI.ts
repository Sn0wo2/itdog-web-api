import {ClientOptions} from '../../types.js';
import {buildApiRequest} from '../../utils.js';
import {BaseAPI} from '../BaseAPI.js';


export interface PingParams {
    target: string;
    line?: string;
    dnsServerType?: "isp" | "custom";
    dnsServer?: string;
}

export class PingAPI extends BaseAPI<PingParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: '/ping/'
        });
    }

    async execute(params: PingParams, onMessage?: (data: unknown) => void) {
        const formData: Record<string, string> = {
            target: params.target,
            line: params.line || '',
            button_click: 'yes',
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && !params.dnsServer ? '' : params.dnsServer || ''
        };

        return this.executeWithWebSocket(formData, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildApiRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }
}