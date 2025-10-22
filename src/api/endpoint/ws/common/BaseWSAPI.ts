import {BaseAPI} from '@/api/endpoint/http/common/BaseAPI'
import {ITDOG_HASH_TOKEN} from '@/data/const'
import {Request} from '@/Request'
import type {APIConfig, APIResult, ClientOptions, FinalWSResponse, WebSocketConfig, WSResponse} from '@/types'
import {_md5_16} from '@/utils'
import {WebSocketHandler} from '@/WebSocketHandler'


export abstract class BaseWSAPI<T = Record<string, unknown>> extends BaseAPI {
    protected wsHandler: WebSocketHandler;
    protected config: APIConfig;
    protected params: T | null = null;

    protected constructor(config: APIConfig, options?: ClientOptions) {
        super(options);
        this.config = config;
        this.wsHandler = new WebSocketHandler();
    }

    public setParams(params: T): this {
        this.params = params;
        return this;
    }

    public async execute(params: T, onMessage?: (data: unknown) => void): Promise<FinalWSResponse> {
        this.setParams(params);
        const response = this.request();
        return response.execute(onMessage);
    }

    protected request(): WSResponse {
        if (!this.options) {
            throw new Error("Options must be set before calling request");
        }
        if (!this.params) {
            throw new Error('Parameters must be set before calling request');
        }

        const resultPromise = this._makeHTTPRequest(Object.fromEntries(
            Object.entries(this.prepareFormData(this.params)).filter(([, value]) => value !== null && value !== undefined)
        ) as Record<string, string>);

        return {
            result: resultPromise,
            wsHandler: this.getWebSocketHandler(),
            execute: async (onMessage?: (data: unknown) => void): Promise<FinalWSResponse> => {
                const result = await resultPromise
                await this.executeWithWebSocket(result, onMessage)
                return ({
                    result,
                    wsHandler: this.getWebSocketHandler()
                })
            }
        };
    }

    protected getWebSocketHandler(): WebSocketHandler {
        return this.wsHandler;
    }

    protected close(): void {
        this.getWebSocketHandler().close();
    }

    protected async _makeHTTPRequest(formData: Record<string, string>): Promise<APIResult> {
        const {url, formData: processedFormData} = this.buildRequest(formData)

        return await Request.makeTaskRequest({
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
        result: APIResult,
        onMessage?: (data: unknown) => void
    ) {
        if (!result.wss_url) {
            throw new Error('Invalid API result: missing task_id or wss_url');
        }

        const taskToken = _md5_16(result.task_id + (this.options?.hashToken || ITDOG_HASH_TOKEN));

        const wsCfg: WebSocketConfig = {
            url: result.wss_url,
            initialMessage: {
                task_id: result.task_id,
                task_token: taskToken,
            },
        }

        if (result.rawRequest.headers) {
            wsCfg.headers = {
                "origin": new URL(result.rawRequest.url).origin,
                "user-agent": new Headers(result.rawRequest.headers).get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0'
            }
        }

        await this.getWebSocketHandler().connect(wsCfg, onMessage);
    }
}