import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { diffYears } from './diffYears'

describe('diffYears', () => {
  test('should return year difference between dates', () => {
    const date1 = dayjs('2020-01-01')
    const date2 = dayjs('2023-01-01')
    expect(diffYears(date2, date1)).toBe(3)
  })

  test('should return negative difference when first date is earlier', () => {
    const date1 = dayjs('2023-01-01')
    const date2 = dayjs('2020-01-01')
    expect(diffYears(date2, date1)).toBe(-3)
  })

  test('should handle same year', () => {
    const date1 = dayjs('2023-01-01')
    const date2 = dayjs('2023-12-31')
    expect(diffYears(date2, date1)).toBe(0)
  })

  test('should handle same date', () => {
    const date1 = dayjs('2023-01-01')
    const date2 = dayjs('2023-01-01')
    expect(diffYears(date2, date1)).toBe(0)
  })
})
