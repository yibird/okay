import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isLeapYear } from './is-leap-year'

describe('isLeapYear', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    // 世纪闰年
    ['2000-01-01', true],
    ['2400-01-01', true],
    // 普通闰年
    ['2020-02-29', true],
    ['1996-01-01', true],
    // 非闰年
    ['1900-01-01', false],
    ['2100-01-01', false],
    ['2023-03-01', false],
    // 数字年份输入
    [2000, false],
    [1900, false],
    [2020, false],
    [2023, false],
    // // 边界情况
    // [0, false],
    // [-4, false],

    [Date.parse('2000-01-01'), true],
    [Date.parse('1900-01-01'), false],
    [Date.parse('2020-01-01'), true],
    [Date.parse('2023-01-01'), false],
  ])('should return %s for input %s', (input, expected) => {
    expect(isLeapYear(input)).toBe(expected)
  })

  it('should use current date when no argument', () => {
    vi.setSystemTime(new Date('2020-02-29'))
    expect(isLeapYear()).toBe(true)

    vi.setSystemTime(new Date('2023-03-01'))
    expect(isLeapYear()).toBe(false)
  })

  it('should throw error for invalid input', () => {
    expect(() => isLeapYear('invalid-date')).toThrow('Invalid date input')
    expect(() => isLeapYear(Number.NaN)).toThrow('Invalid date input')
  })
})
