import {load} from 'cheerio';
import {Node} from "../types";
import {COMPACT_NODES} from "./const";

let DEFAULT_NODES: Record<string, Node[]> = {};

const initializeDefaultNodes = (): void => {
    for (const [category, nodes] of Object.entries(COMPACT_NODES)) {
        DEFAULT_NODES[category] = nodes.map(([id, name]) => ({
            id,
            name,
            category
        }));
    }
};

initializeDefaultNodes();

export const updateNodesFromHtml = (html: string): void => {
    try {
        const $ = load(html);
        const newNodes: Record<string, Node[]> = {};

        $('optgroup').each((_, group) => {
            const category = $(group).attr('label');
            if (!category) return;

            if (!newNodes[category]) {
                newNodes[category] = [];
            }

            $(group).find('option').each((_, option) => {
                const id = $(option).attr('value');
                const name = $(option).text().trim();
                if (id && name) {
                    newNodes[category].push({id, name, category});
                }
            });
        });

        if (Object.keys(newNodes).length > 0) {
            DEFAULT_NODES = newNodes;
        }
    } catch {
        // keep existing DEFAULT_NODES on error
    }
};

export const getDefaultNodes = (): Record<string, Node[]> => {
    return DEFAULT_NODES;
};

export const getAllNodes = (): Node[] => {
    return Object.values(DEFAULT_NODES).flat();
};

export const getNodesByCategory = (category: string): Node[] => {
    return DEFAULT_NODES[category] || [];
};

export const getRandomNodes = (): string[] => {
    return Object.keys(DEFAULT_NODES).map(category => {
        const nodes = DEFAULT_NODES[category];
        return nodes[Math.floor(Math.random() * nodes.length)].id;
    });
};