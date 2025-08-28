import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { getMonthDiff } from './get-month-diff'

describe('getMonthDiff', () => {
  test('should return month difference between dates', () => {
    const date1 = dayjs('2023-01-01')
    const date2 = dayjs('2023-03-01')
    expect(getMonthDiff(date2, date1)).toBe(2)
  })

  test('should return negative difference when first date is earlier', () => {
    const date1 = dayjs('2023-03-01')
    const date2 = dayjs('2023-01-01')
    expect(getMonthDiff(date2, date1)).toBe(-2)
  })

  test('should handle same month', () => {
    const date1 = dayjs('2023-01-01')
    const date2 = dayjs('2023-01-15')
    expect(getMonthDiff(date2, date1)).toBe(0)
  })

  test('should handle different years', () => {
    const date1 = dayjs('2022-01-01')
    const date2 = dayjs('2023-01-01')
    expect(getMonthDiff(date2, date1)).toBe(12)
  })
})
