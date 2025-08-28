import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { formatRangeWithDatetime } from './format-range-with-datetime'

describe('formatRangeWithDatetime', () => {
  it('should handle a single date', () => {
    const date = '2023-01-01 09:01:01'
    const result = formatRangeWithDatetime(date)
    expect(result).toEqual({
      startDate: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      endDate: null,
    })
  })

  it('should handle an array of two dates', () => {
    const arr: [string, string] = ['2023-01-01 09:01:01', '2023-01-31 10:01:01']
    const result = formatRangeWithDatetime(arr)
    expect(result).toEqual([
      dayjs(arr[0]).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(arr[1]).format('YYYY-MM-DD HH:mm:ss'),
    ])
  })

  it('should handle an object with start and end', () => {
    const obj = { start: '2023-01-01 09:01:01', end: '2023-01-31 10:01:01' }
    const result = formatRangeWithDatetime(obj)
    expect(result).toEqual([
      dayjs(obj.start).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(obj.end).format('YYYY-MM-DD HH:mm:ss'),
    ])
  })

  it('should throw if array has not exactly 2 dates', () => {
    expect(() => formatRangeWithDatetime(['2023-01-01'] as any)).toThrow(
      'Array input must contain exactly 2 dates',
    )
  })

  it('should throw if date is invalid', () => {
    expect(() => formatRangeWithDatetime('invalid-date')).toThrow(
      'Invalid date(s) provided',
    )
    expect(() =>
      formatRangeWithDatetime({ start: '2023-01-01', end: 'invalid' }),
    ).toThrow('Invalid date(s) provided')
  })

  it('should throw if start date is after end date', () => {
    expect(() =>
      formatRangeWithDatetime(['2023-01-31 10:01:01', '2023-01-01 09:01:01']),
    ).toThrow('Start date must be before or equal to end date')
  })
})
