import {BaseAPI} from '@/api/BaseAPI'
import {getRandomNodes, updateNodesFromHtml} from '@/data/nodes'
import type {APIResult, TraceRouteParams} from '@/types'
import {buildAPIRequestWithTarget} from '@/utils'

export class TraceRouteAPI extends BaseAPI<TraceRouteParams> {
    constructor() {
        super({
            endpoint: 'traceroute/'
        });
    }


    async _makeHttpRequest(formData: Record<string, string>): Promise<APIResult> {
        const response = await super._makeHttpRequest(formData);

        updateNodesFromHtml(await response?.rawResponse.text());

        return response;
    }

    protected prepareFormData(params: TraceRouteParams): Record<string, string> {
        const selectedNodeId = params.node ? params.node : getRandomNodes();
        return {
            node: Array.isArray(selectedNodeId) ? selectedNodeId[0] : selectedNodeId,
            target: params.target,
            dns_server_type: params.dnsServerType || 'isp',
            dns_server: params.dnsServerType === 'custom' && params.dnsServer ? params.dnsServer : ''
        };
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildAPIRequestWithTarget(this.options?.baseURL as string, this.config.endpoint, formData);
    }
}