import dayjs from 'dayjs'
import { describe, expect, test, vi } from 'vitest'
import { getCurrentYear } from './get-current-year'

describe('getCurrentYear', () => {
  test('should return current year', () => {
    const currentYear = dayjs().year()
    expect(getCurrentYear()).toBe(currentYear)
  })

  test('should mock current year', () => {
    const mockDate = new Date(2023, 0, 1)
    vi.setSystemTime(mockDate)
    expect(getCurrentYear()).toBe(2023)
    vi.useRealTimers()
  })
})
