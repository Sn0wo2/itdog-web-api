import { ApiEndpoint, ApiConfig } from '../types';

export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
    ping: {
        name: 'ping',
        endpoint: '/ping/',
        method: 'POST',
        defaultParams: {
            line: '',
            button_click: 'yes',
            dns_server_type: 'isp',
            dns_server: ''
        },
        paramMap: {
            target: 'target',
            line: 'line',
            dnsServerType: 'dns_server_type',
            dnsServer: 'dns_server'
        }
    },
    batchtcping: {
        name: 'batchtcping',
        endpoint: '/tcping/',
        method: 'POST',
        defaultParams: {
            line: '',
            button_click: 'yes'
        },
        paramMap: {
            target: 'target',
            port: 'port',
            line: 'line'
        }
    },
    batch_tcping: {
        name: 'batch_tcping',
        endpoint: '/batch_tcping/',
        method: 'POST',
        defaultParams: {
            cidr_filter: 'true',
            gateway: 'first',
            button_click: 'yes'
        },
        paramMap: {
            host: 'host',
            nodeId: 'node_id',
            port: 'port',
            cidrFilter: 'cidr_filter',
            gateway: 'gateway'
        }
    },
    dig: {
        name: 'dig',
        endpoint: '/dig/',
        method: 'POST',
        defaultParams: {
            type: 'A',
            dns_server: '8.8.8.8',
            button_click: 'yes'
        },
        paramMap: {
            target: 'target',
            type: 'type',
            dnsServer: 'dns_server'
        }
    },
    nslookup: {
        name: 'nslookup',
        endpoint: '/nslookup/',
        method: 'POST',
        defaultParams: {
            dns_server: '8.8.8.8',
            button_click: 'yes'
        },
        paramMap: {
            target: 'target',
            dnsServer: 'dns_server'
        }
    }
};

export const API_CONFIG: ApiConfig = {
    baseUrl: 'https://www.itdog.cn',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

export function getApiEndpoint(type: string): ApiEndpoint {
    const endpoint = API_ENDPOINTS[type];
    if (!endpoint) {
        throw new Error(`Unknown API endpoint type: ${type}`);
    }
    return endpoint;
}

export function buildFormData(type: string, params: Record<string, any>): Record<string, string> {
    const config = getApiEndpoint(type);
    const formData: Record<string, string> = {};
    
    if (config.defaultParams) {
        Object.entries(config.defaultParams).forEach(([key, value]) => {
            formData[key] = String(value);
        });
    }
    
    Object.entries(params).forEach(([key, value]) => {
        const mappedKey = config.paramMap?.[key] || key;
        if (value !== undefined && value !== null) {
            formData[mappedKey] = String(value);
        }
    });
    
    return formData;
}

export const API_CONFIGS = API_ENDPOINTS;

export function getAvailableAPIs(): string[] {
    return Object.keys(API_ENDPOINTS);
}