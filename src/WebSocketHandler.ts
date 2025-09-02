import {WebSocket} from 'ws';

export interface WebSocketConfig {
    url: string;
    initialMessage?: unknown;
    timeout?: number;
}

export class WebSocketHandler {
    private websocket: any | null = null;
    private receivedData: unknown[] = [];
    async connect(config: WebSocketConfig, onMessage?: (data: unknown) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.websocket) {
                this.websocket.close();
            }

            this.websocket = new WebSocket(config.url);

            this.websocket.onopen = () => {
                if (config.initialMessage) {
                    this.websocket.send(JSON.stringify(config.initialMessage));
                }
            };

            this.websocket.onmessage = (event: any) => {
                let data: any;
                try {
                    const message = event.data.toString();
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
    }
}