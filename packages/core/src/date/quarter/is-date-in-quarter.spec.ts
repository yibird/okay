import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { isDateInQuarter } from './is-date-in-quarter'

describe('isDateInQuarter', () => {
  // Basic quarter tests
  it('should return true for dates in Q1', () => {
    expect(isDateInQuarter('2023-01-01', 1)).toBe(true)
    expect(isDateInQuarter('2023-02-15', 1)).toBe(true)
    expect(isDateInQuarter('2023-03-31', 1)).toBe(true)
  })

  it('should return false for dates not in Q1', () => {
    expect(isDateInQuarter('2023-04-01', 1)).toBe(false)
    expect(isDateInQuarter('2022-12-31', 1)).toBe(false)
  })

  // Boundary tests
  it('should handle exact quarter boundaries', () => {
    // First day of Q2
    expect(isDateInQuarter('2023-04-01', 2)).toBe(true)
    // Last day of Q2
    expect(isDateInQuarter('2023-06-30', 2)).toBe(true)
    // Day before Q2
    expect(isDateInQuarter('2023-03-31', 2)).toBe(false)
    // Day after Q2
    expect(isDateInQuarter('2023-07-01', 2)).toBe(false)
  })

  // Year specification tests
  it('should respect year parameter when provided', () => {
    expect(isDateInQuarter('2023-01-01', 1, 2023)).toBe(true)
    expect(isDateInQuarter('2023-01-01', 1, 2022)).toBe(false)
    expect(isDateInQuarter('2024-01-01', 1, 2023)).toBe(false)
  })

  // Input format tests
  it('should handle different date formats', () => {
    expect(isDateInQuarter(new Date(2023, 0, 1), 1)).toBe(true) // Jan 1, 2023
    expect(isDateInQuarter(dayjs('2023-04-15'), 2)).toBe(true)
    expect(isDateInQuarter('2023-07-15', 3)).toBe(true)
  })

  // Error cases
  it('should throw error for invalid quarter numbers', () => {
    expect(() => isDateInQuarter('2023-01-01', 0)).toThrow()
    expect(() => isDateInQuarter('2023-01-01', 5)).toThrow()
    expect(() => isDateInQuarter('2023-01-01', 1.5)).toThrow()
  })

  // Edge cases
  it('should handle time components correctly', () => {
    const startOfQ3 = dayjs('2023-07-01').startOf('day')
    const endOfQ3 = dayjs('2023-09-30').endOf('day')

    expect(isDateInQuarter(startOfQ3, 3)).toBe(true)
    expect(isDateInQuarter(endOfQ3, 3)).toBe(true)
    expect(isDateInQuarter(startOfQ3.subtract(1, 'ms'), 3)).toBe(false)
    expect(isDateInQuarter(endOfQ3.add(1, 'ms'), 3)).toBe(false)
  })
})
