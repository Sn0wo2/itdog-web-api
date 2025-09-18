export interface ClientOptions {
    baseURL?: string;
    hashToken?: string;
    fetch?: typeof fetch;
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
    headers?: Record<string, string>;
}

export interface APIResponse {
    task_id: string;
    wss_url: string;
    rawRequest: RequestInit & {
        url: string | URL;
    };
    rawResponse?: Response;

    [key: string]: unknown;
}

export interface RequestConfig extends RequestInit {
    rawRequest: RequestInit & {
        url: string | URL;
    };
    fetch?: typeof fetch;
}

export interface ExecuteWithWebSocketConfig {
    formData: Record<string, string>;
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
    line?: string;
    dnsServerType?: 'isp' | 'custom',
    dnsServer?: string,
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
    checkMode?: 'fast' | 'slow  ';
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
    target: string;
    node?: string;
    dnsServerType?: 'isp' | 'custom';
    dnsServer?: string;
}

export interface DNSParams {
    target: string;
    line?: string;
    dnsType?: 'a' | 'cname' | 'mx' | 'aaaa' | 'ns' | 'txt' | 'ptr' | 'srv';
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