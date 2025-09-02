export interface ItdogOptions {
    baseURL?: string;
    dnsServerType?: string;
    dnsServer?: string;
    line?: string;
    hashToken?: string;
}

export interface ApiEndpoint {
    name: string;
    endpoint: string;
    method?: 'GET' | 'POST';
    defaultParams?: Record<string, any>;
    paramMap?: Record<string, string>;
}

export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
    retryDelay: number;
    userAgent: string;
}