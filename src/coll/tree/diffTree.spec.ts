import { describe, expect, expectTypeOf, it } from 'vitest'
import { diffTree } from './diffTree'

interface TreeNode {
  id: string
  title: string
  children?: TreeNode[]
}

describe('diffTree', () => {
  it('返回新增、更新和删除节点报告', () => {
    const oldTree: TreeNode[] = [
      {
        children: [{ id: 'a-1', title: 'old child' }],
        id: 'a',
        title: 'old root',
      },
      {
        id: 'b',
        title: 'removed',
      },
    ]
    const newTree: TreeNode[] = [
      {
        children: [
          { id: 'a-1', title: 'new child' },
          { id: 'a-2', title: 'added child' },
        ],
        id: 'a',
        title: 'old root',
      },
    ]

    const result = diffTree(oldTree, newTree)

    expect(result.added.map((item) => item.id)).toEqual(['a-2'])
    expect(result.updated.map((item) => item.id)).toEqual(['a-1'])
    expect(result.removed.map((item) => item.id)).toEqual(['b'])
    expect(result.added[0].path).toEqual(['a', 'a-2'])
  })

  it('识别节点路径变化', () => {
    const oldTree: TreeNode[] = [
      {
        children: [{ id: 'child', title: 'same' }],
        id: 'a',
        title: 'A',
      },
      {
        id: 'b',
        title: 'B',
      },
    ]
    const newTree: TreeNode[] = [
      {
        id: 'a',
        title: 'A',
      },
      {
        children: [{ id: 'child', title: 'same' }],
        id: 'b',
        title: 'B',
      },
    ]

    const result = diffTree(oldTree, newTree)

    expect(result.updated).toEqual([
      expect.objectContaining({
        id: 'child',
        oldPath: ['a', 'child'],
        path: ['b', 'child'],
        pathChanged: true,
        valueChanged: false,
      }),
    ])
  })

  it('支持自定义 id 和 children 字段', () => {
    const oldTree = [
      {
        nodes: [{ key: 2, name: 'old' }],
        key: 1,
        name: 'root',
      },
    ]
    const newTree = [
      {
        nodes: [{ key: 2, name: 'new' }],
        key: 1,
        name: 'root',
      },
    ]

    const result = diffTree(oldTree, newTree, {
      childrenKey: 'nodes',
      idKey: 'key',
    })

    expect(result.updated[0]).toEqual(
      expect.objectContaining({
        id: 2,
        path: [1, 2],
      }),
    )
  })

  it('支持函数形式的 id 选择器', () => {
    const result = diffTree([{ key: 'a', title: 'old' }], [{ key: 'a', title: 'new' }], {
      idKey: (node) => node.key,
    })

    expect(result.updated[0].id).toBe('a')
  })

  it('支持自定义内容比较函数', () => {
    const result = diffTree([{ id: 'a', title: 'old' }], [{ id: 'a', title: 'new' }], {
      isEqual: () => true,
    })

    expect(result.updated).toEqual([])
  })

  it('should compare circular non-children fields without overflowing the stack', () => {
    const oldNode: TreeNode & { related?: unknown } = { id: 'a', title: 'same' }
    oldNode.related = oldNode

    const newNode: TreeNode & { related?: unknown } = { id: 'a', title: 'same' }
    newNode.related = newNode

    expect(diffTree([oldNode], [newNode]).updated).toEqual([])
  })

  it('uses string idKey selector (non-function branch)', () => {
    const result = diffTree(
      [{ id: 'a', name: 'old', children: [] }],
      [{ id: 'a', name: 'new', children: [] }],
      { idKey: 'id' },
    )
    expect(result.updated[0].valueChanged).toBe(true)
  })

  it('isSamePath returns false for different-length paths', () => {
    interface Node {
      id: string
      children?: Node[]
    }

    const oldTree: Node[] = [{ id: 'root', children: [{ id: 'child', children: [] }] }]
    const newTree: Node[] = [
      { id: 'root', children: [{ id: 'mid', children: [{ id: 'child', children: [] }] }] },
    ]
    const result = diffTree(oldTree, newTree)
    const updated = result.updated.find((u) => u.id === 'child')
    expect(updated?.pathChanged).toBe(true)
  })

  it('重复节点标识会抛出错误', () => {
    expect(() =>
      diffTree(
        [{ id: 'a', title: 'A' }],
        [
          { id: 'a', title: 'A' },
          { id: 'a', title: 'Duplicate' },
        ],
      ),
    ).toThrow('diffTree 不允许重复节点标识：a')
  })

  it('should accept interface nodes without index signature', () => {
    interface MenuItem {
      id: string
      title: string
      children?: MenuItem[]
    }

    const oldMenu: MenuItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        children: [{ id: 'fileManager', title: 'File Manager' }],
      },
    ]
    const newMenu: MenuItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        children: [{ id: 'fileManager', title: 'Files' }],
      },
    ]

    const diff = diffTree<MenuItem, string>(oldMenu, newMenu)

    expectTypeOf(diff.updated).toMatchTypeOf<Array<{ newNode: MenuItem }>>()
    expect(diff.updated[0]?.id).toBe('fileManager')
  })

  it('handles non-object nodes comparison', () => {
    // Test comparing primitive values in trees
    const oldTree = [{ id: 'a', value: 42 }]
    const newTree = [{ id: 'a', value: 42 }]

    const diff = diffTree(oldTree, newTree, {
      idKey: 'id',
    })

    // Should have no updates since values are equal
    expect(diff.updated).toEqual([])
  })
})
