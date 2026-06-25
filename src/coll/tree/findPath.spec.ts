import { describe, expect, expectTypeOf, test } from 'vitest'
import { findPath } from './findPath'

describe('findPath', () => {
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

  test('should find path for deep node', () => {
    const path = findPath(tree, 3)
    expect(path).toHaveLength(3)
    expect(path[0].id).toBe(1)
    expect(path[1].id).toBe(2)
    expect(path[2].id).toBe(3)
  })

  test('should find path for root node', () => {
    const path = findPath(tree, 1)
    expect(path).toHaveLength(1)
    expect(path[0].id).toBe(1)
  })

  test('should return empty array for non-existent node', () => {
    const path = findPath(tree, 999)
    expect(path).toEqual([])
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
    const path = findPath(customTree, 3, {
      idKey: 'key',
      childrenKey: 'subItems',
    })
    expect(path).toHaveLength(3)
    expect(path[0].key).toBe(1)
    expect(path[1].key).toBe(2)
    expect(path[2].key).toBe(3)
  })

  test('should accept interface nodes without string index signature', () => {
    interface MenuItem {
      id: string
      title: string
      children?: MenuItem[]
    }

    const menu: MenuItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        children: [{ id: 'fileManager', title: 'File Manager' }],
      },
    ]

    const path = findPath(menu, 'fileManager', {
      idKey: 'id',
      childrenKey: 'children',
    })

    expectTypeOf(path).toEqualTypeOf<MenuItem[]>()
    expect(path.map((item) => item.title)).toEqual(['Dashboard', 'File Manager'])
  })

  test('should handle very deep trees without stack overflow', () => {
    interface Node {
      id: number
      children?: Node[]
    }

    let node: Node = { id: 0 }
    for (let index = 1; index <= 2000; index++) {
      node = { id: index, children: [node] }
    }

    const path = findPath([node], 0)
    expect(path).toHaveLength(2001)
    expect(path[0].id).toBe(2000)
    expect(path[path.length - 1].id).toBe(0)
  })

  test('should handle numeric string and number id interchangeably', () => {
    const tree = [{ id: '1', name: 'Root', children: [{ id: '2', name: 'Child' }] }]
    const path = findPath(tree, 2)
    expect(path).toHaveLength(2)
    expect(path[1].name).toBe('Child')
  })
})
