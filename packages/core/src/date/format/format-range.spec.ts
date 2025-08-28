import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { formatRange } from './format-range'

describe('formatRange', () => {
  it('should handle a single date', () => {
    const date = '2023-01-01'
    const result = formatRange(date)
    expect(result).toEqual({
      startDate: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      endDate: null,
    })
  })

  it('should handle an array of two dates', () => {
    const arr: [string, string] = ['2023-01-01 09:00:01', '2023-01-31 18:00:00']
    const result = formatRange(arr)
    expect(result).toEqual([
      dayjs(arr[0]).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(arr[1]).format('YYYY-MM-DD HH:mm:ss'),
    ])
  })

  it('should handle an object with start and end', () => {
    const obj = { start: '2023-01-01 09:00:01', end: '2023-01-01 09:00:01' }
    const result = formatRange(obj)
    expect(result).toEqual({
      startDate: dayjs(obj.start).format('YYYY-MM-DD HH:mm:ss'),
      endDate: null, // same day returns null
    })
  })

  it('should throw if array has not exactly 2 dates', () => {
    expect(() => formatRange(['2023-01-01'] as any)).toThrow(
      'Array input must contain exactly 2 dates',
    )
  })

  it('should throw if date is invalid', () => {
    expect(() => formatRange('invalid-date')).toThrow(
      'Invalid date(s) provided',
    )
    expect(() => formatRange({ start: '2023-01-01', end: 'invalid' })).toThrow(
      'Invalid date(s) provided',
    )
  })

  it('should throw if start date is after end date', () => {
    expect(() => formatRange(['2023-01-31', '2023-01-01'])).toThrow(
      'Start date must be before or equal to end date',
    )
  })

  it('should format dates with custom template', () => {
    const template = 'YYYY/MM/DD'
    const arr: [string, string] = ['2023-01-01', '2023-01-31']
    const result = formatRange(arr, template)
    expect(result).toEqual([
      dayjs(arr[0]).format(template),
      dayjs(arr[1]).format(template),
    ])
  })
})
