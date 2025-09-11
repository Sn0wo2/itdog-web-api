import {getAllNodes, getDefaultNodes, getNodesByCategory, updateNodesFromHtml} from '../src/data/nodes';

describe('Node parsing and management', () => {
    const testHtml = `
        <select>
            <optgroup label="测试分组1">
                <option value="1">节点1</option>
                <option value="2">节点2</option>
            </optgroup>
            <optgroup label="测试分组2">
                <option value="3">节点3</option>
            </optgroup>
        </select>
    `;

    const invalidHtml = `
        <select>
            <optgroup>
                <option>Invalid Node</option>
            </optgroup>
        </select>
    `;

    describe('updateNodesFromHtml', () => {
        it('should parse valid HTML correctly', () => {
            updateNodesFromHtml(testHtml);
            const nodes = getDefaultNodes();

            expect(Object.keys(nodes)).toHaveLength(2);
            expect(nodes['测试分组1']).toHaveLength(2);
            expect(nodes['测试分组2']).toHaveLength(1);
        });

        it('should handle invalid HTML gracefully', () => {
            const originalNodes = getDefaultNodes();
            updateNodesFromHtml(invalidHtml);

            // Should keep original nodes on invalid input
            expect(getDefaultNodes()).toEqual(originalNodes);
        });

        it('should handle empty HTML input', () => {
            const originalNodes = getDefaultNodes();
            updateNodesFromHtml('');

            // Should keep original nodes on empty input
            expect(getDefaultNodes()).toEqual(originalNodes);
        });
    });

    describe('Node retrieval functions', () => {
        beforeAll(() => {
            updateNodesFromHtml(testHtml);
        });

        it('should get all nodes correctly', () => {
            const allNodes = getAllNodes();
            expect(allNodes).toHaveLength(3);
        });

        it('should get nodes by category correctly', () => {
            const group1Nodes = getNodesByCategory('测试分组1');
            expect(group1Nodes).toHaveLength(2);

            const nonExistentNodes = getNodesByCategory('不存在的分组');
            expect(nonExistentNodes).toHaveLength(0);
        });
    });
});