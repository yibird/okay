import { describe, expect, it, vi } from 'vitest'
import { withTimeout } from './withTimeout'

describe('withTimeout', () => {
  it('should resolve when promise resolves before timeout', async () => {
    await expect(withTimeout(Promise.resolve('success'), 1000)).resolves.toBe('success')
  })

  it('should reject when promise rejects before timeout', async () => {
    await expect(withTimeout(Promise.reject(new Error('failure')), 1000)).rejects.toThrow('failure')
  })

  it('should reject with timeout error when promise takes too long', async () => {
    await expect(withTimeout(new Promise((r) => setTimeout(r, 200)), 100)).rejects.toThrow(
      'Promise timeout',
    )
  })

  it('should use custom timeout error message', async () => {
    await expect(
      withTimeout(new Promise((r) => setTimeout(r, 200)), 100, new Error('Custom timeout')),
    ).rejects.toThrow('Custom timeout')
  })

  it('should clear timeout after promise resolves', async () => {
    const spy = vi.spyOn(global, 'clearTimeout')
    await withTimeout(Promise.resolve('success'), 1000)
    expect(spy).toHaveBeenCalled()
  })

  it('should clear timeout after promise rejects', async () => {
    const spy = vi.spyOn(global, 'clearTimeout')
    try {
      await withTimeout(Promise.reject(new Error('failure')), 1000)
    } catch {}
    expect(spy).toHaveBeenCalled()
  })

  it('should ignore late resolve after timeout fires', async () => {
    let resolveOuter!: () => void
    const p = new Promise<void>((r) => {
      resolveOuter = r
    })
    await expect(withTimeout(p, 50)).rejects.toThrow('Promise timeout')
    resolveOuter() // should not throw
  })
})
