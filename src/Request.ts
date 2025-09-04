import {load} from 'cheerio';
import type {APIResponse, RequestConfig} from './types.js';
import {findTaskIdScript, parseScriptVariables} from './utils.js';


export class Request {
    static async makeRequest(config: RequestConfig): Promise<APIResponse> {
        const controller = new AbortController();
        const timeoutId = config.timeout ? setTimeout(() => controller.abort(), config.timeout) : null;

        try {
            const response = await fetch(config.url, {
                method: config.method || 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    ...config.headers,
                },
                body: config.body,
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();

            return this.parseResponse(html);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error(`Request timeout after ${config.timeout}ms`);
            }
            throw error;
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }

    static parseResponse(html: string): APIResponse {
        const $ = load(html);
        const scriptContent = findTaskIdScript($);

        if (!scriptContent) {
            throw new Error('Cannot find script with task_id in response');
        }

        const variables = parseScriptVariables(scriptContent);

        if (!variables.task_id || !variables.wss_url) {
            throw new Error('Invalid response: missing required fields (task_id, wss_url)');
        }

        return variables as APIResponse;
    }
}