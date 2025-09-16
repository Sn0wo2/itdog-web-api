import {getAllNodes, getRandomNodes, updateNodesFromHtml} from '../../data/nodes.js';
import {APIResponse, BatchTCPingParams, ClientOptions} from '../../types.js';
import {BaseAPI} from '../BaseAPI.js';

export class BatchTCPingAPI extends BaseAPI<BatchTCPingParams> {
    constructor(options: ClientOptions) {
        super(options, {endpoint: 'batch_tcping'});
    }

    async execute(params: BatchTCPingParams, onMessage?: (data: unknown) => void) {
        const hostsWithPort = params.hosts.map(host =>
            host.includes(':') ? host : `${host}:${params.port || '80'}`
        );

        const selectedNodeIds = Array.isArray(params.nodeIds)
            ? params.nodeIds
            : params.nodeIds ? params.nodeIds.split(',') : getRandomNodes();

        return {
            ...await this.executeWithWebSocket({
                formData: {
                    host: hostsWithPort.join('\r\n'),
                    port: params.port || '80',
                    cidr_filter: params.cidrFilter ? 'true' : 'false',
                    gateway: params.gateway || 'first',
                    node_id: selectedNodeIds.join(',')
                }
            }, onMessage),
            nodeIds: selectedNodeIds,
            availableNodes: getAllNodes()
        };
    }

    async _makeHttpRequest(formData: Record<string, string>): Promise<APIResponse> {
        const response = await super._makeHttpRequest(formData);

        if (response.rawResponse) {
            updateNodesFromHtml(await response.rawResponse.text());
        }

        return response;
    }

    protected buildRequest(formData: Record<string, string>) {
        return {url: `${this.options.baseURL}${this.config.endpoint}`, formData};
    }
}