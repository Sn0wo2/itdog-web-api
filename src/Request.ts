import {load} from 'cheerio'
import {findTaskIdScript, parseScriptVariables} from './utils.js';


export interface RequestConfig {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string | URLSearchParams;
}

export class Request {
    static async makeRequest(config: RequestConfig): Promise<Record<string, unknown>> {
        const response = await fetch(config.url, {
            method: config.method || 'POST',
            headers: config.headers,
            body: config.body
        });

        const html = await response.text();
        const $ = load(html);
        const scriptContent = findTaskIdScript($);

        if (!scriptContent) {
            throw new Error('Cannot find script with task_id');
        }

        return parseScriptVariables(scriptContent);
    }
}