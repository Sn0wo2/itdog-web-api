// 检测运行环境
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

// 动态导入crypto模块
let createHash: any;
if (isNode) {
    createHash = require("crypto").createHash;
}

// 浏览器环境下的MD5实现
function md5Browser(str: string): string {
    // 简单的MD5实现，仅用于演示
    // 在实际项目中，建议使用成熟的库如crypto-js
    return "0123456789abcdef"; // 占位符
}

export function md5_16(str: string): string {
    if (isNode && createHash) {
        const full = createHash("md5").update(str).digest("hex");
        return full.substring(8, 24);
    } else {
        // 浏览器环境使用简单实现
        const full = md5Browser(str);
        return full.substring(8, 24);
    }
}

export function parseScriptVariables(scriptContent: string): Record<string, unknown> {
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
}

export function findTaskIdScript($: any): string | null {
    let scriptContent: string | null = null;
    $('script').each((index: number, element: { html: () => string }) => {
        const content = element.html();
        if (content && content.includes('task_id')) {
            scriptContent = content;
            return false;
        }
    });
    return scriptContent;
}

export function isNodeEnvironment(): boolean {
    return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
}

export function parseHtmlInBrowser(html: string) {
    if (typeof DOMParser === 'undefined') {
        throw new Error('DOMParser is not available in this environment');
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('script');
    
    return {
        eq: (index: number) => ({
            html: () => scripts[index]?.innerHTML || null
        }),
        each: (callback: (index: number, element: { html: () => string }) => void | boolean) => {
            for (let i = 0; i < scripts.length; i++) {
                const script = scripts[i];
                // 如果回调函数返回false，则停止遍历
                const result = callback(i, { html: () => script.innerHTML });
                if (result === false) {
                    break;
                }
            }
        }
    };
}

export function parseHtml(html: string) {
    const isNode = isNodeEnvironment();

    if (isNode) {
        const load = require('cheerio').load;
        return load(html);
    } else {
        return parseHtmlInBrowser(html);
    }
}

export function buildApiRequest(
    baseURL: string,
    endpoint: string,
    formData: Record<string, string>,
    useTargetInURL: boolean = true
): { url: string; formData: Record<string, string> } {
    if (useTargetInURL) {
        const target = formData['target'] || '';
        const url = `${baseURL}${endpoint}${target}`;
        const { target: _, ...restFormData } = formData;
        return { url, formData: restFormData };
    } else {
        const url = `${baseURL}${endpoint}`;
        return { url, formData };
    }
}
