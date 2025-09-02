import {createHash} from "crypto";
import {ITDOG_HASH_TOKEN} from "./data/const";

// Type definitions for external dependencies
interface CheerioAPI {
    (selector: string): CheerioElement;
}

interface CheerioElement {
    each(callback: (index: number, element: Element) => void | false): void;
    html(): string | null;
}

interface BaseAPIInstance {
    _makeHttpRequest(formData: Record<string, string>): Promise<Record<string, unknown>>;
    createResult(taskId: string, taskToken: string, wssUrl: string, vars: Record<string, unknown>): unknown;
    wsHandler: {
        connect(config: { url: string; initialMessage: unknown }, onMessage?: (data: unknown) => void): Promise<void>;
    };
}

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
    $('script').each((_index: number, element: Element) => {
        let content: string | null = null;
        try {
            content = $(element).html();
        } catch {
            try {
                if ('children' in element && Array.isArray(element.children)) {
                    content = element.children.map((child: unknown) => 
                        (child as { data?: string }).data || ''
                    ).join('');
                }
            } catch {
                // Silently ignore extraction errors
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
        const target = formData['target'] || '';
        const url = `${baseURL}${endpoint}${target}`;
        const {target, ...restFormData} = formData;
        // target is used in URL construction above
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
) => {
    const vars = await api._makeHttpRequest(formData);
    const taskId = vars["task_id"] as string;
    const wssUrl = vars["wss_url"] as string;

    if (!taskId || !wssUrl) {
        throw new Error('Invalid response: missing task_id or wss_url');
    }

    const taskToken = generateTaskToken(taskId, hashToken);

    const result = api.createResult(taskId, taskToken, wssUrl, vars);

    await api.wsHandler.connect({
        url: result.wssUrl,
        initialMessage: {
            task_id: result.taskId,
            task_token: result.taskToken,
        }
    }, onMessage);

    return result;
};
