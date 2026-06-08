import { describe, expect, test } from 'vitest'
import { lastLeafPath } from './lastLeafPath'

describe('lastLeafPath', () => {
  test('should get last leaf path of tree', () => {
    const tree = [
      {
        id: 1,
        children: [
          { id: 2 },
          {
            id: 3,
            children: [{ id: 4 }, { id: 5 }],
          },
        ],
      },
    ]
    const path = lastLeafPath(tree)
    expect(path).toHaveLength(3)
    expect(path[0].id).toBe(1)
    expect(path[1].id).toBe(3)
    expect(path[2].id).toBe(5)
  })

  test('should return empty array for empty tree', () => {
    const path = lastLeafPath([])
    expect(path).toEqual([])
  })

  test('should return root node when no children', () => {
    const tree = [{ id: 1 }]
    const path = lastLeafPath(tree)
    expect(path).toHaveLength(1)
    expect(path[0].id).toBe(1)
  })

  test('should handle custom children key', () => {
    const tree = [
      {
        id: 1,
        subItems: [
          { id: 2 },
          {
            id: 3,
            subItems: [{ id: 4 }, { id: 5 }],
          },
        ],
      },
    ]
    const path = lastLeafPath(tree, 'subItems')
    expect(path).toHaveLength(3)
    expect(path[0].id).toBe(1)
    expect(path[1].id).toBe(3)
    expect(path[2].id).toBe(5)
  })
})
