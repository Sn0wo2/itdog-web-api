import {WebSocket} from 'ws';
import type {WebSocketMessage} from './types.js';

export interface WebSocketConfig {
    url: string;
    initialMessage?: WebSocketMessage;
    timeout?: number;
}

export class WebSocketHandler {
    private websocket: WebSocket | null = null;
    private receivedData: unknown[] = [];
    private isConnected = false;

    async connect(config: WebSocketConfig, onMessage?: (data: unknown) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            this.cleanup();

            try {
                this.websocket = new WebSocket(config.url);
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
                reject(new Error(`WebSocket error: ${error}`));
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