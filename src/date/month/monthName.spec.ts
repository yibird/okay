import { describe, expect, test } from 'vitest'
import { monthName } from './monthName'

describe('monthName', () => {
  test('should return month name in English', () => {
    expect(monthName(1)).toBe('January')
    expect(monthName(12)).toBe('December')
  })

  test('should handle invalid month', () => {
    expect(() => monthName(13)).toThrow('month must be between 1 and 12')
    expect(() => monthName(0)).toThrow('month must be between 1 and 12')
  })
})
