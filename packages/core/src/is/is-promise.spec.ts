import { describe, expect, it } from 'vitest'
import { isPromise } from './is-promise'

describe('isPromise utility function', () => {
  // 1. Positive cases (should return true)
  it('should return true for native Promise', () => {
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(new Promise(() => {}))).toBe(true)
    expect(isPromise((async () => {})())).toBe(true)
  })

  it('should return false for Promise-like objects', () => {
    const promiseLike = {
      // oxlint-disable-next-line no-thenable
      then: () => {},
      catch: () => {},
      finally: () => {},
    }
    expect(isPromise(promiseLike)).toBe(false)
  })

  // 2. Negative cases (should return false)
  it('should return false for non-Promise values', () => {
    expect(isPromise(null)).toBe(false)
    expect(isPromise(undefined)).toBe(false)
    expect(isPromise({})).toBe(false)
    expect(isPromise([])).toBe(false)
    expect(isPromise('Promise')).toBe(false)
    expect(isPromise(123)).toBe(false)
    expect(isPromise(true)).toBe(false)
    expect(isPromise(Symbol())).toBe(false)
    expect(isPromise(() => {})).toBe(false)
    expect(isPromise(new Date())).toBe(false)
  })

  it('should return false for incomplete Promise-like objects', () => {
    // oxlint-disable-next-line no-thenable
    expect(isPromise({ then: () => {} })).toBe(false) // Missing catch
    expect(isPromise({ catch: () => {} })).toBe(false) // Missing then
    // oxlint-disable-next-line no-thenable
    expect(isPromise({ then: 'not-a-function', catch: () => {} })).toBe(false)
  })

  // 3. Edge cases
  it('should handle Promise from different realms', () => {
    if (typeof document !== 'undefined') {
      const iframe = document.createElement('iframe')
      document.body.append(iframe)

      try {
        const iframePromise = iframe.contentWindow?.window.Promise.resolve()
        if (iframePromise) {
          expect(isPromise(iframePromise)).toBe(true)
        }
      } finally {
        iframe.remove()
      }
    }
  })

  it('should handle subclassed Promises', () => {
    class MyPromise<T> extends Promise<T> {}
    expect(isPromise(new MyPromise(() => {}))).toBe(true)
  })

  it('should handle Promise with modified prototype', () => {
    const p = Promise.resolve()
    Object.setPrototypeOf(p, Object.prototype)
    expect(isPromise(p)).toBe(false)
  })

  // 4. Type safety verification
  it('should properly narrow types when used as type guard', () => {
    const value: unknown = Promise.resolve('test')

    if (isPromise(value)) {
      // Inside this block, TypeScript should know value is Promise<any>
      value.then((val) => {
        expect(val).toBeDefined()
      })
    } else {
      expect.fail('Type guard failed')
    }
  })

  it('should work with generic type parameter', () => {
    const stringPromise: unknown = Promise.resolve('string')
    if (isPromise<string>(stringPromise)) {
      stringPromise.then((val) => {
        expect(typeof val).toBe('string')
      })
    }
  })

  // 5. Special cases
  it('should return false for thenables missing catch method', () => {
    // oxlint-disable-next-line no-thenable
    const thenable = { then: (resolve: any) => resolve() }
    expect(isPromise(thenable)).toBe(false)
  })

  it('should return false for objects with non-function then/catch', () => {
    // oxlint-disable-next-line no-thenable
    const fakePromise = { then: 'not-a-function', catch: 'not-a-function' }
    expect(isPromise(fakePromise)).toBe(false)
  })
})
