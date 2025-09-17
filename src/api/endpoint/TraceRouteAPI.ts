import {BaseAPI} from '@/api/BaseAPI'
import {getRandomNodes, updateNodesFromHtml} from '@/data/nodes'
import type {APIResponse, ClientOptions, TraceRouteParams} from '@/types'
import {_buildAPIRequest} from '@/utils'

export class TraceRouteAPI extends BaseAPI<TraceRouteParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: 'traceroute/'
        });
    }

    async execute(params: TraceRouteParams, onMessage?: (data: unknown) => void) {
        const selectedNodeId = params.node ? params.node : getRandomNodes()[0];
        return this.executeWithWebSocket({
            formData: {
                node: selectedNodeId || '',
                target: params.target,
                dns_server_type: params.dnsServerType || 'isp',
                dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
            }
        }, onMessage);
    }

    async _makeHttpRequest(formData: Record<string, string>): Promise<APIResponse> {
        const response = await super._makeHttpRequest(formData);

        if (response.rawResponse) {
            updateNodesFromHtml(await response.rawResponse.text());
        }

        return response;
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return _buildAPIRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }
}