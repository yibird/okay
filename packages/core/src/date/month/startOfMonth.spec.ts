import { describe, expect, test } from 'vitest'
import { startOfMonth } from './startOfMonth'

describe('startOfMonth', () => {
  test('should return first day of month', () => {
    const firstDay = startOfMonth(2023, 1)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(firstDay.hour()).toBe(0)
    expect(firstDay.minute()).toBe(0)
    expect(firstDay.second()).toBe(0)
  })

  test('should handle different months', () => {
    const firstDay = startOfMonth(2023, 12)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2023-12-01')
  })

  test('should reject invalid month values instead of rolling over', () => {
    expect(() => startOfMonth(2023, 0)).toThrow('month must be between 1 and 12')
    expect(() => startOfMonth(2023, 13)).toThrow('month must be between 1 and 12')
  })

  test('should reject invalid year values', () => {
    expect(() => startOfMonth(2023.5, 1)).toThrow('year must be an integer')
  })
})
