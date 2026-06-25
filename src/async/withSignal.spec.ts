import { describe, expect, it, vi } from 'vitest'
import { withSignal } from './withSignal'

describe('withSignal', () => {
  it('should resolve when original promise resolves and signal is not aborted', async () => {
    const originalPromise = Promise.resolve('success')
    await expect(withSignal(originalPromise)).resolves.toBe('success')
  })

  it('should reject when original promise rejects and signal is not aborted', async () => {
    const originalPromise = Promise.reject(new Error('failure'))
    await expect(withSignal(originalPromise)).rejects.toThrow('failure')
  })

  it('should reject original promise errors when signal is active', async () => {
    const controller = new AbortController()
    const originalPromise = Promise.reject(new Error('failure'))

    await expect(withSignal(originalPromise, controller.signal)).rejects.toThrow('failure')
  })

  it('should reject immediately when signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(withSignal(Promise.resolve('success'), controller.signal)).rejects.toThrow(
      'Aborted',
    )
  })

  it('should reject when signal is aborted during promise execution', async () => {
    const controller = new AbortController()
    const p = withSignal(new Promise((r) => setTimeout(r, 100)), controller.signal)
    controller.abort()
    await expect(p).rejects.toThrow('Aborted')
  })

  it('should remove abort listener after promise settles', async () => {
    const controller = new AbortController()
    const removeEventListener = vi.spyOn(controller.signal, 'removeEventListener')
    await withSignal(Promise.resolve('success'), controller.signal)
    expect(removeEventListener).toHaveBeenCalledWith('abort', expect.any(Function))
  })

  it('uses Error reason directly when reason is a meaningful Error', async () => {
    const controller = new AbortController()
    const err = new Error('custom reason')
    controller.abort(err)
    await expect(withSignal(new Promise(() => {}), controller.signal)).rejects.toBe(err)
  })

  it('wraps non-Error reason in new Error', async () => {
    const controller = new AbortController()
    controller.abort('some string reason')
    await expect(withSignal(new Promise(() => {}), controller.signal)).rejects.toThrow(
      'some string reason',
    )
  })

  it('signal reason is undefined falls back to Aborted', async () => {
    const signal = {
      aborted: true,
      reason: undefined,
    } as AbortSignal

    await expect(withSignal(new Promise(() => {}), signal)).rejects.toThrow('Aborted')
  })
})
