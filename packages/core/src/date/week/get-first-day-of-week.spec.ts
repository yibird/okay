import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getDayOfWeek } from './get-day-of-week'

describe('getDayOfWeek - basics', () => {
  it('returns undefined for invalid date', () => {
    expect(getDayOfWeek('invalid-date')).toBeUndefined()
  })

  it('defaults to today when date is omitted', () => {
    // 只断言不为 undefined，避免和当天星期绑定导致不稳定
    expect(getDayOfWeek()).toBeTypeOf('string')
  })
})

describe('getDayOfWeek - mapping correctness', () => {
  // 选择一个已知是周日的日期：2023-11-05 Sunday
  const base = dayjs('2023-11-05') // Sunday

  const cases: Array<{
    offset: number
    enFull: string
    enShort: string
    zhFull: string
    zhShort: string
  }> = [
    {
      offset: 0,
      enFull: 'Sunday',
      enShort: 'Sun',
      zhFull: '星期日',
      zhShort: '周日',
    },
    {
      offset: 1,
      enFull: 'Monday',
      enShort: 'Mon',
      zhFull: '星期一',
      zhShort: '周一',
    },
    {
      offset: 2,
      enFull: 'Tuesday',
      enShort: 'Tue',
      zhFull: '星期二',
      zhShort: '周二',
    },
    {
      offset: 3,
      enFull: 'Wednesday',
      enShort: 'Wed',
      zhFull: '星期三',
      zhShort: '周三',
    },
    {
      offset: 4,
      enFull: 'Thursday',
      enShort: 'Thu',
      zhFull: '星期四',
      zhShort: '周四',
    },
    {
      offset: 5,
      enFull: 'Friday',
      enShort: 'Fri',
      zhFull: '星期五',
      zhShort: '周五',
    },
    {
      offset: 6,
      enFull: 'Saturday',
      enShort: 'Sat',
      zhFull: '星期六',
      zhShort: '周六',
    },
  ]

  for (const c of cases) {
    const d = base.add(c.offset, 'day').format('YYYY-MM-DD')
    it(`EN full/short on ${d}`, () => {
      expect(getDayOfWeek(d, 'en', 'full')).toBe(c.enFull)
      expect(getDayOfWeek(d, 'en', 'short')).toBe(c.enShort)
    })
    it(`ZH full/short on ${d}`, () => {
      expect(getDayOfWeek(d, 'zh', 'full')).toBe(c.zhFull)
      expect(getDayOfWeek(d, 'zh', 'short')).toBe(c.zhShort)
    })
  }
})

describe('getDayOfWeek - edge dates', () => {
  it('Epoch day 1970-01-01 is Thursday', () => {
    expect(getDayOfWeek('1970-01-01', 'en', 'full')).toBe('Thursday')
    expect(getDayOfWeek('1970-01-01', 'zh', 'short')).toBe('周四')
  })

  it('Leap day 2024-02-29 is Thursday', () => {
    expect(getDayOfWeek('2024-02-29', 'en', 'short')).toBe('Thu')
    expect(getDayOfWeek('2024-02-29', 'zh', 'full')).toBe('星期四')
  })

  it('Far future 2099-12-31 is Thursday', () => {
    expect(getDayOfWeek('2099-12-31', 'zh', 'short')).toBe('周四')
  })
})
