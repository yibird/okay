import { describe, expect, test } from 'vitest'
import { diffArray } from './diffArray'

describe('diffArray', () => {
  test('should report added removed updated and moved items', () => {
    const oldArray = [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
      { id: 3, name: 'Gamma' },
    ]
    const newArray = [
      { id: 2, name: 'Beta updated' },
      { id: 1, name: 'Alpha' },
      { id: 4, name: 'Delta' },
    ]

    const result = diffArray(oldArray, newArray)

    expect(result.added).toEqual([{ id: 4, index: 2, item: { id: 4, name: 'Delta' } }])
    expect(result.removed).toEqual([{ id: 3, index: 2, item: { id: 3, name: 'Gamma' } }])
    expect(result.updated).toEqual([
      {
        id: 2,
        oldIndex: 1,
        index: 0,
        oldItem: { id: 2, name: 'Beta' },
        newItem: { id: 2, name: 'Beta updated' },
        valueChanged: true,
        indexChanged: true,
      },
      {
        id: 1,
        oldIndex: 0,
        index: 1,
        oldItem: { id: 1, name: 'Alpha' },
        newItem: { id: 1, name: 'Alpha' },
        valueChanged: false,
        indexChanged: true,
      },
    ])
  })

  test('should compare primitive arrays by item value', () => {
    const result = diffArray([1, 2, 3], [3, 2, 4])

    expect(result.added).toEqual([{ id: 4, index: 2, item: 4 }])
    expect(result.removed).toEqual([{ id: 1, index: 0, item: 1 }])
    expect(result.updated).toEqual([
      {
        id: 3,
        oldIndex: 2,
        index: 0,
        oldItem: 3,
        newItem: 3,
        valueChanged: false,
        indexChanged: true,
      },
    ])
  })

  test('should support custom id field', () => {
    const result = diffArray([{ key: 'a', value: 1 }], [{ key: 'a', value: 2 }], {
      idKey: 'key',
    })

    expect(result.updated).toHaveLength(1)
    expect(result.updated[0].id).toBe('a')
    expect(result.updated[0].valueChanged).toBe(true)
  })

  test('should support custom id selector and equality function', () => {
    const result = diffArray(
      [{ id: 'a', version: 1, metadata: { updatedAt: 1 } }],
      [{ id: 'a', version: 1, metadata: { updatedAt: 2 } }],
      {
        idKey: (item) => item.id,
        isEqual: (oldItem, newItem) => oldItem.version === newItem.version,
      },
    )

    expect(result.updated).toEqual([])
  })

  test('should compare circular object items without overflowing the stack', () => {
    const oldItem: { id: number; self?: unknown } = { id: 1 }
    oldItem.self = oldItem

    const newItem: { id: number; self?: unknown } = { id: 1 }
    newItem.self = newItem

    expect(diffArray([oldItem], [newItem]).updated).toEqual([])
  })

  test('should throw for duplicate ids', () => {
    expect(() => diffArray([{ id: 1 }, { id: 1 }], [])).toThrow(TypeError)
    expect(() => diffArray([], [{ id: 1 }, { id: 1 }])).toThrow(TypeError)
  })

  test('throws for non-PropertyKey primitives as items', () => {
    expect(() => diffArray([true as any], [])).toThrow(TypeError)
  })

  test('throws for object items without valid default id', () => {
    expect(() => diffArray([{ name: 'Missing id' } as any], [])).toThrow(TypeError)
  })
})
