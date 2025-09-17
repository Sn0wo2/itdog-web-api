import {API_BASE_URL} from '@/data/const'
import type {WebSocketConfig} from '@/types'
import {WebSocket} from 'ws';


export class WebSocketHandler {
    private websocket: WebSocket | null = null;
    private receivedData: unknown[] = [];
    private isConnected = false;

    async connect(config: WebSocketConfig, onMessage?: (data: unknown) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            this.cleanup();

            try {
                this.websocket = new WebSocket(config.url, {
                    headers: {
                        'Origin': new URL(API_BASE_URL).origin,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
                        ...config.headers,
                    }
                });
            } catch (error) {
                reject(new Error(`Failed to create WebSocket: ${error}`));
                return;
            }

            const timeout = setTimeout(() => {
                if (!this.isConnected) {
                    this.cleanup();
                    resolve(); // timeout = ok, not an error
                }
            }, config.timeout || 10000);

            this.websocket.onopen = () => {
                this.isConnected = true;
                if (config.initialMessage) {
                    try {
                        this.websocket?.send(JSON.stringify(config.initialMessage));
                    } catch {
                        // ignore send errors, connection still works
                    }
                }
            };

            this.websocket.onmessage = (event) => {
                let data: unknown;
                try {
                    const message = event.data.toString();
                    data = JSON.parse(message);
                } catch {
                    data = event.data;
                }
                this.receivedData.push(data);
                onMessage?.(data);
            };

            this.websocket.onclose = () => {
                this.isConnected = false;
                clearTimeout(timeout);
                resolve();
            };

            this.websocket.onerror = (error) => {
                this.isConnected = false;
                clearTimeout(timeout);
                reject(new Error(`WebSocket error: ${error.message}`));
            };
        });
    }

    close(): void {
        this.cleanup();
    }

    getMessages(): unknown[] {
        return [...this.receivedData];
    }

    getMessageCount(): number {
        return this.receivedData.length;
    }

    isWebSocketConnected(): boolean {
        return this.isConnected && this.websocket?.readyState === WebSocket.OPEN;
    }

    clearMessages(): void {
        this.receivedData = [];
    }

    private cleanup(): void {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.isConnected = false;
    }
}