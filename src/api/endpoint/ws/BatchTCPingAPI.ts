import {BaseWSAPI} from '@/api/endpoint/ws/common/BaseWSAPI'
import {getRandomNodes, updateNodesFromHtml} from '@/data/nodes'
import type {APIResult, BatchTCPingParams} from '@/types'
import {buildAPIRequest} from "@/utils";

export class BatchTCPingAPI extends BaseWSAPI<BatchTCPingParams> {
    constructor() {
        super({
            endpoint: 'batch_tcping'
        });
    }

    async _makeHTTPRequest(formData: Record<string, string>): Promise<APIResult> {
        const response = await super._makeHTTPRequest(formData);

        if (response.rawResponse) {
            updateNodesFromHtml(await response.rawResponse.text());
        }

        return response;
    }

    protected prepareFormData(params: BatchTCPingParams): Record<string, string | undefined | null> {
        const hostsWithPort = params.hosts.map(host =>
            host.includes(':') ? host : `${host}:${params.port || '80'}`
        );

        let selectedNodeIds: string[];
        if (Array.isArray(params.nodeIds)) {
            selectedNodeIds = params.nodeIds;
        } else if (params.nodeIds) {
            selectedNodeIds = params.nodeIds.split(',');
        } else {
            selectedNodeIds = getRandomNodes();
        }

        return {
            host: hostsWithPort.join('\r\n'),
            port: params.port || '80',
            cidr_filter: params.cidrFilter ? 'true' : 'false',
            gateway: params.gateway || 'first',
            node_id: selectedNodeIds.join(',')
        };
    }

    protected buildRequest(formData: Record<string, string>) {
        return buildAPIRequest(this.options?.baseURL as string, this.config.endpoint, formData);
    }
}