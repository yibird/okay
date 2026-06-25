import dayjs from 'dayjs'
import { describe, expect, test, vi } from 'vitest'
import { today } from './today'

describe('today', () => {
  test('should return current day', () => {
    const currentDay = today()
    const expectedDay = dayjs()
    expect(currentDay.format('YYYY-MM-DD')).toBe(expectedDay.format('YYYY-MM-DD'))
  })

  test('should mock current day', () => {
    // Mock to 2023-06-15
    const mockDate = new Date(2023, 5, 15)
    vi.setSystemTime(mockDate)
    const currentDay = today()
    expect(currentDay.format('YYYY-MM-DD')).toBe('2023-06-15')
    vi.useRealTimers()
  })

  test('should return date with time 00:00:00', () => {
    const currentDay = today()
    expect(currentDay.hour()).toBe(0)
    expect(currentDay.minute()).toBe(0)
    expect(currentDay.second()).toBe(0)
  })
})
