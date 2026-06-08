import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDateTime } from './formatDateTime'

describe('formatDateTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 4, 15, 14, 30, 45)) // May 15, 2023 14:30:45
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Valid date tests
  it('should format current date when no input provided', () => {
    const result = formatDateTime()
    expect(result).toBe('2023-05-15 14:30:45')
  })

  it('should format Date object correctly', () => {
    const date = new Date(2023, 0, 1, 12, 0, 0)
    const result = formatDateTime(date)
    expect(result).toBe('2023-01-01 12:00:00')
  })

  it('should format timestamp correctly', () => {
    const timestamp = new Date(2023, 11, 31, 23, 59, 59).getTime()
    const result = formatDateTime(timestamp)
    expect(result).toBe('2023-12-31 23:59:59')
  })

  it('should format dayjs object correctly', () => {
    const date = dayjs('2023-02-28 08:15:20')
    const result = formatDateTime(date)
    expect(result).toBe('2023-02-28 08:15:20')
  })

  // Invalid date tests
  it('should throw error for invalid date string', () => {
    expect(() => formatDateTime('invalid-date')).toThrow('Invalid date provided')
  })

  it('should throw error for NaN timestamp', () => {
    expect(() => formatDateTime(Number.NaN)).toThrow('Invalid date provided')
  })

  it('should throw error for array when explicitly passed', () => {
    expect(() => formatDateTime([] as any)).toThrow('Invalid date provided')
  })

  it('should throw error for null value', () => {
    expect(() => formatDateTime(null)).toThrow('Invalid date provided')
  })

  it('should throw error for empty string', () => {
    expect(() => formatDateTime('')).toThrow('Invalid date provided')
  })

  it('should throw error for invalid Date object', () => {
    expect(() => formatDateTime(new Date('invalid'))).toThrow('Invalid date provided')
  })

  // Format validation
  it('should maintain consistent format for all valid inputs', () => {
    const testCases = [
      { input: new Date(2023, 0, 1), expected: '2023-01-01 00:00:00' },
      { input: '2023-01-01', expected: '2023-01-01 00:00:00' },
      { input: '2023-01-01 00:00:00', expected: '2023-01-01 00:00:00' },
      { input: 1672502400000, expected: '2023-01-01 00:00:00' },
      { input: dayjs('2023-01-01'), expected: '2023-01-01 00:00:00' },
    ]

    testCases.forEach(({ input, expected }) => {
      expect(formatDateTime(input)).toBe(expected)
    })
  })
})
