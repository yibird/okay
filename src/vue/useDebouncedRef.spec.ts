import { describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useDebouncedRef } from './useDebouncedRef'

describe('useDebouncedRef', () => {
  it('should keep the previous value until delay finishes', () => {
    vi.useFakeTimers()
    const scope = effectScope()
    const value = scope.run(() => useDebouncedRef(1, { delay: 100 }))

    if (value) {
      value.value = 2
    }

    expect(value?.value).toBe(1)
    vi.advanceTimersByTime(100)
    expect(value?.value).toBe(2)
    scope.stop()
    vi.useRealTimers()
  })

  it('should commit only the last value in a burst', () => {
    vi.useFakeTimers()
    const scope = effectScope()
    const value = scope.run(() => useDebouncedRef('a', { delay: 100 }))

    if (value) {
      value.value = 'b'
      vi.advanceTimersByTime(50)
      value.value = 'c'
    }

    vi.advanceTimersByTime(99)
    expect(value?.value).toBe('a')
    vi.advanceTimersByTime(1)
    expect(value?.value).toBe('c')
    scope.stop()
    vi.useRealTimers()
  })

  it('should clear pending timer when scope stops', () => {
    vi.useFakeTimers()
    const scope = effectScope()
    const value = scope.run(() => useDebouncedRef(1, { delay: 100 }))

    if (value) {
      value.value = 2
    }
    scope.stop()
    vi.advanceTimersByTime(100)

    expect(value?.value).toBe(1)
    vi.useRealTimers()
  })

  it('should warn when called outside scope', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    useDebouncedRef(1)

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('scope'))
    warn.mockRestore()
  })
})
