import dayjs from 'dayjs'
import { describe, expect, test, vi } from 'vitest'
import { currentMonth } from './currentMonth'

describe('currentMonth', () => {
  test('should return current month', () => {
    const expectedMonth = dayjs().month() + 1
    expect(currentMonth()).toBe(expectedMonth)
  })

  test('should mock current month', () => {
    const mockDate = new Date(2023, 5, 1)
    vi.setSystemTime(mockDate)
    expect(currentMonth()).toBe(6)
    vi.useRealTimers()
  })
})
