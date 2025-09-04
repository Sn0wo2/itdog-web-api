import {TCPingParams} from "../../types";
import {ClientOptions} from '../../types.js';
import {buildApiRequest} from '../../utils.js';
import {BaseAPI} from '../BaseAPI.js';


export class TCPingAPI extends BaseAPI<TCPingParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: '/tcping/'
        });
    }

    async execute(params: TCPingParams, onMessage?: (data: unknown) => void) {
        const formData: Record<string, string> = {
            target: params.port ? `${params.target}:${params.port}` : params.target,
            line: params.line || '',
            button_click: 'yes',
            dns_server_type: 'isp',
            dns_server: ''
        };

        return this.executeWithWebSocket(formData, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildApiRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }
}
