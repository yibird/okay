// test/treeMap.spec.ts
import { describe, expect, it } from 'vitest'
import { treeMap } from './tree-map'

type Node = { id: number; name: string; children?: Node[] }

describe('treeMap (TS-friendly, performant)', () => {
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

    const mapped = treeMap<Node, { key: number; label: string }>(tree, (n) => ({
      key: n.id,
      label: n.name,
    }))

    expect(mapped).toHaveLength(1)
    expect(mapped[0].key).toBe(1)
    expect(mapped[0].label).toBe('root')
    expect((mapped[0] as any).children).toHaveLength(2)
    expect((mapped[0] as any).children?.[0].key).toBe(2)
    expect((mapped[0] as any).children?.[1].key).toBe(3)
    expect((mapped[0] as any).children?.[1].children?.[0].key).toBe(4)
  })

  it('supports custom childrenKey with correct typing', () => {
    type Node = { id: number; sub?: Node[] }
    const tree: Node[] = [{ id: 1, sub: [{ id: 2, sub: [{ id: 3 }] }] }]

    const mapped = treeMap<Node, { uid: number; sub?: any }, 'sub'>(
      tree,
      (n) => ({ uid: n.id }),
      { childrenKey: 'sub' },
    )

    expect(mapped).toHaveLength(1)
    expect(mapped[0].uid).toBe(1)
    expect((mapped[0] as any).sub).toHaveLength(1)
    expect((mapped[0] as any).sub?.[0].uid).toBe(2)
    expect((mapped[0] as any).sub?.[0].sub?.[0].uid).toBe(3)
  })

  it('filters nodes when mapper returns null but preserves children attached to nearest mapped ancestor', () => {
    type Node = { id: number; children?: Node[] }
    const tree: Node[] = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
    ]

    const mapped = treeMap<Node, { id: number; name: string }>(tree, (n) =>
      n.id === 2 ? null : { id: n.id, name: `node-${n.id}` },
    )

    expect(mapped).toHaveLength(1)
    expect(mapped[0].id).toBe(1)
    const children = (mapped[0] as any).children as any[]
    const childIds = children.map((c) => c.id).sort()
    expect(childIds).toEqual([3, 4])
  })

  it('multiple roots and mixed filtering', () => {
    type Node = { id: number; children?: Node[] }
    const tree: Node[] = [
      { id: 1, children: [{ id: 2 }] },
      { id: 3, children: [{ id: 4 }] },
    ]

    const mapped = treeMap<Node, { id: number }>(tree, (n) =>
      n.id % 2 === 0 ? { id: n.id } : null,
    )

    expect(mapped.map((m: any) => m.id).sort()).toEqual([2, 4])
  })

  it('empty tree returns empty array', () => {
    const mapped = treeMap([], () => ({ foo: 1 }))
    expect(mapped).toEqual([])
  })

  it('handles deep trees without recursion (stack-safety)', () => {
    const depth = 500
    const make = (d: number): any =>
      d === 0 ? { id: 0 } : { id: d, children: [make(d - 1)] }
    const root = make(depth)
    const mapped = treeMap<{ id: number; children?: any }, { id: number }>(
      [root],
      (n) => ({ id: n.id }),
    )
    expect(mapped).toHaveLength(1)
    let cur = mapped[0] as any
    let cnt = 0
    while (Array.isArray(cur.children) && cur.children.length) {
      cur = cur.children[0]
      cnt++
    }
    expect(cnt).toBe(depth)
  })
})
