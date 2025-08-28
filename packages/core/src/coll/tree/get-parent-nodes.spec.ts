import { describe, expect, test } from 'vitest'
import { getParentNodes } from './get-parent-nodes'

describe('getParentNodes', () => {
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

  test('should get parent nodes for deep node', () => {
    const parents = getParentNodes(tree, 3)
    expect(parents).toHaveLength(3)
    expect(parents[0].id).toBe(1)
    expect(parents[1].id).toBe(2)
    expect(parents[2].id).toBe(3)
  })

  test('should get parent nodes for root node', () => {
    const parents = getParentNodes(tree, 1)
    expect(parents).toHaveLength(1)
    expect(parents[0].id).toBe(1)
  })

  test('should return empty array for non-existent node', () => {
    const parents = getParentNodes(tree, 999)
    expect(parents).toEqual([])
  })

  test('should handle custom keys', () => {
    const customTree = [
      {
        key: 1,
        name: 'Root',
        subItems: [
          {
            key: 2,
            name: 'Child',
            subItems: [{ key: 3, name: 'Grandchild' }],
          },
        ],
      },
    ]
    const parents = getParentNodes(customTree, 3, {
      idKey: 'key',
      childrenKey: 'subItems',
    })
    expect(parents).toHaveLength(3)
    expect(parents[0].key).toBe(1)
    expect(parents[1].key).toBe(2)
    expect(parents[2].key).toBe(3)
  })
})
