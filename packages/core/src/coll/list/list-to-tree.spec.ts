import { describe, expect, it } from 'vitest'
import { listToTree } from './list-to-tree'

describe('listToTree', () => {
  it('should convert flat list to tree structure', () => {
    const list = [
      { id: 1, parentId: null, name: 'Root 1' },
      { id: 2, parentId: 1, name: 'Child 1' },
      { id: 3, parentId: 1, name: 'Child 2' },
      { id: 4, parentId: 2, name: 'Grandchild 1' },
    ]

    const tree = listToTree(list)
    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe(1)
    expect((tree[0] as any).children).toHaveLength(2)
    expect((tree[0] as any).children?.[0].id).toBe(2)
    expect((tree[0] as any).children?.[0].children).toHaveLength(1)
    expect((tree[0] as any).children?.[0].children?.[0].id).toBe(4)
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
    const list = [
      { key: 1, pid: null, name: 'Root 1' },
      { key: 2, pid: 1, name: 'Child 1' },
    ]

    const tree = listToTree(list, {
      idKey: 'key',
      parentIdKey: 'pid',
      childrenKey: 'subItems' as any,
    })

    expect(tree[0].key).toBe(1)
    expect((tree[0] as any).subItems).toHaveLength(1)
    expect((tree[0] as any).subItems?.[0].key).toBe(2)
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
})
