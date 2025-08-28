import { describe, expect, test } from 'vitest'
import { getMonthName } from './get-month-name'

describe('getMonthName', () => {
  test('should return month name in English', () => {
    expect(getMonthName(1)).toBe('January')
    expect(getMonthName(12)).toBe('December')
  })

  test('should handle invalid month', () => {
    // Note: dayjs will wrap around invalid months
    expect(getMonthName(13)).toBe('January')
    expect(getMonthName(0)).toBe('December')
  })
})
