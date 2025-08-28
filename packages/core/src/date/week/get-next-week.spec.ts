import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getNextWeek } from './get-next-week'

describe('getNextWeek', () => {
  it('默认使用当前日期 (weekStartDay = 0, 周日)', () => {
    const baseDate = dayjs('2025-08-28') // 周四
    const [firstDay, lastDay] = getNextWeek(baseDate)

    expect(firstDay.format('YYYY-MM-DD')).toBe('2025-08-31') // 下周日
    expect(lastDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-09-06 23:59:59') // 下周六
  })

  it('支持 weekStartDay = 1 (周一起始)', () => {
    const baseDate = dayjs('2025-08-28') // 周四
    const [firstDay, lastDay] = getNextWeek(baseDate, { weekStartDay: 1 })

    expect(firstDay.format('YYYY-MM-DD')).toBe('2025-09-01') // 下周一
    expect(lastDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-09-07 23:59:59') // 下周日
  })

  it('传入周日，weekStartDay = 0', () => {
    const baseDate = dayjs('2025-08-31') // 周日
    const [firstDay, lastDay] = getNextWeek(baseDate, { weekStartDay: 0 })

    expect(firstDay.format('YYYY-MM-DD')).toBe('2025-09-07') // 下周日
    expect(lastDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-09-13 23:59:59')
  })

  it('传入周一，weekStartDay = 1', () => {
    const baseDate = dayjs('2025-09-01') // 周一
    const [firstDay, lastDay] = getNextWeek(baseDate, { weekStartDay: 1 })

    expect(firstDay.format('YYYY-MM-DD')).toBe('2025-09-08') // 下周一
    expect(lastDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-09-14 23:59:59') // 下周日
  })
})
