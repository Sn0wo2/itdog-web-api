const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let WebSocket: any;
if (isNode) {
    WebSocket = require('ws');
}

export interface WebSocketMessage {
    [key: string]: unknown;
}

export interface WebSocketConfig {
    url: string;
    initialMessage?: unknown;
    timeout?: number;
}

export class WebSocketHandler {
    private websocket: any | null = null;
    private receivedData: unknown[] = [];
    private forEachCallback: ((item: unknown, index: number) => void) | null = null;

    async connect(config: WebSocketConfig, onMessage?: (data: unknown) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.websocket) {
                this.websocket.close();
            }
            
            // 根据环境选择WebSocket实现
            this.websocket = isNode ? new WebSocket(config.url) : new (window as any).WebSocket(config.url);

            this.websocket.onopen = () => {
                if (config.initialMessage) {
                    this.websocket.send(JSON.stringify(config.initialMessage));
                }
            };

            this.websocket.onmessage = (event: any) => {
                let data: any;
                try {
                    const message = isNode ? event.data.toString() : event.data;
                    data = JSON.parse(message);
                } catch (e) {
                    data = event.data;
                }
                this.receivedData.push(data);
                if (onMessage) {
                    onMessage(data);
                }
            };

            const timeout = setTimeout(() => {
                if (this.websocket) {
                    this.websocket.close();
                }
                resolve();
            }, config.timeout || 10000);

            this.websocket.onclose = () => {
                clearTimeout(timeout);
                resolve();
            };

            this.websocket.onerror = (err: Error) => {
                clearTimeout(timeout);
                reject(err);
            };
        });
    }

    forEach(callback: (item: unknown, index: number) => void): void {
        this.receivedData.forEach(callback);
    }

    getMessages(): unknown[] {
        return [...this.receivedData];
    }

    getMessageCount(): number {
        return this.receivedData.length;
    }

    close(): void {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.forEachCallback = null;
    }

    clear(): void {
        this.receivedData = [];
        this.forEachCallback = null;
    }
}