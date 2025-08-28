import dayjs from 'dayjs'
import { describe, expect, test, vi } from 'vitest'
import { getCurrentDay } from './get-current-day'

describe('getCurrentDay', () => {
  test('should return current day', () => {
    const currentDay = getCurrentDay()
    const today = dayjs()
    expect(currentDay.format('YYYY-MM-DD')).toBe(today.format('YYYY-MM-DD'))
  })

  test('should mock current day', () => {
    // Mock to 2023-06-15
    const mockDate = new Date(2023, 5, 15)
    vi.setSystemTime(mockDate)
    const currentDay = getCurrentDay()
    expect(currentDay.format('YYYY-MM-DD')).toBe('2023-06-15')
    vi.useRealTimers()
  })

  test('should return date with time 00:00:00', () => {
    const currentDay = getCurrentDay()
    expect(currentDay.hour()).toBe(0)
    expect(currentDay.minute()).toBe(0)
    expect(currentDay.second()).toBe(0)
  })
})
