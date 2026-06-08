import { describe, expect, it, vi } from 'vitest'
import { composeRefs } from './composeRefs'
import { setRef } from './setRef'
import { isRef } from './isRef'
import { getRefValue } from './getRefValue'
import { withForwardedRef } from './withForwardedRef'
import type { RefCallback, RefObject } from 'react'

describe('react ref utilities', () => {
  it('should fill object and callback refs', () => {
    const objectRef: RefObject<HTMLDivElement | null> = { current: null }
    const callbackRef = vi.fn()
    const element = document.createElement('div')

    setRef(objectRef, element)
    setRef(callbackRef, element)

    expect(objectRef.current).toBe(element)
    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('should compose multiple refs', () => {
    const objectRef: RefObject<HTMLDivElement | null> = { current: null }
    const callbackRef = vi.fn()
    const element = document.createElement('div')

    composeRefs(objectRef, callbackRef)(element)

    expect(objectRef.current).toBe(element)
    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('composeRefs returns undefined cleanup when no refs produce cleanup', () => {
    expect(
      composeRefs<HTMLDivElement>(null, undefined)(document.createElement('div')),
    ).toBeUndefined()
  })

  it('should return a merged cleanup for React callback refs', () => {
    const objectRef: RefObject<HTMLDivElement | null> = { current: null }
    const callbackCleanup = vi.fn()
    const callbackRef: RefCallback<HTMLDivElement> = () => callbackCleanup
    const element = document.createElement('div')

    const cleanup = composeRefs(objectRef, callbackRef)(element)

    expect(objectRef.current).toBe(element)
    expect(typeof cleanup).toBe('function')

    cleanup?.()

    expect(callbackCleanup).toHaveBeenCalledOnce()
    expect(objectRef.current).toBeNull()
  })

  it('should recognize refs with null or undefined current values', () => {
    expect(isRef({ current: null })).toBe(true)
    expect(isRef({ current: undefined })).toBe(true)
    expect(isRef({})).toBe(false)
  })

  it('setRef handles null/undefined ref', () => {
    expect(setRef(null, document.createElement('div'))).toBeUndefined()
    expect(setRef(undefined, document.createElement('div'))).toBeUndefined()
  })

  it('setRef returns cleanup that nullifies object ref on non-null value', () => {
    const ref: RefObject<HTMLDivElement | null> = { current: null }
    const el = document.createElement('div')
    const cleanup = setRef(ref, el)
    expect(typeof cleanup).toBe('function')
    cleanup?.()
    expect(ref.current).toBeNull()
  })

  it('setRef returns undefined cleanup for null value on object ref', () => {
    const ref: RefObject<HTMLDivElement | null> = { current: null }
    const cleanup = setRef(ref, null)
    expect(cleanup).toBeUndefined()
  })

  it('setRef callback ref returning non-function yields undefined cleanup', () => {
    const cb = vi.fn(() => undefined as any)
    const el = document.createElement('div')
    const cleanup = setRef(cb, el)
    expect(cleanup).toBeUndefined()
  })

  it('getRefValue unwraps object ref current', () => {
    const ref: RefObject<number> = { current: 42 }
    expect(getRefValue(ref)).toBe(42)
  })

  it('getRefValue returns direct values unchanged', () => {
    expect(getRefValue(42)).toBe(42)
  })

  it('withForwardedRef wraps render function with React.forwardRef', () => {
    const render = vi.fn(() => null)
    const component = withForwardedRef<HTMLDivElement, { id: string }>(render)

    expect(component).toBeDefined()
  })
})
