import {ITDOG_HASH_TOKEN} from '@/data/const'
import {Request} from '@/Request'
import type {APIConfig, APIResponse, APIResult, ClientOptions, FinalResponse, WebSocketConfig} from '@/types'
import {_md5_16} from '@/utils'
import {WebSocketHandler} from '@/WebSocketHandler'


export abstract class BaseAPI<T = Record<string, unknown>> {
    protected wsHandler: WebSocketHandler;
    protected config: APIConfig;
    protected options: ClientOptions | null = null;
    protected params: T | null = null;

    protected constructor(config: APIConfig) {
        this.config = config;
        this.wsHandler = new WebSocketHandler();
    }

    setOptions(options: ClientOptions): this {
        this.options = options
        return this
    }

    setParams(params: T): this {
        this.params = params;
        return this;
    }

    request(): APIResponse {
        if (!this.options) {
            throw new Error("Options must be set before calling request");
        }
        if (!this.params) {
            throw new Error('Parameters must be set before calling request');
        }

        const resultPromise = this._makeHttpRequest(Object.fromEntries(
            Object.entries(this.prepareFormData(this.params)).filter(([, value]) => value !== null && value !== undefined)
        ) as Record<string, string>);

        return {
            result: resultPromise,
            wsHandler: this.getWebSocketHandler(),
            execute: async (onMessage?: (data: unknown) => void): Promise<FinalResponse> => {
                const result = await resultPromise
                await this.executeWithWebSocket(result, onMessage)
                return ({
                    result,
                    wsHandler: this.getWebSocketHandler()
                })
            }
        };
    }

    getWebSocketHandler(): WebSocketHandler {
        return this.wsHandler;
    }

    close(): void {
        this.getWebSocketHandler().close();
    }

    async _makeHttpRequest(formData: Record<string, string>): Promise<APIResult> {
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
            fetch: this.options?.fetch
        });
    }

    protected abstract prepareFormData(params: T): Record<string, string | undefined | null>;

    protected abstract buildRequest(formData: Record<string, string>): {
        url: string;
        formData: Record<string, string>
    };

    protected async executeWithWebSocket(
        response: APIResult,
        onMessage?: (data: unknown) => void
    ): Promise<void> {
        if (!response.task_id || !response.wss_url) {
            throw new Error('Invalid API response: missing task_id or wss_url');
        }

        const taskToken = _md5_16(response.task_id + (this.options?.hashToken || ITDOG_HASH_TOKEN));

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

        await this.getWebSocketHandler().connect(wsCfg, onMessage);
    }
}