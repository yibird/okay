import dayjs from 'dayjs'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { formatDate } from './format-date'

describe('formatDate', () => {
  // Mock the current date for consistent testing
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 5, 15)) // June 15, 2023
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should format Date object to YYYY-MM-DD', () => {
    const date = new Date(2023, 0, 1) // Jan 1, 2023
    expect(formatDate(date)).toBe('2023-01-01')
  })

  it('should format date string to YYYY-MM-DD', () => {
    expect(formatDate('2023-02-14')).toBe('2023-02-14')
    expect(formatDate('02/14/2023')).toBe('2023-02-14') // MM/DD/YYYY format
    expect(formatDate('2023-02-14T12:00:00Z')).toBe('2023-02-14') // ISO string
  })

  it('should format timestamp to YYYY-MM-DD', () => {
    const timestamp = new Date(2023, 3, 5).getTime() // Apr 5, 2023
    expect(formatDate(timestamp)).toBe('2023-04-05')
  })

  it('should format dayjs object to YYYY-MM-DD', () => {
    const date = dayjs('2023-05-10')
    expect(formatDate(date)).toBe('2023-05-10')
  })

  it('should return current date in YYYY-MM-DD when no argument provided', () => {
    expect(formatDate()).toBe('2023-06-15') // Matches mocked date
  })

  it('should handle leap year dates correctly', () => {
    expect(formatDate('2024-02-29')).toBe('2024-02-29')
  })

  it('should handle year boundaries correctly', () => {
    expect(formatDate('2022-12-31')).toBe('2022-12-31')
    expect(formatDate('2023-01-01')).toBe('2023-01-01')
  })

  it('should throw error for invalid date strings', () => {
    expect(() => formatDate('not-a-date')).toThrow()
  })

  it('should throw error for invalid objects', () => {
    expect(() => formatDate({} as any)).toThrow()
    expect(() => formatDate([] as any)).toThrow()
    expect(() => formatDate(null)).toThrow()
  })

  it('should handle undefined input by returning current date', () => {
    expect(formatDate(undefined)).toBe('2023-06-15') // Matches mocked date
    expect(() => formatDate(undefined)).not.toThrow()
  })

  it('should maintain consistent output format for different valid inputs', () => {
    const date1 = new Date(2023, 7, 20) // Aug 20, 2023
    const date2 = '2023-08-20'
    const date3 = 1692489600000 // timestamp for Aug 20, 2023
    const date4 = dayjs('2023-08-20')

    expect(formatDate(date1)).toBe('2023-08-20')
    expect(formatDate(date2)).toBe('2023-08-20')
    expect(formatDate(date3)).toBe('2023-08-20')
    expect(formatDate(date4)).toBe('2023-08-20')
  })
})
