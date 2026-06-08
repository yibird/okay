import { describe, expect, test } from 'vitest'
import { findParent } from './findParent'

describe('findParent', () => {
  const tree = [
    {
      id: 1,
      name: 'Root 1',
      children: [
        {
          id: 2,
          name: 'Child 1',
          children: [{ id: 3, name: 'Grandchild 1' }],
        },
        { id: 4, name: 'Child 2' },
      ],
    },
    { id: 5, name: 'Root 2' },
  ]

  test('should find parent node by id', () => {
    const parent = findParent(tree, 3)
    expect(parent).not.toBeNull()
    expect(parent?.id).toBe(2)
    expect(parent?.name).toBe('Child 1')
  })

  test('should return null for root node', () => {
    const parent = findParent(tree, 1)
    expect(parent).toBeNull()
  })

  test('should return null if node not found', () => {
    const parent = findParent(tree, 999)
    expect(parent).toBeNull()
  })

  test('should handle custom keys', () => {
    const customTree = [
      {
        key: 1,
        name: 'Root',
        subItems: [{ key: 2, name: 'Child', subItems: [{ key: 3, name: 'Grandchild' }] }],
      },
    ]
    const parent = findParent(customTree, 3, {
      idKey: 'key',
      childrenKey: 'subItems',
    })
    expect(parent?.key).toBe(2)
  })

  test('should handle empty tree', () => {
    const parent = findParent([], 1)
    expect(parent).toBeNull()
  })
})
