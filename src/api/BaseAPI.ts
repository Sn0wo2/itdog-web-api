import {ITDOG_HASH_TOKEN} from "../data/const";
import {Request} from '../Request.js';
import type {APIConfig, APIResponse, APIResult, ClientOptions} from '../types.js';
import {_md5_16} from '../utils.js';
import {WebSocketHandler} from '../WebSocketHandler.js';


export abstract class BaseAPI<T = Record<string, unknown>, R = APIResult> {
    wsHandler: WebSocketHandler;
    protected options: ClientOptions;
    protected config: APIConfig;

    protected constructor(options: ClientOptions, config: APIConfig) {
        this.options = options;
        this.config = config;
        this.wsHandler = new WebSocketHandler();
    }

    abstract execute(params: T, onMessage?: (data: unknown) => void): Promise<R>;

    async request(params: T): Promise<APIResponse> {
        const response = await this._makeHttpRequest(params as Record<string, string>);
        return response as APIResponse;
    }

    getWebSocketHandler(): WebSocketHandler {
        return this.wsHandler;
    }

    close(): void {
        this.wsHandler.close();
    }

    async _makeHttpRequest(formData: Record<string, string>): Promise<APIResponse> {
        const {url, formData: processedFormData} = this.buildRequest(formData);
        return await Request.makeRequest({
            url,
            method: this.config.method || "POST",
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(processedFormData).toString(),
            timeout: 30000,
        });
    }

    createResult(
        taskId: string,
        taskToken: string,
        wssUrl: string,
        additionalData: APIResponse
    ): APIResult {
        return {
            taskId,
            taskToken,
            wssUrl,
            messages: this.wsHandler.getMessages(),
            forEach: (callback: (index: number, item: unknown) => void) => {
                this.wsHandler.getMessages().forEach((item, index) => callback(index, item));
            },
            getMessage: (index: number) => {
                return this.wsHandler.getMessages()[index];
            },
            getMessageCount: () => {
                return this.wsHandler.getMessageCount();
            },
            ...additionalData
        };
    }

    protected abstract buildRequest(formData: Record<string, string>): {
        url: string;
        formData: Record<string, string>
    };

    protected async executeWithWebSocket(
        formData: Record<string, string>,
        onMessage?: (data: unknown) => void
    ): Promise<APIResult> {
        const response = await this._makeHttpRequest(formData);

        if (!response.task_id || !response.wss_url) {
            throw new Error('Invalid API response: missing task_id or wss_url');
        }

        const taskToken = _md5_16(response.task_id + (this.options.hashToken || ITDOG_HASH_TOKEN));
        const result = this.createResult(response.task_id, taskToken, response.wss_url, response);

        await this.wsHandler.connect({
            url: response.wss_url,
            initialMessage: {
                task_id: response.task_id,
                task_token: taskToken,
            }
        }, onMessage);

        return result;
    }
}