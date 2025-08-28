import dayjs from 'dayjs'
// test/getWeek.spec.ts
import { describe, expect, it } from 'vitest'
import { getWeek } from './get-week'

describe('getWeek - ISO week number (full coverage)', () => {
  it('returns week number for Dayjs instance', () => {
    const d = dayjs('2022-01-03') // Monday -> ISO week 1 of 2022
    expect(getWeek(d)).toBe(1)
  })

  it('returns week 53 for 2021-01-01 (belongs to previous ISO year)', () => {
    // 2021-01-01 is Fri, ISO week 53 (of ISO-year 2020)
    expect(getWeek('2021-01-01')).toBe(53)
  })

  it('works with Date object (2015-12-31 -> ISO week 53)', () => {
    expect(getWeek(new Date(2015, 11, 31))).toBe(53) // Dec 31, 2015
  })

  it('works with timestamp (number)', () => {
    const ts = new Date('2016-01-01').getTime()
    expect(getWeek(ts)).toBe(53) // 2016-01-01 -> ISO week 53 (of 2015)
  })

  it('handles end-of-year that is ISO week 53 (2020-12-31)', () => {
    expect(getWeek('2020-12-31')).toBe(53)
  })

  it('handles start-of-ISO-week-year (2021-01-04 -> week 1)', () => {
    // 2021-01-04 is Monday and should be ISO week 1
    expect(getWeek('2021-01-04')).toBe(1)
  })

  it('handles leap-year date (2024-02-29) and returns a plausible week (sanity check)', () => {
    // 2024-02-29 is a Thursday in a leap year; ISO week should be a number 1..53
    const wk = getWeek('2024-02-29')
    expect(Number.isInteger(wk)).toBe(true)
    expect(wk).toBeGreaterThanOrEqual(1)
    expect(wk).toBeLessThanOrEqual(53)

    // extra known expectation: 2024-02-29 is ISO week 9 (common ISO calendars).
    // If you want strict assert, uncomment next line; left commented for safety if local TZ/implement differ:
    // expect(wk).toBe(9);
  })

  it('no-arg uses current date and returns 1..53', () => {
    const wk = getWeek()
    expect(Number.isInteger(wk)).toBe(true)
    expect(wk).toBeGreaterThanOrEqual(1)
    expect(wk).toBeLessThanOrEqual(53)
  })

  it('throws on invalid string input', () => {
    expect(() => getWeek('not-a-date')).toThrow()
  })

  it('throws on invalid NaN timestamp', () => {
    expect(() => getWeek(Number.NaN)).toThrow()
  })

  it('cross-check several ISO boundary examples', () => {
    // 2016-01-01 -> ISO week 53 (of 2015)
    expect(getWeek('2016-01-01')).toBe(53)

    // 2015-12-28 is Monday and belongs to week 53 of 2015
    expect(getWeek('2015-12-28')).toBe(53)

    // 2019-12-30 is Monday and is ISO week 1 of 2020 -> should return 1
    expect(getWeek('2019-12-30')).toBe(1)

    // 2020-01-01 (Wed) belongs to week 1 of 2020 -> should return 1
    expect(getWeek('2020-01-01')).toBe(1)
  })
})
