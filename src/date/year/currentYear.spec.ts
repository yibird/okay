import dayjs from 'dayjs'
import { describe, expect, test, vi } from 'vitest'
import { currentYear } from './currentYear'

describe('currentYear', () => {
  test('should return current year', () => {
    const expectedYear = dayjs().year()
    expect(currentYear()).toBe(expectedYear)
  })

  test('should mock current year', () => {
    const mockDate = new Date(2023, 0, 1)
    vi.setSystemTime(mockDate)
    expect(currentYear()).toBe(2023)
    vi.useRealTimers()
  })
})
