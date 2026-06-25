import { describe, expect, it } from 'vitest'
import { startOfWeek } from './startOfWeek'

describe('startOfWeek', () => {
  it('should return Sunday start by default', () => {
    expect(startOfWeek('2023-06-15').format('YYYY-MM-DD HH:mm:ss')).toBe('2023-06-11 00:00:00')
  })

  it('should support Monday start', () => {
    expect(startOfWeek('2023-06-15', { weekStartDay: 1 }).format('YYYY-MM-DD HH:mm:ss')).toBe(
      '2023-06-12 00:00:00',
    )
  })

  it('should handle the first day of week', () => {
    expect(startOfWeek('2023-06-11').format('YYYY-MM-DD')).toBe('2023-06-11')
    expect(startOfWeek('2023-06-12', { weekStartDay: 1 }).format('YYYY-MM-DD')).toBe('2023-06-12')
  })

  it('should wrap backwards when current day is before week start day', () => {
    expect(startOfWeek('2023-06-11', { weekStartDay: 6 }).format('YYYY-MM-DD')).toBe('2023-06-10')
  })

  it('should reject invalid weekStartDay', () => {
    expect(() => startOfWeek('2023-06-15', { weekStartDay: -1 })).toThrow(
      'weekStartDay must be between 0 (Sunday) and 6 (Saturday)',
    )
    expect(() => startOfWeek('2023-06-15', { weekStartDay: 7 })).toThrow(
      'weekStartDay must be between 0 (Sunday) and 6 (Saturday)',
    )
  })

  it('should reject invalid dates', () => {
    expect(() => startOfWeek('invalid-date')).toThrow('Invalid date provided')
  })
})
