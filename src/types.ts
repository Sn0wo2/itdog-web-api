export interface ClientOptions {
    baseURL?: string;
    hashToken?: string;
}

export interface WebSocketMessage {
    task_id?: string;
    task_token?: string;

    [key: string]: unknown;
}

export interface APIResponse {
    task_id: string;
    wss_url: string;

    [key: string]: unknown;
}