import dayjs from 'dayjs'
import { describe, expect, test, vi } from 'vitest'
import { getCurrentMonth } from './get-current-month'

describe('getCurrentMonth', () => {
  test('should return current month', () => {
    const currentMonth = dayjs().month() + 1
    expect(getCurrentMonth()).toBe(currentMonth)
  })

  test('should mock current month', () => {
    const mockDate = new Date(2023, 5, 1)
    vi.setSystemTime(mockDate)
    expect(getCurrentMonth()).toBe(6)
    vi.useRealTimers()
  })
})
