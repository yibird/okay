import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  it('updates after debounce delay', async () => {
    vi.useFakeTimers()
    const source = ref(1)
    const scope = effectScope()
    const debounced = scope.run(() => useDebouncedValue(source, 100))!
    source.value = 2
    await nextTick()
    expect(debounced.value).toBe(1)
    vi.advanceTimersByTime(100)
    expect(debounced.value).toBe(2)
    scope.stop()
    vi.useRealTimers()
  })

  it('clears pending timer on rapid updates', async () => {
    vi.useFakeTimers()
    const source = ref(0)
    const scope = effectScope()
    const debounced = scope.run(() => useDebouncedValue(source, 100))!
    source.value = 1
    await nextTick()
    source.value = 2
    await nextTick()
    vi.advanceTimersByTime(100)
    expect(debounced.value).toBe(2)
    scope.stop()
    vi.useRealTimers()
  })

  it('warns when called outside scope', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    useDebouncedValue(ref(0), 100)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('scope'))
    warn.mockRestore()
  })

  it('clears pending timer when scope stops', async () => {
    vi.useFakeTimers()
    const source = ref(0)
    const scope = effectScope()
    const debounced = scope.run(() => useDebouncedValue(source, 100))!

    source.value = 1
    await nextTick()
    scope.stop()
    vi.advanceTimersByTime(100)

    expect(debounced.value).toBe(0)
    vi.useRealTimers()
  })
})
