import { describe, expect, test } from 'vitest'
import { findParentNode } from './find-parent-node'

describe('findParentNode', () => {
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
    const parent = findParentNode(tree, 3)
    expect(parent).not.toBeNull()
    expect(parent?.id).toBe(2)
    expect(parent?.name).toBe('Child 1')
  })

  test('should return null for root node', () => {
    const parent = findParentNode(tree, 1)
    expect(parent).toBeNull()
  })

  test('should return null if node not found', () => {
    const parent = findParentNode(tree, 999)
    expect(parent).toBeNull()
  })

  test('should handle custom keys', () => {
    const customTree = [
      {
        key: 1,
        name: 'Root',
        subItems: [
          { key: 2, name: 'Child', subItems: [{ key: 3, name: 'Grandchild' }] },
        ],
      },
    ]
    const parent = findParentNode(customTree, 3, {
      idKey: 'key',
      childrenKey: 'subItems',
    })
    expect(parent?.key).toBe(2)
  })

  test('should handle empty tree', () => {
    const parent = findParentNode([], 1)
    expect(parent).toBeNull()
  })
})
