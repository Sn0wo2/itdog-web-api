import { WebSocketHandler } from '../WebSocketHandler';
import { ItdogOptions } from '../types';

export interface APIConfig {
    baseURL: string;
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
    protected options: ItdogOptions;
    protected config: APIConfig;

    protected constructor(options: ItdogOptions, config: APIConfig) {
        this.options = options;
        this.config = config;
        this.wsHandler = new WebSocketHandler();
    }

    abstract execute(params: T, onMessage?: (data: unknown) => void): Promise<R>;

    protected abstract buildRequest(formData: Record<string, string>): { url: string; formData: Record<string, string> };

    protected async makeRequest(formData: Record<string, string>): Promise<string> {
        const { url, formData: processedFormData } = this.buildRequest(formData);
        const response = await fetch(url, {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(processedFormData).toString(),
            method: this.config.method || "POST"
        });

        return response.text();
    }
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

    close(): void {
        this.wsHandler.close();
    }

    clear(): void {
        this.wsHandler.clear();
    }
}