import {ITDOG_HASH_TOKEN} from '@/data/const'
import {Request} from '@/Request'
import type {
    APIConfig,
    APIResponse,
    APIResult,
    ClientOptions,
    ExecuteWithWebSocketConfig,
    WebSocketConfig
} from '@/types'
import {_md5_16} from '@/utils'
import {WebSocketHandler} from '@/WebSocketHandler'


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
        return await this._makeHttpRequest(params as Record<string, string>);
    }

    getWebSocketHandler(): WebSocketHandler {
        return this.wsHandler;
    }

    close(): void {
        this.wsHandler.close();
    }

    async _makeHttpRequest(formData: Record<string, string>): Promise<APIResponse> {
        const {url, formData: processedFormData} = this.buildRequest(formData)

        return await Request.makeRequest({
            rawRequest: {
                url,
                method: this.config.method || "POST",
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(processedFormData).toString(),
            },
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetch: (this.options as any).fetch
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
        config: ExecuteWithWebSocketConfig,
        onMessage?: (data: unknown) => void
    ): Promise<APIResult> {
        const response = await this._makeHttpRequest(config.formData);

        if (!response.task_id || !response.wss_url) {
            throw new Error('Invalid API response: missing task_id or wss_url');
        }

        const taskToken = _md5_16(response.task_id + (this.options.hashToken || ITDOG_HASH_TOKEN));

        const wsCfg: WebSocketConfig = {
            url: response.wss_url,
            initialMessage: {
                task_id: response.task_id,
                task_token: taskToken,
            },
        }

        if (response.rawRequest.headers) {
            wsCfg.headers = {
                "origin": new URL(response.rawRequest.url).origin,
                "user-agent": new Headers(response.rawRequest.headers).get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0'
            }
        }

        await this.wsHandler.connect(wsCfg, onMessage);

        return this.createResult(response.task_id, taskToken, response.wss_url, response);
    }
}