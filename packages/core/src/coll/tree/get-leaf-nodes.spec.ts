import { describe, expect, test } from 'vitest'
import { getLeafNodes } from './get-leaf-nodes'

describe('getLeafNodes', () => {
  test('should get all leaf nodes in depth-first order', () => {
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
      { id: 5 },
    ]
    const leaves = getLeafNodes(tree, 'children')
    expect(leaves).toHaveLength(3)
    expect(leaves.map((node) => node.id)).toEqual([3, 4, 5])
  })

  test('should return empty array for empty tree', () => {
    const leaves = getLeafNodes([], 'children')
    expect(leaves).toEqual([])
  })

  test('should return all nodes when no children', () => {
    const tree = [{ id: 1 }, { id: 2 }]
    const leaves = getLeafNodes(tree, 'children')
    expect(leaves).toHaveLength(2)
    expect(leaves.map((node) => node.id)).toEqual([1, 2])
  })

  test('should handle nodes with empty children array', () => {
    const tree = [
      {
        id: 1,
        children: [],
      },
      { id: 2 },
    ]
    const leaves = getLeafNodes(tree, 'children')
    expect(leaves).toHaveLength(2)
    expect(leaves.map((node) => node.id)).toEqual([1, 2])
  })

  test('should handle custom children key', () => {
    const tree = [
      {
        id: 1,
        nodes: [{ id: 2, nodes: [{ id: 3 }] }],
      },
    ]
    const leaves = getLeafNodes(tree, 'nodes')
    expect(leaves).toHaveLength(1)
    expect(leaves[0].id).toBe(3)
  })

  test('should handle deep nested structure', () => {
    const tree = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [{ id: 3, children: [{ id: 4 }] }, { id: 5 }],
          },
          { id: 6 },
        ],
      },
      { id: 7 },
    ]
    const leaves = getLeafNodes(tree, 'children')
    expect(leaves).toHaveLength(4)
    expect(leaves.map((node) => node.id)).toEqual([4, 5, 6, 7])
  })

  test('should handle undefined children property', () => {
    const tree = [
      { id: 1 },
      { id: 2, children: undefined },
      { id: 3, children: null },
    ]
    const leaves = getLeafNodes(tree, 'children')
    expect(leaves).toHaveLength(3)
    expect(leaves.map((node) => node.id)).toEqual([1, 2, 3])
  })

  test('should maintain original node references', () => {
    const leaf = { id: 3 }
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [leaf] }],
      },
    ]
    const leaves = getLeafNodes(tree, 'children')
    expect(leaves).toHaveLength(1)
    expect(leaves[0]).toBe(leaf)
  })
})
