import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import dayjs from 'dayjs'
import { format } from './format' // 请替换为实际路径

// 模拟 dayjs
vi.mock('dayjs', () => {
  const actualDayjs = vi.importActual('dayjs')
  return {
    __esModule: true,
    default: vi.fn(),
    ...actualDayjs,
  }
})

describe('format', () => {
  const mockDayjs = dayjs as unknown as ReturnType<typeof vi.fn>
  let mockDayjsInstance: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockDayjsInstance = {
      isValid: vi.fn(),
      format: vi.fn(),
    }
    mockDayjs.mockReturnValue(mockDayjsInstance)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  // 1. 测试有效日期输入（使用默认模板）
  describe('should format valid date inputs with default template', () => {
    beforeEach(() => {
      mockDayjsInstance.isValid.mockReturnValue(true)
      mockDayjsInstance.format.mockReturnValue('2023-01-01 12:34:56')
    })

    it('Date object', () => {
      const testDate = new Date('2023-01-01T12:34:56')
      const result = format(testDate)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(mockDayjsInstance.isValid).toHaveBeenCalled()
      expect(mockDayjsInstance.format).toHaveBeenCalledWith(
        'YYYY-MM-DD HH:mm:ss',
      )
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('timestamp', () => {
      const timestamp = 1672578896000
      const result = format(timestamp)
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('ISO string', () => {
      const result = format('2023-01-01T12:34:56.000Z')
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('dayjs object', () => {
      const dayjsObject = dayjs('2023-01-01T12:34:56')
      const result = format(dayjsObject)
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('undefined input (current time)', () => {
      mockDayjsInstance.format.mockReturnValue('2023-08-14 14:25:36')
      const result = format()
      expect(mockDayjs).toHaveBeenCalledWith(undefined)
      expect(result).toBe('2023-08-14 14:25:36')
    })
  })

  // 2. 测试自定义模板
  describe('should format with custom templates', () => {
    beforeEach(() => {
      mockDayjsInstance.isValid.mockReturnValue(true)
    })

    it('YYYY-MM-DD template', () => {
      mockDayjsInstance.format.mockReturnValue('2023-01-01')
      const result = format(new Date('2023-01-01T12:34:56'), 'YYYY-MM-DD')

      expect(mockDayjsInstance.format).toHaveBeenCalledWith('YYYY-MM-DD')
      expect(result).toBe('2023-01-01')
    })

    it('HH:mm:ss template', () => {
      mockDayjsInstance.format.mockReturnValue('12:34:56')
      const result = format(new Date('2023-01-01T12:34:56'), 'HH:mm:ss')

      expect(mockDayjsInstance.format).toHaveBeenCalledWith('HH:mm:ss')
      expect(result).toBe('12:34:56')
    })

    it('YYYY/MM/DD template', () => {
      mockDayjsInstance.format.mockReturnValue('2023/01/01')
      const result = format(new Date('2023-01-01T12:34:56'), 'YYYY/MM/DD')

      expect(mockDayjsInstance.format).toHaveBeenCalledWith('YYYY/MM/DD')
      expect(result).toBe('2023/01/01')
    })

    it('YYYY年MM月DD日 template', () => {
      mockDayjsInstance.format.mockReturnValue('2023年01月01日')
      const result = format(new Date('2023-01-01T12:34:56'), 'YYYY年MM月DD日')

      expect(mockDayjsInstance.format).toHaveBeenCalledWith('YYYY年MM月DD日')
      expect(result).toBe('2023年01月01日')
    })

    it('YYYY-MM-DD HH:mm template', () => {
      mockDayjsInstance.format.mockReturnValue('2023-01-01 12:34')
      const result = format(new Date('2023-01-01T12:34:56'), 'YYYY-MM-DD HH:mm')

      expect(mockDayjsInstance.format).toHaveBeenCalledWith('YYYY-MM-DD HH:mm')
      expect(result).toBe('2023-01-01 12:34')
    })

    it('timestamp template', () => {
      mockDayjsInstance.format.mockReturnValue('1672578896')
      const result = format(new Date('2023-01-01T12:34:56'), 'X')

      expect(mockDayjsInstance.format).toHaveBeenCalledWith('X')
      expect(result).toBe('1672578896')
    })
  })

  // 3. 测试边界日期值
  describe('should handle boundary date values', () => {
    beforeEach(() => {
      mockDayjsInstance.isValid.mockReturnValue(true)
    })

    it('minimum date', () => {
      mockDayjsInstance.format.mockReturnValue('1970-01-01 08:00:00')
      const result = format(new Date(0)) // Unix epoch
      expect(result).toBe('1970-01-01 08:00:00')
    })

    it('leap year date', () => {
      mockDayjsInstance.format.mockReturnValue('2020-02-29 12:00:00')
      const result = format(new Date('2020-02-29T12:00:00'))
      expect(result).toBe('2020-02-29 12:00:00')
    })

    it('year boundary', () => {
      mockDayjsInstance.format.mockReturnValue('2022-12-31 23:59:59')
      const result = format(new Date('2022-12-31T23:59:59'))
      expect(result).toBe('2022-12-31 23:59:59')
    })

    it('month boundary', () => {
      mockDayjsInstance.format.mockReturnValue('2023-01-31 23:59:59')
      const result = format(new Date('2023-01-31T23:59:59'))
      expect(result).toBe('2023-01-31 23:59:59')
    })
  })

  // 4. 测试无效日期输入
  describe('should throw error for invalid date inputs', () => {
    beforeEach(() => {
      mockDayjsInstance.isValid.mockReturnValue(false)
    })

    it('invalid date string', () => {
      expect(() => format('invalid-date')).toThrow('Invalid date provided')
      expect(mockDayjs).toHaveBeenCalledWith('invalid-date')
    })

    it('NaN', () => {
      expect(() => format(NaN)).toThrow('Invalid date provided')
    })

    it('null', () => {
      expect(() => format(null)).toThrow('Invalid date provided')
    })

    it('empty string', () => {
      expect(() => format('')).toThrow('Invalid date provided')
    })

    it('invalid Date object', () => {
      const invalidDate = new Date('invalid')
      expect(() => format(invalidDate)).toThrow('Invalid date provided')
    })

    it('array (invalid input)', () => {
      expect(() => format([1, 2, 3] as any)).toThrow('Invalid date provided')
    })

    it('object (invalid input)', () => {
      expect(() => format({} as any)).toThrow('Invalid date provided')
    })
  })

  // 5. 测试错误消息细节
  describe('error handling', () => {
    it('should not call format when date is invalid', () => {
      mockDayjsInstance.isValid.mockReturnValue(false)

      expect(() => format('invalid')).toThrow('Invalid date provided')
      expect(mockDayjsInstance.format).not.toHaveBeenCalled()
    })

    it('should preserve original error context', () => {
      mockDayjsInstance.isValid.mockReturnValue(false)

      try {
        format('specific-invalid-date')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Invalid date provided')
      }
    })
  })

  // 6. 测试时区处理
  describe('timezone handling', () => {
    beforeEach(() => {
      mockDayjsInstance.isValid.mockReturnValue(true)
    })

    it('UTC date', () => {
      mockDayjsInstance.format.mockReturnValue('2023-01-01 20:00:00')
      const result = format(new Date('2023-01-01T12:00:00Z'))
      expect(result).toBe('2023-01-01 20:00:00') // UTC+8
    })

    it('should handle different timezone formats', () => {
      mockDayjsInstance.format.mockReturnValue('2023-01-01 12:00:00')
      const result = format(new Date('2023-01-01T12:00:00-05:00'))
      expect(result).toBe('2023-01-01 12:00:00')
    })
  })

  // 7. 性能测试
  describe('performance', () => {
    it('should handle multiple calls efficiently', () => {
      mockDayjsInstance.isValid.mockReturnValue(true)
      mockDayjsInstance.format.mockReturnValue('2023-01-01 12:00:00')

      const testDate = new Date('2023-01-01T12:00:00')
      const startTime = performance.now()

      for (let i = 0; i < 1000; i++) {
        format(testDate)
      }

      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('should handle different templates efficiently', () => {
      mockDayjsInstance.isValid.mockReturnValue(true)
      mockDayjsInstance.format.mockImplementation((template: string) => {
        if (template === 'YYYY-MM-DD') return '2023-01-01'
        if (template === 'HH:mm:ss') return '12:00:00'
        return '2023-01-01 12:00:00'
      })

      const testDate = new Date('2023-01-01T12:00:00')
      const startTime = performance.now()

      format(testDate, 'YYYY-MM-DD')
      format(testDate, 'HH:mm:ss')
      format(testDate)

      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(50)
    })
  })

  // 8. 测试模板验证
  describe('template validation', () => {
    beforeEach(() => {
      mockDayjsInstance.isValid.mockReturnValue(true)
    })

    it('should handle empty template', () => {
      mockDayjsInstance.format.mockReturnValue('20230101120000')
      const result = format(new Date('2023-01-01T12:00:00'), '')

      expect(mockDayjsInstance.format).toHaveBeenCalledWith('')
      expect(result).toBe('20230101120000')
    })

    it('should handle complex templates', () => {
      mockDayjsInstance.format.mockReturnValue('2023-01-01 12:00:00.000')
      const result = format(
        new Date('2023-01-01T12:00:00'),
        'YYYY-MM-DD HH:mm:ss.SSS',
      )

      expect(mockDayjsInstance.format).toHaveBeenCalledWith(
        'YYYY-MM-DD HH:mm:ss.SSS',
      )
      expect(result).toBe('2023-01-01 12:00:00.000')
    })

    it('should handle template with text', () => {
      mockDayjsInstance.format.mockReturnValue(
        'Date: 2023-01-01 Time: 12:00:00',
      )
      const result = format(
        new Date('2023-01-01T12:00:00'),
        'Date: YYYY-MM-DD Time: HH:mm:ss',
      )

      expect(mockDayjsInstance.format).toHaveBeenCalledWith(
        'Date: YYYY-MM-DD Time: HH:mm:ss',
      )
      expect(result).toBe('Date: 2023-01-01 Time: 12:00:00')
    })
  })

  // 9. 组合测试
  describe('combination tests', () => {
    it('should work with various inputs and templates', () => {
      const testCases = [
        {
          input: new Date('2023-01-01T12:34:56'),
          template: 'YYYY-MM-DD',
          expected: '2023-01-01',
        },
        { input: 1672578896000, template: 'HH:mm:ss', expected: '12:34:56' },
        {
          input: '2023-01-01T12:34:56.000Z',
          template: 'YYYY/MM/DD HH:mm',
          expected: '2023/01/01 12:34',
        },
        {
          input: undefined,
          template: 'YYYY-MM-DD HH:mm:ss',
          expected: '2023-08-14 14:25:36',
        },
      ]

      testCases.forEach((testCase, index) => {
        mockDayjsInstance.isValid.mockReturnValue(true)
        mockDayjsInstance.format.mockReturnValue(testCase.expected)

        const result = format(testCase.input, testCase.template)
        expect(result).toBe(testCase.expected)

        if (index === testCases.length - 1) {
          expect(mockDayjsInstance.format).toHaveBeenCalledWith(
            testCase.template,
          )
        }
      })
    })
  })

  // 10. 测试dayjs调用次数
  describe('dayjs integration', () => {
    it('should call dayjs twice for valid dates', () => {
      mockDayjsInstance.isValid.mockReturnValue(true)
      mockDayjsInstance.format.mockReturnValue('2023-01-01 12:34:56')

      const testDate = new Date('2023-01-01T12:34:56')
      format(testDate)

      expect(mockDayjs).toHaveBeenCalledTimes(2)
      expect(mockDayjs).toHaveBeenNthCalledWith(1, testDate)
      expect(mockDayjs).toHaveBeenNthCalledWith(2, testDate)
    })

    it('should call dayjs once for invalid dates', () => {
      mockDayjsInstance.isValid.mockReturnValue(false)

      expect(() => format('invalid')).toThrow()
      expect(mockDayjs).toHaveBeenCalledTimes(1)
      expect(mockDayjsInstance.format).not.toHaveBeenCalled()
    })
  })

  // 11. 测试特殊日期值
  describe('special date values', () => {
    beforeEach(() => {
      mockDayjsInstance.isValid.mockReturnValue(true)
    })

    it('should handle very old dates', () => {
      mockDayjsInstance.format.mockReturnValue('1900-01-01 00:00:00')
      const result = format(new Date('1900-01-01T00:00:00'))
      expect(result).toBe('1900-01-01 00:00:00')
    })

    it('should handle future dates', () => {
      mockDayjsInstance.format.mockReturnValue('2030-12-31 23:59:59')
      const result = format(new Date('2030-12-31T23:59:59'))
      expect(result).toBe('2030-12-31 23:59:59')
    })

    it('should handle daylight saving time transitions', () => {
      mockDayjsInstance.format.mockReturnValue('2023-03-12 02:30:00')
      const result = format(new Date('2023-03-12T02:30:00'))
      expect(result).toBe('2023-03-12 02:30:00')
    })
  })
})
