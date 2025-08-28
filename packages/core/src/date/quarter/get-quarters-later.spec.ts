import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getQuartersLater } from './get-quarters-later'

describe('getQuartersLater', () => {
  it('should return correct start and end for 0 quarters later (current quarter)', () => {
    const date = '2023-02-15' // Q1
    const { startTime, endTime } = getQuartersLater(0, date)
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-03-31')
  })

  it('should return correct start and end for 1 quarter later', () => {
    const date = '2023-02-15' // Q1
    const { startTime, endTime } = getQuartersLater(1, date)
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-04-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-06-30')
  })

  it('should return correct start and end when crossing year boundary', () => {
    const date = '2023-11-10' // Q4
    const { startTime, endTime } = getQuartersLater(1, date) // Q1 of next year
    expect(startTime.format('YYYY-MM-DD')).toBe('2024-01-01')
    expect(endTime.format('YYYY-MM-DD')).toBe('2024-03-31')
  })

  it('should return correct for multiple quarters later across years', () => {
    const date = '2023-08-20' // Q3
    const { startTime, endTime } = getQuartersLater(5, date) // 5 quarters later
    expect(startTime.format('YYYY-MM-DD')).toBe('2024-10-01') // Q4 of next year
    expect(endTime.format('YYYY-MM-DD')).toBe('2024-12-31')
  })

  it('should use current date if date is not provided', () => {
    const { startTime, endTime } = getQuartersLater(0)
    const now = dayjs()
    const currentQuarter = Math.floor(now.month() / 3)
    const expectedStart = now.month(currentQuarter * 3).startOf('month')
    const expectedEnd = expectedStart.add(2, 'month').endOf('month')
    expect(startTime.format('YYYY-MM-DD')).toBe(
      expectedStart.format('YYYY-MM-DD'),
    )
    expect(endTime.format('YYYY-MM-DD')).toBe(expectedEnd.format('YYYY-MM-DD'))
  })

  it('should throw if n is negative', () => {
    expect(() => getQuartersLater(-1, '2023-01-01')).toThrow(
      'Number of quarters must be a positive integer',
    )
  })
})
