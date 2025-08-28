import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { formatRangeWithDate } from './format-range-with-date'

describe('formatRangeWithDate', () => {
  it('should handle a single date', () => {
    const date = '2023-01-01'
    const result = formatRangeWithDate(date)
    expect(result).toEqual({
      startDate: dayjs(date).format('YYYY-MM-DD'),
      endDate: null,
    })
  })

  it('should handle an array of two dates', () => {
    const arr: [string, string] = ['2023-01-01 09:00:01', '2023-01-31 18:00:00']
    const result = formatRangeWithDate(arr)
    expect(result).toEqual([
      dayjs(arr[0]).format('YYYY-MM-DD'),
      dayjs(arr[1]).format('YYYY-MM-DD'),
    ])
  })

  it('should handle an object with start and end', () => {
    const obj = { start: '2023-01-01 09:00:01', end: '2023-01-31 18:00:00' }
    const result = formatRangeWithDate(obj)
    expect(result).toEqual([
      dayjs(obj.start).format('YYYY-MM-DD'),
      dayjs(obj.end).format('YYYY-MM-DD'),
    ])
  })

  it('should throw if array has not exactly 2 dates', () => {
    expect(() => formatRangeWithDate(['2023-01-01'] as any)).toThrow(
      'Array input must contain exactly 2 dates',
    )
  })

  it('should throw if date is invalid', () => {
    expect(() => formatRangeWithDate('invalid-date')).toThrow(
      'Invalid date(s) provided',
    )
    expect(() =>
      formatRangeWithDate({ start: '2023-01-01', end: 'invalid' }),
    ).toThrow('Invalid date(s) provided')
  })

  it('should throw if start date is after end date', () => {
    expect(() => formatRangeWithDate(['2023-01-31', '2023-01-01'])).toThrow(
      'Start date must be before or equal to end date',
    )
  })
})
