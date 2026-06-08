import { describe, expect, it } from 'vitest'
import { listToMap } from './listToMap'

describe('listToMap', () => {
  it('should convert array to Map keyed by selector', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]
    const result = listToMap(arr, (x) => x.id)
    expect(result.get(1)).toEqual({ id: 1, name: 'a' })
    expect(result.get(2)).toEqual({ id: 2, name: 'b' })
  })

  it('should use valSelector when provided', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]
    const result = listToMap(
      arr,
      (x) => x.id,
      (x) => x.name,
    )
    expect(result.get(1)).toBe('a')
    expect(result.get(2)).toBe('b')
  })

  it('should overwrite on duplicate keys', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 1, name: 'b' },
    ]
    expect(listToMap(arr, (x) => x.id).get(1)).toEqual({ id: 1, name: 'b' })
  })

  it('should handle empty array', () => {
    expect(listToMap([], (x: any) => x.id).size).toBe(0)
  })
})
