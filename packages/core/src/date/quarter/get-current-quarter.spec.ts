import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getCurrentQuarter } from './get-current-quarter'

describe('getCurrentQuarter', () => {
  it('should return the correct start and end of the current quarter', () => {
    const [start, end] = getCurrentQuarter()
    const now = dayjs()
    const currentQuarter = Math.floor(now.month() / 3)
    const startMonth = currentQuarter * 3
    const endMonth = startMonth + 2

    const expectedStart = now
      .month(startMonth)
      .startOf('month')
      .format('YYYY-MM-DD')
    const expectedEnd = now.month(endMonth).endOf('month').format('YYYY-MM-DD')

    expect(start.format('YYYY-MM-DD')).toBe(expectedStart)
    expect(end.format('YYYY-MM-DD')).toBe(expectedEnd)
  })

  it('should return dayjs instances', () => {
    const [start, end] = getCurrentQuarter()
    expect(dayjs.isDayjs(start)).toBe(true)
    expect(dayjs.isDayjs(end)).toBe(true)
  })
})
