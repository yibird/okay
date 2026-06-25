import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { currentQuarter } from './currentQuarter'

describe('currentQuarter', () => {
  it('should return the correct start and end of the current quarter', () => {
    const [start, end] = currentQuarter()
    const now = dayjs()
    const currentQuarterIndex = Math.floor(now.month() / 3)
    const startMonth = currentQuarterIndex * 3
    const endMonth = startMonth + 2

    const expectedStart = now.month(startMonth).startOf('month').format('YYYY-MM-DD')
    const expectedEnd = now.month(endMonth).endOf('month').format('YYYY-MM-DD')

    expect(start.format('YYYY-MM-DD')).toBe(expectedStart)
    expect(end.format('YYYY-MM-DD')).toBe(expectedEnd)
  })

  it('should return dayjs instances', () => {
    const [start, end] = currentQuarter()
    expect(dayjs.isDayjs(start)).toBe(true)
    expect(dayjs.isDayjs(end)).toBe(true)
  })
})
