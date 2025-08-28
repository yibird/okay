import { describe, expect, it } from 'vitest'
import { isUnDef } from './is-un-def'

describe('isUnDef', () => {
  it('should return true for undefined', () => {
    expect(isUnDef(undefined)).toBe(true)
  })

  it('should return false for null', () => {
    expect(isUnDef(null)).toBe(false)
  })

  it('should return false for primitive values', () => {
    expect(isUnDef(0)).toBe(false)
    expect(isUnDef('')).toBe(false)
    expect(isUnDef(false)).toBe(false)
    expect(isUnDef(Number.NaN)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isUnDef({})).toBe(false)
    expect(isUnDef([])).toBe(false)
    expect(isUnDef(new Date())).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isUnDef(() => {})).toBe(false)
  })

  it('should return false for Symbol', () => {
    expect(isUnDef(Symbol())).toBe(false)
  })

  it('should correctly narrow the type when used as type guard', () => {
    const testValue: string | undefined =
      Math.random() > 0.5 ? 'test' : undefined

    if (isUnDef(testValue)) {
      // Inside this block, TypeScript should know testValue is undefined
      expect(testValue).toBeUndefined()
    } else {
      // Inside this block, TypeScript should know testValue is string
      expect(typeof testValue).toBe('string')
    }
  })

  it('should work with generic types', () => {
    interface TestType {
      prop: number
    }

    const testValue: TestType | undefined =
      Math.random() > 0.5 ? { prop: 1 } : undefined

    if (isUnDef(testValue)) {
      expect(testValue).toBeUndefined()
    } else {
      expect(testValue).toHaveProperty('prop')
    }
  })

  it('should return true when no argument is passed', () => {
    expect(isUnDef()).toBe(true)
  })
})
