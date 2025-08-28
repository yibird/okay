import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getQuartersAgo } from './get-quarters-ago'

describe('getQuartersAgo', () => {
  it('should return current quarter when n=0', () => {
    const date = '2023-05-15'
    const { startTime, endTime } = getQuartersAgo(0, date)

    expect(startTime.format('YYYY-MM-DD')).toBe('2023-04-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-06-30')
  })

  it('should return correct quarter for positive n within same year', () => {
    const date = '2023-11-15'
    const { startTime, endTime } = getQuartersAgo(2, date)

    expect(startTime.format('YYYY-MM-DD')).toBe('2023-04-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-06-30')
  })

  it('should handle crossing into previous year', () => {
    const date = '2023-02-15'
    const { startTime, endTime } = getQuartersAgo(3, date)

    expect(startTime.format('YYYY-MM-DD')).toBe('2022-04-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2022-06-30')
  })

  it('should handle multiple year crossings', () => {
    const date = '2023-05-15'
    const { startTime, endTime } = getQuartersAgo(10, date)

    expect(startTime.format('YYYY-MM-DD')).toBe('2020-10-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2020-12-31')
  })

  it('should throw error for negative n values', () => {
    const date = '2023-05-15'
    expect(() => getQuartersAgo(-1, date)).toThrow(
      'Number of quarters must be a positive integer',
    )
  })

  it('should work with Date objects as input', () => {
    const date = new Date('2023-07-01')
    const { startTime, endTime } = getQuartersAgo(1, date)

    expect(startTime.format('YYYY-MM-DD')).toBe('2023-04-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-06-30')
  })

  it('should work with timestamps as input', () => {
    const timestamp = new Date('2023-01-15').getTime()
    const { startTime, endTime } = getQuartersAgo(1, timestamp)

    expect(startTime.format('YYYY-MM-DD')).toBe('2022-10-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2022-12-31')
  })

  it('should use current date when no date is provided', () => {
    const now = dayjs()
    const currentQuarter = Math.floor(now.month() / 3)
    const { startTime } = getQuartersAgo(0)

    expect(startTime.month()).toBe(currentQuarter * 3)
  })

  it('should handle leap years correctly', () => {
    const date = '2024-02-29' // Leap day
    const { startTime, endTime } = getQuartersAgo(1, date)

    expect(startTime.format('YYYY-MM-DD')).toBe('2023-10-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-12-31')
  })

  it('should handle quarter boundary dates', () => {
    // Q1 boundary
    const q1Boundary = getQuartersAgo(1, '2023-04-01')
    expect(q1Boundary.startTime.format('YYYY-MM-DD')).toBe('2023-01-01')

    // Year boundary
    const yearBoundary = getQuartersAgo(1, '2023-01-15')
    expect(yearBoundary.startTime.format('YYYY-MM-DD')).toBe('2022-10-01')
  })

  it('should handle large values of n correctly', () => {
    const date = '2023-08-15'
    const { startTime, endTime } = getQuartersAgo(25, date)

    expect(startTime.format('YYYY-MM-DD')).toBe('2017-04-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2017-06-30')
  })
})
