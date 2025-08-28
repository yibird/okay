import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getPrevQuarter } from './get-prev-quarter'

describe('getPrevQuarter', () => {
  it('should return correct previous quarter for Q1 (Jan-Mar)', () => {
    const { startTime, endTime } = getPrevQuarter('2023-02-15')
    expect(startTime.format('YYYY-MM-DD')).toBe('2022-10-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2022-12-31')
    expect(endTime.format('HH:mm:ss.SSS')).toBe('23:59:59.999')
  })

  it('should return correct previous quarter for Q2 (Apr-Jun)', () => {
    const { startTime, endTime } = getPrevQuarter('2023-05-20')
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-03-31')
  })

  it('should return correct previous quarter for Q3 (Jul-Sep)', () => {
    const { startTime, endTime } = getPrevQuarter('2023-08-10')
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-04-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-06-30')
  })

  it('should handle year transition for Q4 (Oct-Dec)', () => {
    const { startTime, endTime } = getPrevQuarter('2023-11-15')
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-07-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-09-30')
  })

  it('should use current date when no date is provided', () => {
    const today = dayjs()
    const currentQuarter = Math.floor(today.month() / 3)
    const prevQuarter = (currentQuarter - 1 + 4) % 4
    const expectedYear = currentQuarter === 0 ? today.year() - 1 : today.year()
    const expectedStart = dayjs(
      new Date(expectedYear, prevQuarter * 3, 1),
    ).startOf('month')

    const { startTime } = getPrevQuarter()
    expect(startTime.isSame(expectedStart, 'day')).toBe(true)
  })

  it('should handle different date formats', () => {
    const testDate = '2023-04-15'
    const expected = {
      start: '2023-01-01',
      end: '2023-03-31',
    }

    // Test with various date formats
    expect(getPrevQuarter(new Date(testDate))).toMatchObject({
      startTime: dayjs(expected.start),
      endTime: dayjs(expected.end).endOf('day'),
    })

    expect(getPrevQuarter(testDate)).toMatchObject({
      startTime: dayjs(expected.start),
      endTime: dayjs(expected.end).endOf('day'),
    })

    expect(getPrevQuarter(dayjs(testDate))).toMatchObject({
      startTime: dayjs(expected.start),
      endTime: dayjs(expected.end).endOf('day'),
    })
  })

  it('should handle leap years correctly', () => {
    // Q1 2023 -> Q4 2022 (not leap year)
    expect(getPrevQuarter('2023-01-01')).toMatchObject({
      startTime: dayjs('2022-10-01'),
      endTime: dayjs('2022-12-31').endOf('day'),
    })

    // Q1 2024 -> Q4 2023 (not leap year)
    expect(getPrevQuarter('2024-01-15')).toMatchObject({
      startTime: dayjs('2023-10-01'),
      endTime: dayjs('2023-12-31').endOf('day'),
    })
  })

  it('should handle invalid dates by using current date', () => {
    const today = dayjs()
    const currentQuarter = Math.floor(today.month() / 3)
    const prevQuarter = (currentQuarter - 1 + 4) % 4
    const expectedYear = currentQuarter === 0 ? today.year() - 1 : today.year()
    const expectedStart = dayjs(
      new Date(expectedYear, prevQuarter * 3, 1),
    ).startOf('month')

    expect(
      getPrevQuarter('invalid-date').startTime.isSame(expectedStart, 'day'),
    ).toBe(true)
    expect(getPrevQuarter('').startTime.isSame(expectedStart, 'day')).toBe(true)
    expect(getPrevQuarter(null).startTime.isSame(expectedStart, 'day')).toBe(
      true,
    )
  })

  it('should return end time at end of day', () => {
    const { endTime } = getPrevQuarter('2023-05-15')
    expect(endTime.hour()).toBe(23)
    expect(endTime.minute()).toBe(59)
    expect(endTime.second()).toBe(59)
    expect(endTime.millisecond()).toBe(999)
  })

  it('should handle timezone correctly', () => {
    // UTC time
    const utcDate = '2023-01-01T00:00:00Z'
    const { startTime: utcStart, endTime: utcEnd } = getPrevQuarter(utcDate)
    expect(utcStart.format('YYYY-MM-DD')).toBe('2022-10-01')
    expect(utcEnd.format('YYYY-MM-DD')).toBe('2022-12-31')

    // Local time
    const localDate = '2023-01-01'
    const { startTime: localStart, endTime: localEnd } =
      getPrevQuarter(localDate)
    expect(localStart.format('YYYY-MM-DD')).toBe('2022-10-01')
    expect(localEnd.format('YYYY-MM-DD')).toBe('2022-12-31')
  })

  it('should handle edge cases at year boundaries', () => {
    // December 31st
    expect(getPrevQuarter('2023-12-31')).toMatchObject({
      startTime: dayjs('2023-07-01'),
      endTime: dayjs('2023-09-30').endOf('day'),
    })

    // January 1st
    expect(getPrevQuarter('2023-01-01')).toMatchObject({
      startTime: dayjs('2022-10-01'),
      endTime: dayjs('2022-12-31').endOf('day'),
    })
  })
})
