import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { isInMonth } from './isInMonth'

describe('isInMonth', () => {
  it('should return true for dates in the specified month', () => {
    expect(isInMonth('2023-05-15', 5)).toBe(true)
    expect(isInMonth(new Date(2023, 4, 15), 5)).toBe(true)
    expect(isInMonth(dayjs('2023-05-15'), 5)).toBe(true)
  })

  it('should return false for dates not in the specified month', () => {
    expect(isInMonth('2023-05-15', 6)).toBe(false)
    expect(isInMonth('2023-04-30', 5)).toBe(false)
  })

  it('should handle month boundaries correctly', () => {
    expect(isInMonth('2023-05-01', 5)).toBe(true)
    expect(isInMonth('2023-05-31', 5)).toBe(true)
    expect(isInMonth('2023-04-30', 5)).toBe(false)
    expect(isInMonth('2023-06-01', 5)).toBe(false)
  })

  it('should validate month input', () => {
    expect(() => isInMonth('2023-05-15', 0)).toThrow('Month must be between 1 and 12')
    expect(() => isInMonth('2023-05-15', 13)).toThrow('Month must be between 1 and 12')
    expect(() => isInMonth('2023-05-15', 1.5)).toThrow('Month must be between 1 and 12')
    expect(() => isInMonth('2023-05-15', Number.NaN)).toThrow('Month must be between 1 and 12')
  })

  it('should validate date input', () => {
    expect(() => isInMonth('invalid-date', 5)).toThrow('Invalid date provided')
    expect(() => isInMonth(null, 5)).toThrow('Invalid date provided')
  })

  it('should handle different date formats', () => {
    expect(isInMonth('05/15/2023', 5)).toBe(true)
    expect(isInMonth('2023-05-15T12:00:00Z', 5)).toBe(true)
    expect(isInMonth('15 May 2023', 5)).toBe(true)
  })

  it('should handle time component correctly', () => {
    expect(isInMonth('2023-05-15T23:59:59', 5)).toBe(true)
    expect(isInMonth('2023-05-15T00:00:00', 5)).toBe(true)
  })

  it('should work across different years', () => {
    expect(isInMonth('2022-05-15', 5)).toBe(true)
    expect(isInMonth('2024-05-15', 5)).toBe(true)
  })
})
