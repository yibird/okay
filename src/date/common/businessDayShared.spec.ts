import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import { isHoliday } from './businessDayShared'

describe('businessDayShared', () => {
  describe('isHoliday', () => {
    it('returns false for empty holidays array', () => {
      const date = dayjs('2024-01-01')
      expect(isHoliday(date, [])).toBe(false)
    })

    it('returns true when date matches holiday', () => {
      const date = dayjs('2024-01-01')
      expect(isHoliday(date, ['2024-01-01'])).toBe(true)
    })

    it('returns false when date does not match', () => {
      const date = dayjs('2024-01-01')
      expect(isHoliday(date, ['2024-01-02'])).toBe(false)
    })

    it('handles invalid holiday gracefully', () => {
      const date = dayjs('2024-01-01')
      expect(isHoliday(date, ['invalid'])).toBe(false)
    })
  })
})
