import { describe, expect, test, vi } from 'vitest'
import { forEachTree } from './forEachTree'

describe('forEachTree', () => {
  test('should visit tree in pre-order by default', () => {
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
    ]
    const visitor = vi.fn()

    forEachTree(tree, visitor)

    expect(visitor).toHaveBeenCalledTimes(4)
    expect(visitor).toHaveBeenNthCalledWith(
      1,
      { id: 1, children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }] },
      0,
      null,
    )
    expect(visitor).toHaveBeenNthCalledWith(2, { id: 2, children: [{ id: 3 }] }, 1, {
      id: 1,
      children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
    })
    expect(visitor).toHaveBeenNthCalledWith(3, { id: 3 }, 2, {
      id: 2,
      children: [{ id: 3 }],
    })
    expect(visitor).toHaveBeenNthCalledWith(4, { id: 4 }, 1, {
      id: 1,
      children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
    })
  })

  test('should visit tree in post-order', () => {
    const tree = [
      {
        id: 1,
        children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
      },
    ]
    const visitor = vi.fn()

    forEachTree(tree, visitor, { order: 'post' })

    expect(visitor).toHaveBeenCalledTimes(4)
    expect(visitor).toHaveBeenNthCalledWith(1, { id: 3 }, 2, {
      id: 2,
      children: [{ id: 3 }],
    })
    expect(visitor).toHaveBeenNthCalledWith(2, { id: 2, children: [{ id: 3 }] }, 1, {
      id: 1,
      children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
    })
    expect(visitor).toHaveBeenNthCalledWith(3, { id: 4 }, 1, {
      id: 1,
      children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
    })
    expect(visitor).toHaveBeenNthCalledWith(
      4,
      { id: 1, children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }] },
      0,
      null,
    )
  })

  test('should handle empty tree', () => {
    const visitor = vi.fn()
    forEachTree([], visitor)
    expect(visitor).not.toHaveBeenCalled()
  })

  test('should handle custom children key', () => {
    const tree = [
      {
        id: 1,
        subItems: [{ id: 2 }],
      },
    ]
    const visitor = vi.fn()

    forEachTree(tree, visitor, { childrenKey: 'subItems' })

    expect(visitor).toHaveBeenCalledTimes(2)
    expect(visitor).toHaveBeenNthCalledWith(1, { id: 1, subItems: [{ id: 2 }] }, 0, null)
    expect(visitor).toHaveBeenNthCalledWith(2, { id: 2 }, 1, {
      id: 1,
      subItems: [{ id: 2 }],
    })
  })
})
