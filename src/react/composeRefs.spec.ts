import { describe, expect, it, vi } from 'vitest'
import { composeRefs } from './composeRefs'
import type { CleanupRefCallback, WritableRef } from './setRef'

describe('composeRefs', () => {
  it('should write one value into every valid ref', () => {
    const objectRef: WritableRef<HTMLDivElement> = { current: null }
    const callbackRef = vi.fn()
    const element = document.createElement('div')

    composeRefs(objectRef, callbackRef)(element)

    expect(objectRef.current).toBe(element)
    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('should ignore null and undefined refs', () => {
    const element = document.createElement('div')

    const cleanup = composeRefs<HTMLDivElement>(null, undefined)(element)

    expect(cleanup).toBeUndefined()
  })

  it('should return merged cleanup when refs provide cleanup callbacks', () => {
    const objectRef: WritableRef<HTMLDivElement> = { current: null }
    const firstCleanup = vi.fn()
    const secondCleanup = vi.fn()
    const firstRef: CleanupRefCallback<HTMLDivElement> = () => firstCleanup
    const secondRef: CleanupRefCallback<HTMLDivElement> = () => secondCleanup
    const element = document.createElement('div')

    const cleanup = composeRefs(objectRef, firstRef, secondRef)(element)
    cleanup?.()

    expect(objectRef.current).toBeNull()
    expect(secondCleanup).toHaveBeenCalledBefore(firstCleanup)
  })

  it('should return undefined when no ref produces cleanup', () => {
    const callbackRef = vi.fn((): void => undefined)

    const cleanup = composeRefs(callbackRef)(document.createElement('div'))

    expect(cleanup).toBeUndefined()
  })
})
