import { describe, it, expect, expectTypeOf } from 'vitest'
import dayjs from 'dayjs'
import type { DateRangeInput, FormattedRangeResult } from './index'
import { formatRange } from './formatRange'

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
    expect(result).toEqual({
      startDate: dayjs(arr[0]).format('YYYY-MM-DD HH:mm:ss'),
      endDate: dayjs(arr[1]).format('YYYY-MM-DD HH:mm:ss'),
    })
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
    expect(() => formatRange('invalid-date')).toThrow('Invalid date(s) provided')
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
    expect(result).toEqual({
      startDate: dayjs(arr[0]).format(template),
      endDate: dayjs(arr[1]).format(template),
    })
  })

  it('should expose range input and result types from the format barrel', () => {
    const input: DateRangeInput = ['2023-01-01', '2023-01-02']
    const result: FormattedRangeResult = formatRange(input)

    expectTypeOf(result.endDate).toEqualTypeOf<string | null>()
    expect(result.startDate).toBe(dayjs(input[0]).format('YYYY-MM-DD HH:mm:ss'))
  })
})
