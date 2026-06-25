import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useSyncedRef } from './useSyncedRef'
import { nextTick } from 'vue'

describe('useSyncedRef', () => {
  it('initializes with source value', () => {
    const source = ref(42)
    const synced = useSyncedRef(source)
    expect(synced.value).toBe(42)
  })

  it('updates when source changes', async () => {
    const source = ref('a')
    const synced = useSyncedRef(source)
    source.value = 'b'
    await nextTick()
    expect(synced.value).toBe('b')
  })

  it('does not write back to source when target changes', async () => {
    const source = ref(1)
    const synced = useSyncedRef(source)
    synced.value = 99
    await nextTick()
    expect(source.value).toBe(1)
  })
})
