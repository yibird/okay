import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { isInYear } from './isInYear'

describe('isInYear', () => {
  test('should return true if date is in year', () => {
    expect(isInYear('2023-06-15', 2023)).toBe(true)
  })

  test('should return false if date is not in year', () => {
    expect(isInYear('2022-12-31', 2023)).toBe(false)
    expect(isInYear('2024-01-01', 2023)).toBe(false)
  })

  test('should handle dayjs objects', () => {
    const date = dayjs('2023-06-15')
    expect(isInYear(date, 2023)).toBe(true)
  })

  test('should handle invalid date', () => {
    // dayjs will parse invalid dates to current date
    const currentYear = dayjs().year()
    expect(isInYear('invalid-date', currentYear)).toBe(false)
  })
})
