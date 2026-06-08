import { describe, expect, test } from 'vitest'
import { leaves } from './leaves'

describe('leaves', () => {
  test('should get all leaf nodes in depth-first order', () => {
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
      { id: 5 },
    ]
    const result = leaves(tree, 'children')
    expect(result).toHaveLength(3)
    expect(result.map((node) => node.id)).toEqual([3, 4, 5])
  })

  test('should return empty array for empty tree', () => {
    const result = leaves([], 'children')
    expect(result).toEqual([])
  })

  test('should return all nodes when no children', () => {
    const tree = [{ id: 1 }, { id: 2 }]
    const result = leaves(tree, 'children')
    expect(result).toHaveLength(2)
    expect(result.map((node) => node.id)).toEqual([1, 2])
  })

  test('should handle nodes with empty children array', () => {
    const tree = [
      {
        id: 1,
        children: [],
      },
      { id: 2 },
    ]
    const result = leaves(tree, 'children')
    expect(result).toHaveLength(2)
    expect(result.map((node) => node.id)).toEqual([1, 2])
  })

  test('should handle custom children key', () => {
    const tree = [
      {
        id: 1,
        nodes: [{ id: 2, nodes: [{ id: 3 }] }],
      },
    ]
    const result = leaves(tree, 'nodes')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(3)
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
    const result = leaves(tree, 'children')
    expect(result).toHaveLength(4)
    expect(result.map((node) => node.id)).toEqual([4, 5, 6, 7])
  })

  test('should handle undefined children property', () => {
    const tree = [{ id: 1 }, { id: 2, children: undefined }, { id: 3, children: null }]
    const result = leaves(tree, 'children')
    expect(result).toHaveLength(3)
    expect(result.map((node) => node.id)).toEqual([1, 2, 3])
  })

  test('should maintain original node references', () => {
    const leaf = { id: 3 }
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [leaf] }],
      },
    ]
    const result = leaves(tree, 'children')
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(leaf)
  })

  test('should handle deep trees without recursion limits', () => {
    const leaf = { id: 0 }
    let node: any = leaf
    for (let index = 1; index <= 2000; index++) {
      node = { id: index, children: [node] }
    }

    expect(leaves([node])).toEqual([leaf])
  })
})
