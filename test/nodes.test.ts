import {getDefaultNodes, getNodesByCategory, getRandomNodes, updateNodesFromHtml} from '../src/data/nodes.js';

describe('Nodes', () => {
    test('getDefaultNodes returns correct structure', () => {
        const nodes = getDefaultNodes();
        expect(nodes).toBeDefined();
        expect(typeof nodes).toBe('object');
        expect(Object.keys(nodes).length).toBeGreaterThan(0);

        expect(nodes['中国电信']).toBeDefined();
        expect(nodes['中国联通']).toBeDefined();
        expect(nodes['中国移动']).toBeDefined();
        expect(nodes['港澳台、海外']).toBeDefined();

        const telecomNodes = nodes['中国电信'];
        expect(Array.isArray(telecomNodes)).toBe(true);
        expect(telecomNodes.length).toBeGreaterThan(0);

        const firstNode = telecomNodes[0];
        expect(firstNode).toHaveProperty('id');
        expect(firstNode).toHaveProperty('name');
        expect(firstNode).toHaveProperty('category');
        expect(firstNode.category).toBe('中国电信');
    });

    test('getNodesByCategory returns correct nodes', () => {
        const telecomNodes = getNodesByCategory('中国电信');
        expect(Array.isArray(telecomNodes)).toBe(true);
        expect(telecomNodes.length).toBeGreaterThan(0);

        telecomNodes.forEach(node => {
            expect(node.category).toBe('中国电信');
        });

        const emptyNodes = getNodesByCategory('哈基米不存在喵');
        expect(Array.isArray(emptyNodes)).toBe(true);
        expect(emptyNodes.length).toBe(0);
    });

    test('getRandomNodes returns array of node IDs', () => {
        const nodeIds = getRandomNodes();
        expect(Array.isArray(nodeIds)).toBe(true);
        expect(nodeIds.length).toBe(4);

        nodeIds.forEach(id => {
            expect(typeof id).toBe('string');
        });
    });

    test('updateNodesFromHtml updates nodes correctly', () => {
        const mockHtml = `
            <select>
                <optgroup label="测试类别1">
                    <option value="test1">测试节点1</option>
                    <option value="test2">测试节点2</option>
                </optgroup>
                <optgroup label="测试类别2">
                    <option value="test3">测试节点3</option>
                </optgroup>
            </select>
        `;

        updateNodesFromHtml(mockHtml);

        const updatedNodes = getDefaultNodes();
        expect(updatedNodes['测试类别1']).toBeDefined();
        expect(updatedNodes['测试类别2']).toBeDefined();
        expect(updatedNodes['测试类别1'].length).toBe(2);
        expect(updatedNodes['测试类别2'].length).toBe(1);

        expect(updatedNodes['测试类别1'][0].id).toBe('test1');
        expect(updatedNodes['测试类别1'][0].name).toBe('测试节点1');
        expect(updatedNodes['测试类别1'][0].category).toBe('测试类别1');
    });
});