import { describe, expect, test } from 'vitest'
import { startOfYear } from './startOfYear'

describe('startOfYear', () => {
  test('should return first day of year', () => {
    const firstDay = startOfYear(2023)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(firstDay.hour()).toBe(0)
    expect(firstDay.minute()).toBe(0)
    expect(firstDay.second()).toBe(0)
  })

  test('should handle leap year', () => {
    const firstDay = startOfYear(2024)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2024-01-01')
  })
})
