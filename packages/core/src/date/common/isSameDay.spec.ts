import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { isSameDay } from './isSameDay'

describe('isSameDay', () => {
  it('should return true for dates on the same calendar day', () => {
    expect(isSameDay('2024-01-01T00:00:00', '2024-01-01T23:59:59')).toBe(true)
  })

  it('should return false for dates on different days', () => {
    expect(isSameDay('2024-01-01T23:59:59', '2024-01-02T00:00:00')).toBe(false)
  })

  it('should support Dayjs and Date inputs', () => {
    expect(isSameDay(dayjs('2024-02-29T12:00:00'), new Date(2024, 1, 29, 8))).toBe(true)
  })

  it('should use current date when the second date is omitted', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-10T12:00:00'))

    expect(isSameDay('2024-03-10T00:00:00')).toBe(true)
    expect(isSameDay('2024-03-09T23:59:59')).toBe(false)

    vi.useRealTimers()
  })

  it('should return false for invalid dates', () => {
    expect(isSameDay('invalid-date', '2024-01-01')).toBe(false)
    expect(isSameDay('2024-01-01', 'invalid-date')).toBe(false)
  })
})
