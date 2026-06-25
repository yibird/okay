import { describe, expect, it } from 'vitest'
import { businessDays } from './businessDays'
import { createHolidaySet, isHolidayFromSet } from './businessDayShared'
import dayjs from 'dayjs'

describe('businessDays', () => {
  it('counts inclusively by default', () => {
    expect(businessDays('2024-01-01', '2024-01-07')).toBe(5)
  })

  it('supports excluding start and end', () => {
    expect(
      businessDays('2024-01-01', '2024-01-07', { includeStart: false, includeEnd: false }),
    ).toBe(4)
  })

  it('subtracts holidays', () => {
    expect(
      businessDays('2024-01-01', '2024-01-07', { holidays: ['2024-01-01', '2024-01-06'] }),
    ).toBe(4)
  })

  it('supports custom weekend days', () => {
    expect(businessDays('2024-01-01', '2024-01-07', { weekendDays: [5, 6] })).toBe(5)
  })

  it('returns zero for empty exclusive range', () => {
    expect(businessDays('2024-01-01', '2024-01-01', { includeStart: false })).toBe(0)
  })

  it('returns positive for reversed range by default', () => {
    expect(businessDays('2024-01-07', '2024-01-01')).toBe(5)
  })

  it('returns negative for reversed range when signed', () => {
    expect(businessDays('2024-01-07', '2024-01-01', { signed: true })).toBe(-5)
  })

  it('supports excluding boundaries for reversed ranges', () => {
    expect(
      businessDays('2024-01-07', '2024-01-01', {
        includeEnd: false,
        includeStart: false,
      }),
    ).toBe(4)
  })

  it('handles large ranges', () => {
    expect(businessDays('2024-01-01', '2024-12-31')).toBe(262)
  })

  it('throws for invalid dates', () => {
    expect(() => businessDays('invalid', '2024-01-01')).toThrow('Invalid date provided')
    expect(() => businessDays('2024-01-01', '2024-01-07', { holidays: ['invalid'] })).toThrow(
      'Invalid holiday provided',
    )
  })

  it('skips duplicate holidays and holidays falling on weekends', () => {
    // 2024-01-06 is Saturday (weekend), 2024-01-05 counted once even if listed twice
    expect(
      businessDays('2024-01-01', '2024-01-07', {
        holidays: ['2024-01-05', '2024-01-05', '2024-01-06'],
      }),
    ).toBe(4)
  })

  it('returns unsigned positive for reversed range when signed is false', () => {
    // Test the branch at line 124: signed && isReversed ? -businessDaysCount : businessDaysCount
    // Need: signed=false, isReversed=true, AND holidays to hit line 124 (not line 98)
    expect(
      businessDays('2024-01-07', '2024-01-01', { signed: false, holidays: ['2024-01-03'] }),
    ).toBe(4)
  })
})

describe('businessDayShared helpers', () => {
  it('createHolidaySet builds set of day numbers', () => {
    const set = createHolidaySet(['2024-01-01', '2024-01-02'])
    expect(set.size).toBe(2)
  })

  it('createHolidaySet skips invalid holidays silently', () => {
    const set = createHolidaySet(['invalid-date'])
    expect(set.size).toBe(0)
  })

  it('isHolidayFromSet returns true for matching day', () => {
    const d = dayjs('2024-01-01')
    const set = createHolidaySet(['2024-01-01'])
    expect(isHolidayFromSet(d, set)).toBe(true)
  })

  it('isHolidayFromSet returns false for non-matching day', () => {
    const d = dayjs('2024-01-02')
    const set = createHolidaySet(['2024-01-01'])
    expect(isHolidayFromSet(d, set)).toBe(false)
  })
})
