import { describe, expect, test } from 'vitest'
import { firstLeafPath } from './firstLeafPath'

describe('firstLeafPath', () => {
  test('should get first leaf path of tree', () => {
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
    const path = firstLeafPath(tree)
    expect(path).toHaveLength(3)
    expect(path[0].id).toBe(1)
    expect(path[1].id).toBe(2)
    expect(path[2].id).toBe(3)
  })

  test('should return empty array for empty tree', () => {
    const path = firstLeafPath([])
    expect(path).toEqual([])
  })

  test('should return root node when no children', () => {
    const tree = [{ id: 1 }]
    const path = firstLeafPath(tree)
    expect(path).toHaveLength(1)
    expect(path[0].id).toBe(1)
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
    const path = firstLeafPath(tree, 'subItems')
    expect(path).toHaveLength(3)
    expect(path[0].id).toBe(1)
    expect(path[1].id).toBe(2)
    expect(path[2].id).toBe(3)
  })
})
