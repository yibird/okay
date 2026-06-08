import { describe, expect, test } from 'vitest'
import { depth } from './depth'

describe('depth', () => {
  test('should return depth of tree', () => {
    const tree = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [{ id: 3 }],
          },
          { id: 4 },
        ],
      },
    ]
    expect(depth(tree)).toBe(3)
  })

  test('should return 0 for empty tree', () => {
    expect(depth([])).toBe(0)
  })

  test('should return 1 for tree with only root nodes', () => {
    const tree = [{ id: 1 }, { id: 2 }]
    expect(depth(tree)).toBe(1)
  })

  test('should handle custom children key', () => {
    const tree = [
      {
        id: 1,
        subItems: [
          {
            id: 2,
            subItems: [{ id: 3 }],
          },
        ],
      },
    ]
    expect(depth(tree, 'subItems')).toBe(3)
  })

  test('should handle deep trees without recursion limits', () => {
    let node: any = { id: 0 }
    for (let index = 1; index <= 2000; index++) {
      node = { id: index, children: [node] }
    }

    expect(depth([node])).toBe(2001)
  })
})
