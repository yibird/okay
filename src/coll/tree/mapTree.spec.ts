import { describe, expect, expectTypeOf, it } from 'vitest'
import { mapTree } from './mapTree'

type Node = { id: number; name: string; children?: Node[] }
type MappedNode = { key: number; label: string; children?: MappedNode[] }

describe('mapTree (TS-friendly, performant)', () => {
  it('basic mapping preserves structure and order', () => {
    const tree: Node[] = [
      {
        id: 1,
        name: 'root',
        children: [
          { id: 2, name: 'a' },
          { id: 3, name: 'b', children: [{ id: 4, name: 'b-1' }] },
        ],
      },
    ]

    const mapped = mapTree<Node, MappedNode>(tree, (n) => ({
      key: n.id,
      label: n.name,
    }))

    expect(mapped).toHaveLength(1)
    expect(mapped[0]?.key).toBe(1)
    expect(mapped[0]?.label).toBe('root')
    expect(mapped[0]?.children).toHaveLength(2)
    expect(mapped[0]?.children?.[0]?.key).toBe(2)
    expect(mapped[0]?.children?.[1]?.key).toBe(3)
    expect(mapped[0]?.children?.[1]?.children?.[0]?.key).toBe(4)
  })

  it('supports custom childrenKey with correct typing', () => {
    type Node = { id: number; sub?: Node[] }
    type MappedSubNode = { uid: number; sub?: MappedSubNode[] }
    const tree: Node[] = [{ id: 1, sub: [{ id: 2, sub: [{ id: 3 }] }] }]

    const mapped = mapTree<Node, MappedSubNode, 'sub'>(tree, (n) => ({ uid: n.id }), {
      childrenKey: 'sub',
    })

    expect(mapped).toHaveLength(1)
    expect(mapped[0]?.uid).toBe(1)
    expect(mapped[0]?.sub).toHaveLength(1)
    expect(mapped[0]?.sub?.[0]?.uid).toBe(2)
    expect(mapped[0]?.sub?.[0]?.sub?.[0]?.uid).toBe(3)
  })

  it('filters nodes when mapper returns null but preserves children attached to nearest mapped ancestor', () => {
    type Node = { id: number; children?: Node[] }
    type MappedNode = { id: number; name: string; children?: MappedNode[] }
    const tree: Node[] = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
    ]

    const mapped = mapTree<Node, MappedNode>(tree, (n) =>
      n.id === 2 ? null : { id: n.id, name: `node-${n.id}` },
    )

    expect(mapped).toHaveLength(1)
    expect(mapped[0]?.id).toBe(1)
    const children = mapped[0]?.children ?? []
    const childIds = children.map((c) => c.id).sort()
    expect(childIds).toEqual([3, 4])
  })

  it('multiple roots and mixed filtering', () => {
    type Node = { id: number; children?: Node[] }
    const tree: Node[] = [
      { id: 1, children: [{ id: 2 }] },
      { id: 3, children: [{ id: 4 }] },
    ]

    const mapped = mapTree<Node, { id: number }>(tree, (n) =>
      n.id % 2 === 0 ? { id: n.id } : null,
    )

    expect(mapped.map((m) => m.id).sort()).toEqual([2, 4])
  })

  it('empty tree returns empty array', () => {
    const mapped = mapTree([], () => ({ foo: 1 }))
    expect(mapped).toEqual([])
  })

  it('handles deep trees without recursion (stack-safety)', () => {
    interface DeepNode {
      id: number
      children?: DeepNode[]
    }
    interface DeepMappedNode {
      id: number
      children?: DeepMappedNode[]
    }

    const depth = 500
    const make = (d: number): DeepNode => (d === 0 ? { id: 0 } : { id: d, children: [make(d - 1)] })
    const root = make(depth)
    const mapped = mapTree<DeepNode, DeepMappedNode>([root], (n) => ({
      id: n.id,
    }))
    expect(mapped).toHaveLength(1)
    let cur = mapped[0]
    let cnt = 0
    while (cur?.children && cur.children.length > 0) {
      cur = cur.children[0]
      cnt++
    }
    expect(cnt).toBe(depth)
  })

  it('maps interface nodes to another interface without index signature', () => {
    interface MenuItem {
      id: string
      title: string
      children?: MenuItem[]
    }
    interface MenuOption {
      key: string
      label: string
      children?: MenuOption[]
    }

    const menu: MenuItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        children: [{ id: 'fileManager', title: 'File Manager' }],
      },
    ]

    const options = mapTree<MenuItem, MenuOption>(menu, (item) => ({
      key: item.id,
      label: item.title,
    }))

    expectTypeOf(options).toEqualTypeOf<MenuOption[]>()
    expect(options[0]?.children?.[0]?.key).toBe('fileManager')
  })
})
