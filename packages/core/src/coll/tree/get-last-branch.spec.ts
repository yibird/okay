import { describe, expect, test } from 'vitest'
import { getLastBranch } from './get-last-branch'

describe('getLastBranch', () => {
  test('should get last branch of tree', () => {
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
    const branch = getLastBranch(tree)
    expect(branch).toHaveLength(3)
    expect(branch[0].id).toBe(1)
    expect(branch[1].id).toBe(3)
    expect(branch[2].id).toBe(5)
  })

  test('should return empty array for empty tree', () => {
    const branch = getLastBranch([])
    expect(branch).toEqual([])
  })

  test('should return root node when no children', () => {
    const tree = [{ id: 1 }]
    const branch = getLastBranch(tree)
    expect(branch).toHaveLength(1)
    expect(branch[0].id).toBe(1)
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
    const branch = getLastBranch(tree, 'subItems')
    expect(branch).toHaveLength(3)
    expect(branch[0].id).toBe(1)
    expect(branch[1].id).toBe(3)
    expect(branch[2].id).toBe(5)
  })
})
