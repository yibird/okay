import { describe, expect, it } from 'vitest'
import { isBusinessDay } from './isBusinessDay'

describe('isBusinessDay', () => {
  it('should return true for weekdays and false for weekends by default', () => {
    expect(isBusinessDay('2024-01-05')).toBe(true)
    expect(isBusinessDay('2024-01-06')).toBe(false)
    expect(isBusinessDay('2024-01-07')).toBe(false)
  })

  it('should support custom weekend days', () => {
    expect(isBusinessDay('2024-01-05', { weekendDays: [5, 6] })).toBe(false)
    expect(isBusinessDay('2024-01-07', { weekendDays: [5, 6] })).toBe(true)
  })

  it('should exclude holidays', () => {
    expect(
      isBusinessDay('2024-01-05', {
        holidays: ['2024-01-05'],
      }),
    ).toBe(false)
  })

  it('should return false for invalid dates', () => {
    expect(isBusinessDay('invalid-date')).toBe(false)
  })

  it('should validate custom weekend days', () => {
    expect(() => isBusinessDay('2024-01-05', { weekendDays: [7 as 0] })).toThrow(
      'weekendDays must contain integers from 0 to 6',
    )
  })
})
