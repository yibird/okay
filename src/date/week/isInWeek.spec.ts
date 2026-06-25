import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { isInWeek } from './isInWeek'
import { weekRange } from './weekRange'

const referenceWeek = '2023-06-15'

describe('isInWeek', () => {
  it('should return true for dates within the reference week', () => {
    expect(isInWeek('2023-06-12', referenceWeek)).toBe(true)
    expect(isInWeek('2023-06-15', referenceWeek)).toBe(true)
    expect(isInWeek('2023-06-18', referenceWeek)).toBe(true)
  })

  it('should return false for dates outside the reference week', () => {
    expect(isInWeek('2023-06-11', referenceWeek)).toBe(false)
    expect(isInWeek('2023-06-19', referenceWeek)).toBe(false)
  })

  it('should use current week when no reference date is provided', () => {
    const today = dayjs()
    const { startTime, endTime } = weekRange()

    expect(isInWeek(today)).toBe(true)
    expect(isInWeek(startTime)).toBe(true)
    expect(isInWeek(endTime)).toBe(true)
    expect(isInWeek(startTime.subtract(1, 'day'))).toBe(false)
    expect(isInWeek(endTime.add(1, 'day'))).toBe(false)
  })

  it('should handle different date formats', () => {
    expect(isInWeek(new Date('2023-06-15'), referenceWeek)).toBe(true)
    expect(isInWeek(dayjs('2023-06-16'), referenceWeek)).toBe(true)
    expect(isInWeek(1686960000000, referenceWeek)).toBe(true)
  })

  it('should return false for invalid dates', () => {
    expect(isInWeek('invalid-date', referenceWeek)).toBe(false)
    expect(isInWeek('', referenceWeek)).toBe(false)
    expect(isInWeek(null, referenceWeek)).toBe(false)
    expect(isInWeek(undefined, referenceWeek)).toBe(false)
  })
})
