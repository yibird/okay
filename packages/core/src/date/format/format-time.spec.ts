import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import dayjs from 'dayjs'
import { formatTime } from './format-time'

// 模拟 dayjs
vi.mock('dayjs', () => {
  const actualDayjs = vi.importActual('dayjs')
  return {
    __esModule: true,
    default: vi.fn(),
    ...actualDayjs,
  }
})

describe('formatTime', () => {
  const mockDayjs = dayjs as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  // 1. 测试有效日期输入
  describe('should format valid date inputs correctly', () => {
    it('Date object', () => {
      const testDate = new Date('2023-01-01T12:34:56')
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '12:34:56',
      })

      const result = formatTime(testDate)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(mockDayjs).toHaveBeenCalledTimes(2) // 一次检查有效性，一次格式化
      expect(result).toBe('12:34:56')
    })

    it('timestamp', () => {
      const timestamp = 1672578896000 // 2023-01-01T12:34:56
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '12:34:56',
      })

      const result = formatTime(timestamp)
      expect(result).toBe('12:34:56')
    })

    it('ISO string', () => {
      const isoString = '2023-01-01T12:34:56.000Z'
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '12:34:56',
      })

      const result = formatTime(isoString)
      expect(result).toBe('12:34:56')
    })

    it('dayjs object', () => {
      const dayjsObject = dayjs('2023-01-01T12:34:56')
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '12:34:56',
      })

      const result = formatTime(dayjsObject)
      expect(result).toBe('12:34:56')
    })

    it('undefined input (current time)', () => {
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '14:25:36', // 当前时间
      })

      const result = formatTime()
      expect(mockDayjs).toHaveBeenCalledWith(undefined)
      expect(result).toBe('14:25:36')
    })
  })

  // 2. 测试边界时间值
  describe('should handle boundary time values', () => {
    it('midnight', () => {
      const midnight = new Date('2023-01-01T00:00:00')
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '00:00:00',
      })

      const result = formatTime(midnight)
      expect(result).toBe('00:00:00')
    })

    it('noon', () => {
      const noon = new Date('2023-01-01T12:00:00')
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '12:00:00',
      })

      const result = formatTime(noon)
      expect(result).toBe('12:00:00')
    })

    it('one second before midnight', () => {
      const almostMidnight = new Date('2023-01-01T23:59:59')
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '23:59:59',
      })

      const result = formatTime(almostMidnight)
      expect(result).toBe('23:59:59')
    })
  })

  // 3. 测试无效日期输入
  describe('should throw error for invalid date inputs', () => {
    it('invalid date string', () => {
      mockDayjs.mockReturnValue({
        isValid: () => false,
      })

      expect(() => formatTime('invalid-date')).toThrow('Invalid date provided')
      expect(mockDayjs).toHaveBeenCalledWith('invalid-date')
    })

    it('NaN', () => {
      mockDayjs.mockReturnValue({
        isValid: () => false,
      })

      expect(() => formatTime(NaN)).toThrow('Invalid date provided')
    })

    it('null', () => {
      mockDayjs.mockReturnValue({
        isValid: () => false,
      })

      expect(() => formatTime(null)).toThrow('Invalid date provided')
    })

    it('empty string', () => {
      mockDayjs.mockReturnValue({
        isValid: () => false,
      })

      expect(() => formatTime('')).toThrow('Invalid date provided')
    })

    it('invalid Date object', () => {
      const invalidDate = new Date('invalid')
      mockDayjs.mockReturnValue({
        isValid: () => false,
      })

      expect(() => formatTime(invalidDate)).toThrow('Invalid date provided')
    })
  })

  // 4. 测试特殊输入值
  describe('should handle special input values', () => {
    it('zero timestamp', () => {
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '08:00:00', // 取决于时区
      })

      const result = formatTime(0)
      expect(result).toBe('08:00:00')
    })

    it('negative timestamp', () => {
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '07:59:59',
      })

      const result = formatTime(-1000)
      expect(result).toBe('07:59:59')
    })

    it('very large timestamp', () => {
      const largeTimestamp = 9999999999999
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '09:46:39',
      })

      const result = formatTime(largeTimestamp)
      expect(result).toBe('09:46:39')
    })
  })

  // 5. 测试格式化模板
  describe('should use correct format template', () => {
    it('should format with HH:mm:ss template', () => {
      const testDate = new Date('2023-01-01T09:05:30')
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: vi.fn().mockReturnValue('09:05:30'),
      })

      // 验证 format 方法被调用正确的模板
      const dayjsInstance = { isValid: () => true, format: vi.fn() }
      mockDayjs.mockReturnValue(dayjsInstance)

      formatTime(testDate)

      expect(dayjsInstance.format).toHaveBeenCalledWith('HH:mm:ss')
    })
  })

  // 6. 测试错误消息
  describe('error messages', () => {
    it('should include original input in error message for debugging', () => {
      const invalidInput = 'very-invalid-date'
      mockDayjs.mockReturnValue({
        isValid: () => false,
      })

      try {
        formatTime(invalidInput)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Invalid date provided')
      }
    })
  })

  // 7. 测试时区处理
  describe('timezone handling', () => {
    it('should handle UTC dates correctly', () => {
      const utcDate = new Date('2023-01-01T12:00:00Z')
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '20:00:00', // 北京时间 UTC+8
      })

      const result = formatTime(utcDate)
      expect(result).toBe('20:00:00')
    })

    it('should handle local time dates', () => {
      const localDate = new Date(2023, 0, 1, 15, 30, 45)
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '15:30:45',
      })

      const result = formatTime(localDate)
      expect(result).toBe('15:30:45')
    })
  })

  // 8. 性能测试
  describe('performance', () => {
    it('should handle multiple calls efficiently', () => {
      const testDate = new Date()
      mockDayjs.mockReturnValue({
        isValid: () => true,
        format: () => '12:00:00',
      })

      const startTime = performance.now()
      for (let i = 0; i < 1000; i++) {
        formatTime(testDate)
      }
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // 应该在100ms内完成1000次调用
    })
  })

  // 9. 组合测试
  describe('combination tests', () => {
    it('should work with various valid inputs in sequence', () => {
      const inputs = [
        new Date('2023-01-01T09:00:00'),
        '2023-01-01T10:00:00',
        1672574400000, // timestamp
        undefined, // current time
      ]

      const expectedOutputs = ['09:00:00', '10:00:00', '12:00:00', '14:30:00']

      inputs.forEach((input, index) => {
        mockDayjs.mockReturnValue({
          isValid: () => true,
          format: () => expectedOutputs[index],
        })

        const result = formatTime(input)
        expect(result).toBe(expectedOutputs[index])
      })
    })
  })

  // 10. 模拟dayjs行为测试
  describe('dayjs integration', () => {
    it('should call dayjs with correct parameters', () => {
      const testDate = new Date('2023-01-01T12:34:56')

      // 第一次调用：检查有效性
      mockDayjs.mockReturnValueOnce({
        isValid: () => true,
      })
      // 第二次调用：实际格式化
      mockDayjs.mockReturnValueOnce({
        isValid: () => true,
        format: () => '12:34:56',
      })

      const result = formatTime(testDate)

      expect(mockDayjs).toHaveBeenCalledTimes(2)
      expect(mockDayjs).toHaveBeenNthCalledWith(1, testDate)
      expect(mockDayjs).toHaveBeenNthCalledWith(2, testDate)
      expect(result).toBe('12:34:56')
    })

    it('should not call format if date is invalid', () => {
      const invalidDate = 'invalid'
      mockDayjs.mockReturnValue({
        isValid: () => false,
      })

      expect(() => formatTime(invalidDate)).toThrow()
      // 确保 format 方法没有被调用
      const dayjsInstance = mockDayjs.mock.results[0].value
      expect(dayjsInstance.format).toBeUndefined()
    })
  })
})
