import { describe, expect, it } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('should format date strings as HH:mm:ss', () => {
    expect(formatTime('2023-01-01 12:34:56')).toBe('12:34:56')
  })

  it('should format Date objects as HH:mm:ss', () => {
    expect(formatTime(new Date(2023, 0, 1, 9, 5, 30))).toBe('09:05:30')
  })

  it('should format timestamps', () => {
    const timestamp = new Date(2023, 0, 1, 23, 59, 59).getTime()

    expect(formatTime(timestamp)).toBe('23:59:59')
  })

  it('should format the current time when input is omitted', () => {
    expect(formatTime()).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('should throw for invalid date inputs', () => {
    expect(() => formatTime('invalid-date')).toThrow('Invalid date provided')
    expect(() => formatTime(Number.NaN)).toThrow('Invalid date provided')
    expect(() => formatTime(null)).toThrow('Invalid date provided')
    expect(() => formatTime('')).toThrow('Invalid date provided')
  })

  it('should preserve boundary time values', () => {
    expect(formatTime(new Date(2023, 0, 1, 0, 0, 0))).toBe('00:00:00')
    expect(formatTime(new Date(2023, 0, 1, 12, 0, 0))).toBe('12:00:00')
    expect(formatTime(new Date(2023, 0, 1, 23, 59, 59))).toBe('23:59:59')
  })
})
