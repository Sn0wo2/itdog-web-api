import {getAllNodes, getDefaultNodes, getNodesByCategory, updateNodesFromHtml} from '@/data/nodes'
import {beforeAll, describe, expect, test} from 'vitest'

describe('Node Management', () => {
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
  `

    const invalidHtml = `
    <select>
      <optgroup>
        <option>Invalid Node</option>
      </optgroup>
    </select>
  `

    describe('updateNodesFromHtml', () => {
        test('parses valid HTML correctly', () => {
            updateNodesFromHtml(testHtml)
            const nodes = getDefaultNodes()

            expect(Object.keys(nodes)).toHaveLength(2)
            expect(nodes['测试分组1']).toHaveLength(2)
            expect(nodes['测试分组2']).toHaveLength(1)
        })

        test('handles invalid HTML gracefully', () => {
            const originalNodes = getDefaultNodes()
            updateNodesFromHtml(invalidHtml)

            expect(getDefaultNodes()).toEqual(originalNodes)
        })

        test('handles empty HTML input', () => {
            const originalNodes = getDefaultNodes()
            updateNodesFromHtml('')

            expect(getDefaultNodes()).toEqual(originalNodes)
        })
    })

    describe('Node retrieval functions', () => {
        beforeAll(() => {
            updateNodesFromHtml(testHtml)
        })

        test('gets all nodes correctly', () => {
            const allNodes = getAllNodes()
            expect(allNodes).toHaveLength(3)
        })

        test('gets nodes by category correctly', () => {
            const group1Nodes = getNodesByCategory('测试分组1')
            expect(group1Nodes).toHaveLength(2)

            const nonExistentNodes = getNodesByCategory('不存在的分组')
            expect(nonExistentNodes).toHaveLength(0)
        })
    })
})