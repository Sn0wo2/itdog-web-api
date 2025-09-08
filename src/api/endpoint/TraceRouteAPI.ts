import {getRandomNodes} from "../../data/nodes";
import {ClientOptions, TraceRouteParams} from '../../types.js';
import {buildApiRequest} from '../../utils.js';
import {BaseAPI} from '../BaseAPI.js';

export class TraceRouteAPI extends BaseAPI<TraceRouteParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: '/traceroute/'
        });
    }

    async execute(params: TraceRouteParams, onMessage?: (data: unknown) => void) {
        const selectedNodeId = params.node ? params.node : getRandomNodes()[0];

        const formData: Record<string, string> = {
            node: selectedNodeId || '',
            target: params.host,
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
        };

        return this.executeWithWebSocket(formData, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildApiRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }
}