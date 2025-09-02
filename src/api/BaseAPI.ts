import {Request} from '../Request.js';
import {ClientOptions} from '../types.js';
import {executeAPIWithWebSocket} from '../utils.js';
import {WebSocketHandler} from '../WebSocketHandler.js';

export interface APIConfig {
    endpoint: string;
    method?: string;
}

export interface APIResult {
    taskId: string;
    taskToken: string;
    wssUrl: string;
    messages: unknown[];

    forEach(callback: (index: number, item: unknown) => void): void;

    getMessage(index: number): unknown | undefined;

    getMessageCount(): number;

    [key: string]: unknown;
}

export abstract class BaseAPI<T = any, R = APIResult> {
    protected wsHandler: WebSocketHandler;
    protected options: ClientOptions;
    protected config: APIConfig;

    protected constructor(options: ClientOptions, config: APIConfig) {
        this.options = options;
        this.config = config;
        this.wsHandler = new WebSocketHandler();
    }

    abstract execute(params: T, onMessage?: (data: unknown) => void): Promise<R>;

    async request(params: T): Promise<Record<string, unknown>> {
        return this._makeHttpRequest(params as Record<string, string>);
    }

    getWebSocketHandler(): WebSocketHandler {
        return this.wsHandler;
    }

    close(): void {
        this.wsHandler.close();
    }

    protected async _makeHttpRequest(formData: Record<string, string>): Promise<Record<string, unknown>> {
        const {url, formData: processedFormData} = this.buildRequest(formData);
        return await Request.makeRequest({
            url,
            method: this.config.method || "POST",
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(processedFormData).toString()
        });
    }

    protected abstract buildRequest(formData: Record<string, string>): {
        url: string;
        formData: Record<string, string>
    };

    protected createResult(
        taskId: string,
        taskToken: string,
        wssUrl: string,
        additionalData: Record<string, unknown> = {}
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

    protected async executeWithWebSocket(
        formData: Record<string, string>,
        onMessage?: (data: unknown) => void
    ): Promise<APIResult> {
        return executeAPIWithWebSocket(this, formData, onMessage, this.options.hashToken);
    }
}