import { describe, expect, it, vi } from 'vitest'
import { withForwardedRef } from './withForwardedRef'

describe('withForwardedRef', () => {
  it('should wrap render functions with React.forwardRef', () => {
    const render = vi.fn(() => null)

    const component = withForwardedRef<HTMLDivElement, { id: string }>(render)

    expect(component).toBeDefined()
  })
})
