import {getAllNodes, getRandomNodes, updateNodesFromHtml} from '../../data/nodes.js';
import {Request} from '../../Request.js';
import {APIResponse, BatchTCPingParams, ClientOptions} from '../../types.js';
import {BaseAPI} from '../BaseAPI.js';

export class BatchTCPingAPI extends BaseAPI<BatchTCPingParams> {
    constructor(options: ClientOptions) {
        super(options, {endpoint: '/batch_tcping/'});
    }

    async _makeHttpRequest(formData: Record<string, string>): Promise<APIResponse> {
        const {url, formData: processedFormData} = this.buildRequest(formData);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(processedFormData).toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        updateNodesFromHtml(html);

        return Request.parseResponse(html);
    }

    async execute(params: BatchTCPingParams, onMessage?: (data: unknown) => void) {
        const hostsWithPort = params.hosts.map(host =>
            host.includes(':') ? host : `${host}:${params.port || '80'}`
        );

        const selectedNodeIds = Array.isArray(params.nodeIds)
            ? params.nodeIds
            : params.nodeIds ? params.nodeIds.split(',') : getRandomNodes();

        const formData = {
            host: hostsWithPort.join('\r\n'),
            port: params.port || '80',
            cidr_filter: params.cidrFilter ? 'true' : 'false',
            gateway: params.gateway || 'first',
            node_id: selectedNodeIds.join(',')
        };

        const result = await this.executeWithWebSocket(formData, onMessage);

        return {
            ...result,
            nodeIds: selectedNodeIds,
            availableNodes: getAllNodes()
        };
    }

    protected buildRequest(formData: Record<string, string>) {
        return {url: `${this.options.baseURL}${this.config.endpoint}`, formData};
    }
}