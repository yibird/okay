import { describe, expect, it, vi } from 'vitest'
import { isBrowser } from './is-browser'

describe('isBrowser', () => {
  it('should return true in real browser environment', () => {
    expect(isBrowser()).toBe(true)
  })

  it('should return false in Node.js environment', () => {
    const originalWindow = global.window
    // @ts-ignore - Simulate Node environment
    delete global.window

    expect(isBrowser()).toBe(false)
    global.window = originalWindow
  })

  it('should return false when window exists but document is missing', () => {
    const originalWindow = global.window
    // @ts-ignore - Partial window mock
    global.window = {}

    expect(isBrowser()).toBe(false)
    global.window = originalWindow
  })

  it('should return false when createElement method is missing', () => {
    const originalWindow = global.window
    // @ts-ignore - Partial document mock
    global.window = { document: {} }

    expect(isBrowser()).toBe(false)
    global.window = originalWindow
  })

  it('should return true when all required conditions are met', () => {
    const originalWindow = global.window
    // @ts-ignore - Complete browser mock
    global.window = { document: { createElement: vi.fn() } }

    expect(isBrowser()).toBe(true)
    global.window = originalWindow
  })
})
