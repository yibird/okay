import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { timeRange } from './timeRange'

describe('timeRange', () => {
  it('should handle a single date', () => {
    const date = '2023-01-01 09:00:01'
    const result = timeRange(date)

    expect(result).toEqual({
      startDate: dayjs(date).format('HH:mm:ss'),
      endDate: null,
    })
  })

  it('should handle an array of two dates', () => {
    const arr: [string, string] = ['2023-01-01 09:00:01', '2023-01-02 18:00:00']
    const result = timeRange(arr)

    expect(result).toEqual({
      startDate: dayjs(arr[0]).format('HH:mm:ss'),
      endDate: dayjs(arr[1]).format('HH:mm:ss'),
    })
  })

  it('should handle an object with start and end', () => {
    const obj = { start: '2023-01-01 09:00:01', end: '2023-01-02 18:00:00' }
    const result = timeRange(obj)

    expect(result).toEqual({
      startDate: dayjs(obj.start).format('HH:mm:ss'),
      endDate: dayjs(obj.end).format('HH:mm:ss'),
    })
  })

  it('should throw if array has not exactly 2 dates', () => {
    expect(() => timeRange(['2023-01-01'] as any)).toThrow(
      'Array input must contain exactly 2 dates',
    )
  })

  it('should throw if date is invalid', () => {
    expect(() => timeRange('invalid-date')).toThrow('Invalid date(s) provided')
    expect(() => timeRange({ start: '2023-01-01', end: 'invalid' })).toThrow(
      'Invalid date(s) provided',
    )
  })

  it('should throw if start date is after end date', () => {
    expect(() => timeRange(['2023-01-31', '2023-01-01'])).toThrow(
      'Start date must be before or equal to end date',
    )
  })
})
