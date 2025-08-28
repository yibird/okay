import { describe, expect, test } from 'vitest'
import { treeToSet } from './tree-to-set'

describe('treeToSet', () => {
  test('should convert tree to Set', () => {
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
      { id: 5 },
    ]
    const set = treeToSet(tree)
    expect(set.size).toBe(5)
    expect(Array.from(set).map((node) => node.id)).toEqual([1, 2, 3, 4, 5])
  })

  test('should return empty Set for empty tree', () => {
    const set = treeToSet([])
    expect(set.size).toBe(0)
  })

  test('should handle custom children key', () => {
    const tree = [
      {
        id: 1,
        subItems: [{ id: 2, subItems: [{ id: 3 }] }],
      },
    ]
    const set = treeToSet(tree, 'subItems')
    expect(set.size).toBe(3)
    expect(Array.from(set).map((node) => node.id)).toEqual([1, 2, 3])
  })
})
