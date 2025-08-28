import { describe, expect, test } from 'vitest'
import { getDepth } from './get-depth'

describe('getDepth', () => {
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
    expect(getDepth(tree)).toBe(3)
  })

  test('should return 0 for empty tree', () => {
    expect(getDepth([])).toBe(0)
  })

  test('should return 1 for tree with only root nodes', () => {
    const tree = [{ id: 1 }, { id: 2 }]
    expect(getDepth(tree)).toBe(1)
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
    expect(getDepth(tree, 'subItems')).toBe(3)
  })
})
