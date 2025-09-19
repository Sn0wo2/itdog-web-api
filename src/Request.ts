import {SafeGuardCalculator} from '@/guard/Bridge'
import type {APIResult, RequestConfig} from '@/types'
import {_findTaskIdScript, _parseScriptVariables} from '@/utils'
import {load} from 'cheerio';
import * as cookie from 'cookie';


export class Request {
    static async makeRequest(config: RequestConfig): Promise<APIResult> {
        const fetchClient = config.fetch || fetch;
        const response = await fetchClient(config.rawRequest.url, config.rawRequest);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        if (html === `<script src="/_guard/auto.js"></script>`) {
            const guard = response.headers
                .getSetCookie()
                .map((c: string) => cookie.parse(c).guard)
                .find(Boolean);

            if (!guard) throw new Error('Cannot find guard cookie in response');

            const rawHeaders = new Headers(config.rawRequest.headers);
            const originalCookie = rawHeaders.get("cookie") || '';
            const parsed = cookie.parse(originalCookie);

            parsed.guard = guard;
            const guardRet = new SafeGuardCalculator().calculate(guard);
            if (guardRet !== null) {
                parsed.guardret = guardRet;
            }

            const newCookie = Object.entries(parsed)
                .map(([key, value]) => cookie.serialize(key, value as string))
                .join('; ');

            return this.makeRequest({
                ...config,
                rawRequest: {
                    ...config.rawRequest,
                    headers: {
                        ...config.rawRequest.headers,
                        cookie: newCookie
                    }
                }
            });
        }

        return {
            ...this.parseResponse(html),
            rawRequest: config.rawRequest,
            rawResponse: {
                ...response,
                text: async () => html
            }
        };
    }

    static parseResponse(html: string): APIResult {
        const scriptContent = _findTaskIdScript(load(html));

        if (!scriptContent) {
            throw new Error('Cannot find script with task_id in response');
        }

        const variables = _parseScriptVariables(scriptContent);

        if (!variables.task_id || !variables.wss_url) {
            throw new Error('Invalid response: missing required fields (task_id, wss_url)');
        }

        return variables as unknown as APIResult
    }
}