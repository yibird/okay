import { describe, expect, it } from 'vitest'
import { isWindow } from './is-window'

describe('isWindow', () => {
  it('should return false when target is not window object', () => {
    expect(isWindow({})).toBe(false)
    expect(isWindow(null)).toBe(false)
    expect(isWindow(undefined)).toBe(false)
    expect(isWindow(123)).toBe(false)
    expect(isWindow('string')).toBe(false)
  })

  it('should return false when target is document object', () => {
    expect(isWindow(document)).toBe(false)
  })

  it('should return false when target is a similar window-like object', () => {
    const windowLike = {
      document: {},
      navigator: {},
      location: {},
    }
    expect(isWindow(windowLike)).toBe(false)
  })

  it('should return false when target is a DOM element', () => {
    const div = document.createElement('div')
    expect(isWindow(div)).toBe(false)
  })

  it('should return false when target is a function', () => {
    expect(isWindow(() => {})).toBe(false)
  })

  it('should return false when target is an array', () => {
    expect(isWindow([])).toBe(false)
  })
})
