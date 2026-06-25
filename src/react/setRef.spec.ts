import { describe, expect, it, vi } from 'vitest'
import { setRef } from './setRef'
import type { CleanupRefCallback, WritableRef } from './setRef'

describe('setRef', () => {
  it('should safely ignore empty refs', () => {
    const element = document.createElement('div')

    expect(setRef(null, element)).toBeUndefined()
    expect(setRef(undefined, element)).toBeUndefined()
  })

  it('should write values into object refs', () => {
    const objectRef: WritableRef<HTMLDivElement> = { current: null }
    const element = document.createElement('div')

    const cleanup = setRef(objectRef, element)

    expect(objectRef.current).toBe(element)
    expect(typeof cleanup).toBe('function')
  })

  it('should reset object refs when cleanup runs', () => {
    const objectRef: WritableRef<HTMLDivElement> = { current: null }
    const element = document.createElement('div')

    const cleanup = setRef(objectRef, element)
    cleanup?.()

    expect(objectRef.current).toBeNull()
  })

  it('should not create cleanup when writing null into object refs', () => {
    const objectRef: WritableRef<HTMLDivElement> = { current: null }

    const cleanup = setRef(objectRef, null)

    expect(objectRef.current).toBeNull()
    expect(cleanup).toBeUndefined()
  })

  it('should call callback refs with the next value', () => {
    const callbackRef = vi.fn()
    const element = document.createElement('div')

    setRef(callbackRef, element)

    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('should return cleanup from callback refs', () => {
    const cleanup = vi.fn()
    const callbackRef: CleanupRefCallback<HTMLDivElement> = () => cleanup
    const element = document.createElement('div')

    const returnedCleanup = setRef(callbackRef, element)
    returnedCleanup?.()

    expect(cleanup).toHaveBeenCalledOnce()
  })

  it('should ignore non-function callback return values', () => {
    const callbackRef = vi.fn((): void => undefined)

    const cleanup = setRef(callbackRef, document.createElement('div'))

    expect(cleanup).toBeUndefined()
  })

  it('should ignore unsupported object-like refs', () => {
    const cleanup = setRef(Object.create(null), document.createElement('div'))

    expect(cleanup).toBeUndefined()
  })
})
