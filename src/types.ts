import {WebSocketHandler} from './WebSocketHandler';

export interface ClientOptions {
    baseURL?: string;
    hashToken?: string;
    fetch?: typeof fetch;
}

export interface APIConfig {
    endpoint: string;
    method?: string;
}

export interface APIResult {
    task_id: string;
    wss_url: string;
    taskToken: string;
    nodeIds?: string[];
    availableNodes?: Array<{ id: string; name: string; category: string }>;
    rawRequest: RawRequest
    rawResponse: Response;
}

export interface FinalResponse {
    result: APIResult;
    wsHandler: WebSocketHandler;
}

export interface APIResponse {
    wsHandler: WebSocketHandler;
    readonly result: Promise<APIResult>;

    execute(onMessage?: (data: unknown) => void): Promise<FinalResponse>;
}

export interface RawRequest extends RequestInit {
    url: string | URL;
}

export interface RequestConfig {
    rawRequest: RawRequest
    fetch?: typeof fetch;
}

export interface WebSocketMessage {
    task_id: string;
    task_token: string;

    [key: string]: unknown;
}

export interface WebSocketConfig {
    url: string;
    initialMessage: WebSocketMessage;
    timeout?: number;
    headers?: Record<string, string>;
}

export interface ExecuteWithWebSocketConfig {
    formData: Record<string, string>;
}

export interface Node {
    id: string;
    name: string;
    category: string;
}

export interface BaseDNSParams {
    dnsServerType?: 'isp' | 'custom';
    dnsServer?: string;
}

export interface PingParams extends BaseDNSParams {
    target: string;
    line?: string;
}

export interface TCPingParams extends BaseDNSParams {
    target: string;
    line?: string;
    mode?: 'many';
}

export interface BatchTCPingParams {
    hosts: string[];
    nodeIds?: string | string[];
    port?: string;
    cidrFilter?: boolean;
    gateway?: string;
}

export interface HTTPingParams extends BaseDNSParams {
    host: string;
    line?: string;
    checkMode?: 'fast' | 'slow';
    ipv4?: string;
    method?: 'get' | 'post';
    referer?: string;
    userAgent?: string;
    cookies?: string;
    redirectNum?: number;
}

export interface TraceRouteParams extends BaseDNSParams {
    target: string;
    node?: string;
}

export interface DNSParams extends BaseDNSParams {
    target: string;
    line?: string;
    dnsType?: 'a' | 'cname' | 'mx' | 'aaaa' | 'ns' | 'txt' | 'ptr' | 'srv';
}

export interface GenericParams {
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