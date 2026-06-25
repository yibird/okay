import { describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useThrottledRef } from './useThrottledRef'

describe('useThrottledRef', () => {
  it('should commit the first value immediately when leading is enabled', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100, leading: true }))

    if (value) {
      value.value = 1
    }

    expect(value?.value).toBe(1)
    scope.stop()
    vi.useRealTimers()
  })

  it('should commit trailing value after interval by default', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100 }))

    if (value) {
      value.value = 1
      value.value = 2
    }

    expect(value?.value).toBe(0)
    vi.advanceTimersByTime(100)
    expect(value?.value).toBe(2)
    scope.stop()
    vi.useRealTimers()
  })

  it('should commit immediately after the throttle interval has elapsed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100, leading: true }))

    if (value) {
      value.value = 1
      vi.setSystemTime(120)
      value.value = 2
    }

    expect(value?.value).toBe(2)
    scope.stop()
    vi.useRealTimers()
  })

  it('should keep the existing trailing timer while throttled', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100 }))

    if (value) {
      value.value = 1
      vi.advanceTimersByTime(50)
      value.value = 2
    }

    vi.advanceTimersByTime(50)

    expect(value?.value).toBe(2)
    scope.stop()
    vi.useRealTimers()
  })

  it('should schedule trailing update from remaining interval after a leading commit', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100, leading: true }))

    if (value) {
      value.value = 1
      vi.setSystemTime(40)
      value.value = 2
    }

    vi.advanceTimersByTime(59)
    expect(value?.value).toBe(1)
    vi.advanceTimersByTime(1)
    expect(value?.value).toBe(2)
    scope.stop()
    vi.useRealTimers()
  })

  it('should skip trailing updates when trailing is disabled', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100, trailing: false }))

    if (value) {
      value.value = 1
    }

    vi.advanceTimersByTime(100)

    expect(value?.value).toBe(0)
    scope.stop()
    vi.useRealTimers()
  })

  it('should clear pending trailing update when scope stops', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100 }))

    if (value) {
      value.value = 1
    }
    scope.stop()
    vi.advanceTimersByTime(100)

    expect(value?.value).toBe(0)
    vi.useRealTimers()
  })

  it('should warn when called outside scope', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    useThrottledRef(1)

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('scope'))
    warn.mockRestore()
  })
})
