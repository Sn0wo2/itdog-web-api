import {ClientOptions} from '../../types.js';
import {buildApiRequest} from '../../utils.js';
import {BaseAPI} from '../BaseAPI.js';


export interface TCPingParams {
    target: string;
    port?: string;
    line?: string;
    timeout?: string;
}

export class TCPingAPI extends BaseAPI<TCPingParams> {
    constructor(options: ClientOptions) {
        super(options, {
            endpoint: '/tcping/'
        });
    }

    async execute(params: TCPingParams, onMessage?: (data: unknown) => void) {
        const formData: Record<string, string> = {
            target: params.target,
            line: params.line || '',
            port: params.port || '80',
            timeout: params.timeout || '3',
            button_click: 'yes'
        };

        return this.executeWithWebSocket(formData, onMessage);
    }

    protected buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> } {
        return buildApiRequest(this.options.baseURL as string, this.config.endpoint, formData, true);
    }
}