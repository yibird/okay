import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useValidatedRef } from './useValidatedRef'

describe('useValidatedRef', () => {
  it('runs validator immediately with initial value', () => {
    const { error } = useValidatedRef('', (v) => v.length > 0 || 'required')
    expect(error.value).toBe('required')
  })

  it('clears error when validator returns true', async () => {
    const { value, error } = useValidatedRef('', (v) => v.length > 0)
    expect(error.value).toBe('Invalid')
    value.value = 'ok'
    await nextTick()
    expect(error.value).toBe('')
  })

  it('sets generic Invalid when validator returns false', async () => {
    const { value, error } = useValidatedRef('ok', (v) => v.length > 0)
    value.value = ''
    await nextTick()
    expect(error.value).toBe('Invalid')
  })

  it('uses string returned by validator as error message', async () => {
    const { value, error } = useValidatedRef(5, (v) => v >= 0 || 'must be non-negative')
    value.value = -1
    await nextTick()
    expect(error.value).toBe('must be non-negative')
  })
})
