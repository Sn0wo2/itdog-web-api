import type {CheerioAPI, CheerioNode} from '@/types'
import {createHash} from 'crypto'

/**
 * itdog task_token need 16 md5
 */
export const _md5_16 = (str: string): string => {
    return createHash("md5").update(str).digest("hex").substring(8, 24);
}

export const _parseScriptVariables = (scriptContent: string): Record<string, unknown> => {
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

export const _findTaskIdScript = ($: CheerioAPI): string | null => {
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

        if (content?.includes('task_id')) {
            scriptContent = content;
            return false;
        }
    });
    return scriptContent;
};

export const buildAPIRequestWithTarget = (
    baseURL: string,
    endpoint: string,
    formData: Record<string, string>,
): { url: string; formData: Record<string, string> } => {
    const url = `${baseURL}${endpoint}${extractHostname(formData['target']) || ''}`;

    const restFormData = {...formData};
    delete restFormData['target'];
    return {url, formData: restFormData};
};

export const buildAPIRequest = (
    baseURL: string,
    endpoint: string,
    formData: Record<string, string>
): { url: string; formData: Record<string, string> } => {
    const url = `${baseURL}${endpoint}`;
    return {url, formData};
};

const extractHostname = (url: string): string => {
    if (!url) {
        return ""
    }
    try {
        return new URL(url).hostname;
    } catch {
        const regex = /^(?:https?:\/\/)?([^/]+)/;
        const match = regex.exec(url);
        return match ? match[1] : url;
    }
}