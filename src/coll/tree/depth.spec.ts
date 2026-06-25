import { describe, expect, expectTypeOf, test } from 'vitest'
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

  test('should accept interface nodes without index signature', () => {
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

    expectTypeOf(depth(menu)).toEqualTypeOf<number>()
    expect(depth(menu)).toBe(2)
  })

  test('should not mutate the input root array', () => {
    const tree = [
      {
        id: 1,
        children: [{ id: 2 }],
      },
    ]

    expect(depth(tree)).toBe(2)
    expect(tree).toHaveLength(1)
    expect(tree[0]?.children).toHaveLength(1)
  })

  test('should handle deep trees without recursion limits', () => {
    interface Node {
      id: number
      children?: Node[]
    }

    let node: Node = { id: 0 }
    for (let index = 1; index <= 2000; index++) {
      node = { id: index, children: [node] }
    }

    expect(depth([node])).toBe(2001)
  })

  test('should handle wide trees with many children', () => {
    const children = Array.from({ length: 500 }, (_, index) => ({
      id: index,
      children: [{ id: index + 1000 }],
    }))
    const tree = [{ id: -1, children }]
    expect(depth(tree)).toBe(3)
  })
})
