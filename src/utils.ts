import {createHash} from "crypto";
import {ITDOG_HASH_TOKEN} from "./data/const";
import type {CheerioNode} from "./types";

import type {APIResult, BaseAPIInstance, CheerioAPI} from './types.js';

export const md516 = (str: string): string => {
    const full = createHash("md5").update(str).digest("hex");
    return full.substring(8, 24);
};

export const parseScriptVariables = (scriptContent: string): Record<string, unknown> => {
    const vars: Record<string, unknown> = {};
    const regex = /(var|const)\s+(\w+)\s*=\s*([^;]+);/g;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(scriptContent)) !== null) {
        const [, , name, raw] = match;
        const value = raw.trim();

        let parsed: unknown;
        if (value === 'true' || value === 'false') {
            parsed = value === 'true';
        } else if (/^\d+$/.test(value)) {
            parsed = Number(value);
        } else if (/^['"].*['"]$/.test(value)) {
            parsed = value.slice(1, -1);
        } else if (/^[{[]/.test(value)) {
            try {
                parsed = JSON.parse(value.replace(/'/g, '"'));
            } catch {
                parsed = value;
            }
        } else {
            parsed = value;
        }

        vars[name] = parsed;
    }
    return vars;
};

export const findTaskIdScript = ($: CheerioAPI): string | null => {
    let scriptContent: string | null = null;
    $('script').each((_index: number, element: unknown) => {
        let content: string | null = null;
        try {
            content = $(element).html();
        } catch {
            try {
                const node = element as CheerioNode;
                if (node.children && Array.isArray(node.children)) {
                    content = node.children.map((child: CheerioNode) =>
                        child.data || ''
                    ).join('');
                }
            } catch {
                // ignore extraction errors
            }
        }

        if (content && content.includes('task_id')) {
            scriptContent = content;
            return false;
        }
    });
    return scriptContent;
};

export const buildApiRequest = (
    baseURL: string,
    endpoint: string,
    formData: Record<string, string>,
    useTargetInURL: boolean = true
): { url: string; formData: Record<string, string> } => {
    if (useTargetInURL) {
        const targetValue = formData['target'] || '';
        const url = `${baseURL}${endpoint}${targetValue}`;
        const restFormData = {...formData};
        delete restFormData['target'];
        return {url, formData: restFormData};
    } else {
        const url = `${baseURL}${endpoint}`;
        return {url, formData};
    }
};

export const generateTaskToken = (taskId: string, hashToken?: string): string => {
    return md516(taskId + (hashToken || ITDOG_HASH_TOKEN));
};

export const executeAPIWithWebSocket = async (
    api: BaseAPIInstance,
    formData: Record<string, string>,
    onMessage?: (data: unknown) => void,
    hashToken?: string
): Promise<APIResult> => {
    const response = await api._makeHttpRequest(formData);

    if (!response.task_id || !response.wss_url) {
        throw new Error('Invalid API response: missing task_id or wss_url');
    }

    const taskToken = generateTaskToken(response.task_id, hashToken);
    const result = api.createResult(response.task_id, taskToken, response.wss_url, response);

    await api.wsHandler.connect({
        url: response.wss_url,
        initialMessage: {
            task_id: response.task_id,
            task_token: taskToken,
        }
    }, onMessage);

    return result;
};
