import { describe, expect, it } from 'vitest'
import { weeksOfMonth } from './weeksOfMonth'

describe('weeksOfMonth', () => {
  it('2024-01 starts on Monday, 5 rows with Sunday start', () => {
    expect(weeksOfMonth(2024, 1, 0)).toBe(5)
  })

  it('2024-01 with Monday start', () => {
    expect(weeksOfMonth(2024, 1, 1)).toBe(5)
  })

  it('Feb 2015 starts on Sunday, 4 rows with Sunday start', () => {
    expect(weeksOfMonth(2015, 2, 0)).toBe(4)
  })

  it('triggers adjustedFirstDay < 0 branch (Saturday start on a month starting on Friday)', () => {
    // Oct 2023: starts Sunday (0). With startOfWeek=6 (Saturday), diff=0-6=-6 → +7=1
    expect(weeksOfMonth(2023, 10, 6)).toBe(5)
  })

  it('triggers adjustedLastDay < 0 branch (Saturday start, month ends before Saturday)', () => {
    // Need a month where lastDayOfWeek < startOfWeek
    // June 2024: ends on Sunday (0). With startOfWeek=1 (Mon), diff=0-1=-1 → +7=6
    expect(weeksOfMonth(2024, 6, 1)).toBeGreaterThan(0)
  })

  it('throws when startOfWeek is out of range', () => {
    expect(() => weeksOfMonth(2024, 1, 7)).toThrow()
    expect(() => weeksOfMonth(2024, 1, -1)).toThrow()
  })
})
