import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { weekendsOfWeek } from './weekendsOfWeek'

describe('weekendsOfWeek', () => {
  it('should return default weekends [Sunday, Saturday] for a given date', () => {
    const date = '2023-11-08'
    const weekends = weekendsOfWeek(date)

    expect(weekends.length).toBe(2)
    expect(weekends.map((day) => day.day())).toEqual([0, 6])
    expect(weekends.map((day) => day.format('YYYY-MM-DD'))).toEqual(['2023-11-05', '2023-11-11'])
  })

  it('should handle custom weekends [Friday, Saturday]', () => {
    const date = '2023-11-08'
    const weekends = weekendsOfWeek(date, { weekends: [5, 6] })

    expect(weekends.map((day) => day.day())).toEqual([5, 6])
  })

  it('should keep weekend numbers semantic when week starts on Monday', () => {
    const date = '2023-11-08'
    const weekends = weekendsOfWeek(date, { weekStartDay: 1 })

    expect(weekends.map((day) => day.day())).toEqual([0, 6])
    expect(weekends.map((day) => day.format('YYYY-MM-DD'))).toEqual(['2023-11-12', '2023-11-11'])
  })

  it('should handle input as dayjs instance', () => {
    const date = dayjs('2023-11-08')
    const weekends = weekendsOfWeek(date)

    expect(weekends.map((day) => day.day())).toEqual([0, 6])
  })

  it('should handle timestamp input', () => {
    const timestamp = new Date('2023-11-08').getTime()
    const weekends = weekendsOfWeek(timestamp)

    expect(weekends.map((day) => day.day())).toEqual([0, 6])
  })

  it('should handle default current date if no date provided', () => {
    const weekends = weekendsOfWeek()

    expect(weekends.length).toBeGreaterThan(0)
    expect(weekends[0].startOf('day').format('HH:mm:ss')).toBe('00:00:00')
  })

  it('should return correct weekends across month boundary', () => {
    const date = '2023-10-31'
    const weekends = weekendsOfWeek(date)

    expect(weekends.map((day) => day.format('YYYY-MM-DD'))).toEqual(['2023-10-29', '2023-11-04'])
  })

  it('should return correct weekends across year boundary', () => {
    const date = '2022-12-31'
    const weekends = weekendsOfWeek(date)

    expect(weekends.map((day) => day.format('YYYY-MM-DD'))).toEqual(['2022-12-25', '2022-12-31'])
  })

  it('should throw for invalid weekend values', () => {
    expect(() => weekendsOfWeek('2023-11-08', { weekends: [-1] })).toThrow(
      'weekends must contain integers from 0 (Sunday) to 6 (Saturday)',
    )
  })
})
