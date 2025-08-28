import { describe, expect, test } from 'vitest'
import { getFirstBranch } from './get-first-branch'

describe('getFirstBranch', () => {
  test('should get first branch of tree', () => {
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
    const branch = getFirstBranch(tree)
    expect(branch).toHaveLength(3)
    expect(branch[0].id).toBe(1)
    expect(branch[1].id).toBe(2)
    expect(branch[2].id).toBe(3)
  })

  test('should return empty array for empty tree', () => {
    const branch = getFirstBranch([])
    expect(branch).toEqual([])
  })

  test('should return root node when no children', () => {
    const tree = [{ id: 1 }]
    const branch = getFirstBranch(tree)
    expect(branch).toHaveLength(1)
    expect(branch[0].id).toBe(1)
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
    const branch = getFirstBranch(tree, 'subItems')
    expect(branch).toHaveLength(3)
    expect(branch[0].id).toBe(1)
    expect(branch[1].id).toBe(2)
    expect(branch[2].id).toBe(3)
  })
})
