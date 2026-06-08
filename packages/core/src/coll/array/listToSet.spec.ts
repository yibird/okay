import { describe, expect, it } from 'vitest'
import { listToSet } from './listToSet'

describe('listToSet', () => {
  it('should convert array to Set of elements', () => {
    expect(listToSet([1, 2, 3])).toEqual(new Set([1, 2, 3]))
  })

  it('should deduplicate elements', () => {
    expect(listToSet([1, 1, 2])).toEqual(new Set([1, 2]))
  })

  it('should use keySelector when provided', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 1 }]
    expect(listToSet(arr, (x) => x.id)).toEqual(new Set([1, 2]))
  })

  it('should handle empty array', () => {
    expect(listToSet([])).toEqual(new Set())
  })
})
