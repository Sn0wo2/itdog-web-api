import {SafeGuardCalculator} from '@/guard/Bridge'
import type {APIResult, RawResponse, RequestConfig} from '@/types'
import {_findTaskIdScript, _parseScriptVariables} from '@/utils'
import {load} from 'cheerio';
import * as cookie from 'cookie';


export class Request {
    static async makeRawRequest(config: RequestConfig): Promise<RawResponse> {
        const fetchClient = config.fetch || fetch;
        return {
            rawRequest: config.rawRequest,
            rawResponse: await fetchClient(config.rawRequest.url, config.rawRequest)
        };
    }

    static async makeGuardRequest(config: RequestConfig): Promise<RawResponse> {
        const rawResponse = await this.makeRawRequest(config)
        const response = rawResponse.rawResponse

        const html = await response.text()
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

            return this.makeGuardRequest({
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
            rawRequest: rawResponse.rawRequest,
            rawResponse: {
                ...response,
                text: async () => html
            }
        };
    }


    static async makeTaskRequest(config: RequestConfig): Promise<APIResult> {
        const rawResponse = await this.makeGuardRequest(config)
        const response = rawResponse.rawResponse

        const html = await response.text();

        return {
            ...this.parseResponse(html),
            ...rawResponse
        };
    }

    static parseResponse(html: string): APIResult {
        const scriptContent = _findTaskIdScript(load(html));

        if (!scriptContent) {
            throw new Error('Cannot find script with task_id in response');
        }

        const variables = _parseScriptVariables(scriptContent);

        if (!variables.task_id) {
            throw new Error('Invalid response: missing required fields (task_id)');
        }

        return variables as unknown as APIResult
    }
}