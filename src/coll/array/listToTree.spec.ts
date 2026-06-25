import { describe, expect, expectTypeOf, it } from 'vitest'
import { listToTree } from './listToTree'

describe('listToTree', () => {
  it('should convert flat list to tree structure', () => {
    interface Node {
      id: number
      parentId: number | null
      name: string
      children?: Node[]
    }

    const list: Node[] = [
      { id: 1, parentId: null, name: 'Root 1' },
      { id: 2, parentId: 1, name: 'Child 1' },
      { id: 3, parentId: 1, name: 'Child 2' },
      { id: 4, parentId: 2, name: 'Grandchild 1' },
    ]

    const tree = listToTree(list)
    expect(tree).toHaveLength(1)
    expect(tree[0]?.id).toBe(1)
    expect(tree[0]?.children).toHaveLength(2)
    expect(tree[0]?.children?.[0]?.id).toBe(2)
    expect(tree[0]?.children?.[0]?.children).toHaveLength(1)
    expect(tree[0]?.children?.[0]?.children?.[0]?.id).toBe(4)
  })

  it('should handle multiple root nodes', () => {
    const list = [
      { id: 1, parentId: null, name: 'Root 1' },
      { id: 2, parentId: null, name: 'Root 2' },
    ]

    const tree = listToTree(list)
    expect(tree).toHaveLength(2)
    expect(tree[0].id).toBe(1)
    expect(tree[1].id).toBe(2)
  })

  it('should handle custom keys', () => {
    interface Node {
      key: number
      pid: number | null
      name: string
      subItems?: Node[]
    }

    const list: Node[] = [
      { key: 1, pid: null, name: 'Root 1' },
      { key: 2, pid: 1, name: 'Child 1' },
    ]

    const tree = listToTree(list, {
      idKey: 'key',
      parentIdKey: 'pid',
      childrenKey: 'subItems',
    })

    expect(tree[0]?.key).toBe(1)
    expect(tree[0]?.subItems).toHaveLength(1)
    expect(tree[0]?.subItems?.[0]?.key).toBe(2)
  })

  it('should handle empty list', () => {
    const tree = listToTree([])
    expect(tree).toEqual([])
  })

  it('should handle nodes with missing parent', () => {
    const list = [
      { id: 1, parentId: null, name: 'Root' },
      { id: 2, parentId: 999, name: 'Orphan' },
    ]

    const tree = listToTree(list)
    expect(tree).toHaveLength(2)
    expect(tree[0].id).toBe(1)
    expect(tree[1].id).toBe(2)
  })

  it('should skip nodes already marked done during cycle detection', () => {
    interface Node {
      id: number
      parentId: number | null
      name: string
      children?: Node[]
    }

    const tree = listToTree<Node>([
      { id: 2, parentId: 1, name: 'Child' },
      { id: 1, parentId: null, name: 'Root' },
    ])

    expect(tree[0]?.id).toBe(1)
    expect(tree[0]?.children?.[0]?.id).toBe(2)
  })

  it('should reject duplicate ids', () => {
    expect(() =>
      listToTree([
        { id: 1, parentId: null, name: 'A' },
        { id: 1, parentId: null, name: 'B' },
      ]),
    ).toThrow('listToTree does not allow duplicate node ids')
  })

  it('should reject nodes without ids', () => {
    expect(() => listToTree([{ parentId: null, name: 'Missing id' }])).toThrow(
      'listToTree requires every node to have a non-null id',
    )
  })

  it('should reject self parent cycles', () => {
    expect(() => listToTree([{ id: 1, parentId: 1, name: 'Self' }])).toThrow(
      'listToTree detected a parent cycle',
    )
  })

  it('should reject indirect parent cycles', () => {
    expect(() =>
      listToTree([
        { id: 1, parentId: 2, name: 'A' },
        { id: 2, parentId: 1, name: 'B' },
      ]),
    ).toThrow('listToTree detected a parent cycle')
  })

  it('should accept interface nodes without index signature', () => {
    interface MenuItem {
      id: string
      parentId: string | null
      title: string
      children?: MenuItem[]
    }

    const list: MenuItem[] = [
      { id: 'dashboard', parentId: null, title: 'Dashboard' },
      { id: 'fileManager', parentId: 'dashboard', title: 'File Manager' },
    ]

    const tree = listToTree(list)

    expectTypeOf(tree).toEqualTypeOf<MenuItem[]>()
    expect(tree[0]?.title).toBe('Dashboard')
    expect(tree[0]?.children?.[0]?.id).toBe('fileManager')
  })
})
