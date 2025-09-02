import {ClientOptions} from '../../types.js';
import {BaseAPI} from '../BaseAPI.js';


export interface BatchTCPingParams {
    hosts: string[];
    nodeIds?: string;
    port?: string;
    line?: string;
    timeout?: string;
    cidrFilter?: boolean;
    gateway?: string;
}

export class BatchTCPingAPI extends BaseAPI<BatchTCPingParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: '/batch_tcping/'
        });
    }

    async execute(params: BatchTCPingParams, onMessage?: (data: unknown) => void) {
        const formData: Record<string, string> = {
            host: params.hosts.join('\n'),
            port: params.port || '80',
            line: params.line || '',
            timeout: params.timeout || '3',
            button_click: 'yes',
            cidr_filter: params.cidrFilter ? 'true' : 'false',
            gateway: params.gateway || 'first'
        };

        if (params.nodeIds) {
            formData['node_id'] = params.nodeIds;
        }

        return this.executeWithWebSocket(formData, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        const url = `${this.options.baseURL}${this.config.endpoint}`;
        return {url, formData};
    }
}