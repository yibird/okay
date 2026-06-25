import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { nextWeek } from './nextWeek'

describe('nextWeek', () => {
  it('should use Sunday start by default', () => {
    const [firstDay, lastDay] = nextWeek(dayjs('2025-08-28'))

    expect(firstDay.format('YYYY-MM-DD')).toBe('2025-08-31')
    expect(lastDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-09-06 23:59:59')
  })

  it('should support Monday start', () => {
    const [firstDay, lastDay] = nextWeek(dayjs('2025-08-28'), { weekStartDay: 1 })

    expect(firstDay.format('YYYY-MM-DD')).toBe('2025-09-01')
    expect(lastDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-09-07 23:59:59')
  })

  it('should handle Sunday input with Sunday start', () => {
    const [firstDay, lastDay] = nextWeek(dayjs('2025-08-31'), { weekStartDay: 0 })

    expect(firstDay.format('YYYY-MM-DD')).toBe('2025-09-07')
    expect(lastDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-09-13 23:59:59')
  })

  it('uses today when no date provided', () => {
    const today = dayjs()
    const [start, end] = nextWeek()
    expect(start.isAfter(today)).toBe(true)
    expect(end.isAfter(today)).toBe(true)
  })
})
