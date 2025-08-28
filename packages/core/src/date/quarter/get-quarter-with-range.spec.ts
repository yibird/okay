import { describe, expect, it } from 'vitest'
import { getQuarterWithRange } from './get-quarter-with-range'

describe('getQuarterWithRange', () => {
  // 测试季度范围
  it('should return correct quarter range', () => {
    const result = getQuarterWithRange('2023-05-15')
    expect(result.quarter).toBe(2)
    expect(result.startTime.format('YYYY-MM-DD')).toBe('2023-04-01')
    expect(result.endTime.format('YYYY-MM-DD')).toBe('2023-06-30')
  })

  // 时间边界测试
  it('should have correct time boundaries', () => {
    const { startTime, endTime } = getQuarterWithRange('2023-11-20')
    expect(startTime.format('HH:mm:ss.SSS')).toBe('00:00:00.000')
    expect(endTime.format('HH:mm:ss.SSS')).toBe('23:59:59.999')
  })

  // 跨年测试
  it('should handle year transition', () => {
    const result = getQuarterWithRange('2022-12-31')
    expect(result.quarter).toBe(4)
    expect(result.year).toBe(2022)
  })

  // toString测试
  it('should provide string representation', () => {
    const result = getQuarterWithRange('2023-08-01')
    expect(result.toString()).toBe('Q3-2023')
  })
})
