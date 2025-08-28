import { describe, expect, test } from 'vitest'
import { treeToList } from './tree-to-list'

describe('treeToList', () => {
  test('should flatten tree to list', () => {
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
      { id: 5 },
    ]
    const list = treeToList(tree)
    expect(list).toHaveLength(5)
    expect(list.map((node) => node.id)).toEqual([1, 2, 3, 4, 5])
  })

  test('should return empty array for empty tree', () => {
    const list = treeToList([])
    expect(list).toEqual([])
  })

  test('should handle custom children key', () => {
    const tree = [
      {
        id: 1,
        subItems: [{ id: 2, subItems: [{ id: 3 }] }],
      },
    ]
    const list = treeToList(tree, 'subItems')
    expect(list).toHaveLength(3)
    expect(list.map((node) => node.id)).toEqual([1, 2, 3])
  })

  test('should handle tree with single node', () => {
    const tree = [{ id: 1 }]
    const list = treeToList(tree)
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe(1)
  })
})
