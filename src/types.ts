export interface ClientOptions {
    baseURL?: string;
    hashToken?: string;
}

export interface WebSocketMessage {
    task_id?: string;
    task_token?: string;

    [key: string]: unknown;
}

export interface WebSocketConfig {
    url: string;
    initialMessage?: WebSocketMessage;
    timeout?: number;
}

export interface APIResponse {
    task_id: string;
    wss_url: string;
    rawResponse?: Response;

    [key: string]: unknown;
}

export interface RequestConfig {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string | URLSearchParams;
    timeout?: number;
}

export interface APIConfig {
    endpoint: string;
    method?: string;
}

export interface GenericAPIConfig extends Partial<APIConfig> {
    endpoint: string;
    method?: string;
}

export interface APIResult {
    taskId: string;
    taskToken: string;
    wssUrl: string;
    messages: unknown[];
    nodeIds?: string[];
    availableNodes?: Array<{ id: string; name: string; category: string }>;

    forEach(callback: (index: number, item: unknown) => void): void;

    getMessage(index: number): unknown | undefined;

    getMessageCount(): number;

    [key: string]: unknown;
}

export interface Node {
    id: string;
    name: string;
    category: string;
}

export interface PingParams {
    target: string;
    line?: string;
    dnsServerType?: "isp" | "custom";
    dnsServer?: string;
}

export interface TCPingParams {
    target: string;
    port?: string;
    line?: string;
    timeout?: string;
}

export interface BatchTCPingParams {
    hosts: string[];
    nodeIds?: string | string[];
    port?: string;
    cidrFilter?: boolean;
    gateway?: string;
}

export interface HttpParams {
    host: string;
    line?: string;
    checkMode?: 'fast' | 'normal';
    ipv4?: string;
    method?: 'get' | 'post';
    referer?: string;
    userAgent?: string;
    cookies?: string;
    redirectNum?: number;
    dnsServerType?: 'isp' | 'custom';
    dnsServer?: string;
}

export interface TraceRouteParams {
    host: string;
    node?: string;
    dnsServerType?: 'isp' | 'custom';
    dnsServer?: string;
}

export interface GenericAPIParams {
    [key: string]: unknown;
}

export interface CheerioAPI {
    (selector: string): CheerioElement;

    (element: unknown): CheerioElement;
}

export interface CheerioElement {
    each(callback: (index: number, element: unknown) => void | false): void;

    html(): string | null;
}

export interface CheerioNode {
    children?: CheerioNode[];
    data?: string;
}

export interface _BaseAPIInstance {
    wsHandler: {
        connect(config: {
            url: string;
            initialMessage: WebSocketMessage
        }, onMessage?: (data: unknown) => void): Promise<void>;
    };

    _makeHttpRequest(formData: Record<string, string>): Promise<APIResponse>;

    createResult(taskId: string, taskToken: string, wssUrl: string, vars: APIResponse): APIResult;
}