import { describe, it, expect } from 'vitest'
import { isNaNOrFinite } from './is-nan-or-finite' // 请替换为实际路径

describe('isNaNOrFinite', () => {
  // 1. 测试 NaN 值（应该返回 true）
  describe('should return true for NaN values', () => {
    it('literal NaN', () => {
      expect(isNaNOrFinite(NaN)).toBe(true)
      expect(isNaNOrFinite(Number.NaN)).toBe(true)
    })

    it('mathematical operations producing NaN', () => {
      expect(isNaNOrFinite(0 / 0)).toBe(true)
      expect(isNaNOrFinite(Number('abc'))).toBe(true)
      expect(isNaNOrFinite(Math.sqrt(-1))).toBe(true)
      expect(isNaNOrFinite(Math.log(-1))).toBe(true)
    })

    it('NaN from parse methods', () => {
      expect(isNaNOrFinite(parseInt('abc'))).toBe(true)
      expect(isNaNOrFinite(parseFloat('xyz'))).toBe(true)
    })

    it('invalid mathematical operations', () => {
      // oxlint-disable-next-line erasing-op
      expect(isNaNOrFinite(0 * Infinity)).toBe(true)
      expect(isNaNOrFinite(Infinity / Infinity)).toBe(true)
      expect(isNaNOrFinite(Infinity - Infinity)).toBe(true)
    })
  })

  // 2. 测试有限数字值（应该返回 true）
  describe('should return true for finite numbers', () => {
    it('positive integers', () => {
      expect(isNaNOrFinite(0)).toBe(true)
      expect(isNaNOrFinite(1)).toBe(true)
      expect(isNaNOrFinite(42)).toBe(true)
      expect(isNaNOrFinite(999999)).toBe(true)
    })

    it('negative integers', () => {
      expect(isNaNOrFinite(-1)).toBe(true)
      expect(isNaNOrFinite(-42)).toBe(true)
      expect(isNaNOrFinite(-999999)).toBe(true)
    })

    it('positive floats', () => {
      expect(isNaNOrFinite(0.1)).toBe(true)
      expect(isNaNOrFinite(3.14)).toBe(true)
      expect(isNaNOrFinite(123.456)).toBe(true)
    })

    it('negative floats', () => {
      expect(isNaNOrFinite(-0.1)).toBe(true)
      expect(isNaNOrFinite(-3.14)).toBe(true)
      expect(isNaNOrFinite(-123.456)).toBe(true)
    })

    it('Number constants', () => {
      expect(isNaNOrFinite(Number.MAX_VALUE)).toBe(true)
      expect(isNaNOrFinite(Number.MIN_VALUE)).toBe(true)
      expect(isNaNOrFinite(Number.EPSILON)).toBe(true)
    })

    it('boundary values', () => {
      expect(isNaNOrFinite(Number.MAX_SAFE_INTEGER)).toBe(true)
      expect(isNaNOrFinite(Number.MIN_SAFE_INTEGER)).toBe(true)
    })

    it('hex and binary numbers', () => {
      expect(isNaNOrFinite(0xff)).toBe(true)
      expect(isNaNOrFinite(0b1010)).toBe(true)
      expect(isNaNOrFinite(0o777)).toBe(true)
    })

    it('scientific notation', () => {
      expect(isNaNOrFinite(1e3)).toBe(true)
      expect(isNaNOrFinite(1e-3)).toBe(true)
    })

    it('very small and large numbers', () => {
      // oxlint-disable-next-line no-loss-of-precision
      expect(isNaNOrFinite(5e-324)).toBe(true)
      expect(isNaNOrFinite(1.7976931348623157e308)).toBe(true)
    })

    it('zero values', () => {
      expect(isNaNOrFinite(0)).toBe(true)
      expect(isNaNOrFinite(-0)).toBe(true)
    })

    it('numeric separators', () => {
      expect(isNaNOrFinite(1_000_000)).toBe(true)
      expect(isNaNOrFinite(0.000_001)).toBe(true)
    })
  })

  // 3. 测试 Infinity 值（应该返回 false）
  describe('should return false for Infinity values', () => {
    it('positive infinity', () => {
      expect(isNaNOrFinite(Infinity)).toBe(false)
      expect(isNaNOrFinite(Number.POSITIVE_INFINITY)).toBe(false)
      expect(isNaNOrFinite(1 / 0)).toBe(false)
    })

    it('negative infinity', () => {
      expect(isNaNOrFinite(-Infinity)).toBe(false)
      expect(isNaNOrFinite(Number.NEGATIVE_INFINITY)).toBe(false)
      expect(isNaNOrFinite(-1 / 0)).toBe(false)
    })

    it('operations producing infinity', () => {
      expect(isNaNOrFinite(1 / 0)).toBe(false)
      expect(isNaNOrFinite(-1 / 0)).toBe(false)
      expect(isNaNOrFinite(Number.MAX_VALUE * 2)).toBe(false)
    })
  })

  // 4. 测试非数字类型（应该返回 false）
  describe('should return false for non-number types', () => {
    it('strings', () => {
      expect(isNaNOrFinite('')).toBe(false)
      expect(isNaNOrFinite('0')).toBe(false)
      expect(isNaNOrFinite('123')).toBe(false)
      expect(isNaNOrFinite('3.14')).toBe(false)
      expect(isNaNOrFinite('NaN')).toBe(false)
      expect(isNaNOrFinite('Infinity')).toBe(false)
      expect(isNaNOrFinite('abc')).toBe(false)
    })

    it('booleans', () => {
      expect(isNaNOrFinite(true)).toBe(false)
      expect(isNaNOrFinite(false)).toBe(false)
    })

    it('null and undefined', () => {
      expect(isNaNOrFinite(null)).toBe(false)
      expect(isNaNOrFinite(undefined)).toBe(false)
    })

    it('objects', () => {
      expect(isNaNOrFinite({})).toBe(false)
      expect(isNaNOrFinite({ number: 123 })).toBe(false)
      expect(isNaNOrFinite(new Number(123))).toBe(false)
      expect(isNaNOrFinite(new Number(NaN))).toBe(false)
    })

    it('arrays', () => {
      expect(isNaNOrFinite([])).toBe(false)
      expect(isNaNOrFinite([1, 2, 3])).toBe(false)
      expect(isNaNOrFinite([NaN])).toBe(false)
      expect(isNaNOrFinite([123])).toBe(false)
    })

    it('functions', () => {
      expect(isNaNOrFinite(() => {})).toBe(false)
      expect(isNaNOrFinite(function () {})).toBe(false)
    })

    it('symbols', () => {
      expect(isNaNOrFinite(Symbol('test'))).toBe(false)
      expect(isNaNOrFinite(Symbol.iterator)).toBe(false)
    })

    it('bigint', () => {
      expect(isNaNOrFinite(123n)).toBe(false)
      expect(isNaNOrFinite(BigInt(9007199254740991))).toBe(false)
    })
  })

  // 5. 测试边缘情况
  describe('edge cases', () => {
    it('empty values', () => {
      expect(isNaNOrFinite('')).toBe(false)
      expect(isNaNOrFinite(null)).toBe(false)
      expect(isNaNOrFinite(undefined)).toBe(false)
    })

    it('whitespace strings', () => {
      expect(isNaNOrFinite(' ')).toBe(false)
      expect(isNaNOrFinite('    ')).toBe(false)
      expect(isNaNOrFinite('\t')).toBe(false)
      expect(isNaNOrFinite('\n')).toBe(false)
    })

    it('date objects', () => {
      expect(isNaNOrFinite(new Date())).toBe(false)
      expect(isNaNOrFinite(new Date('2023-01-01'))).toBe(false)
      expect(isNaNOrFinite(new Date('invalid'))).toBe(false)
    })

    it('regex objects', () => {
      expect(isNaNOrFinite(/regex/)).toBe(false)
      expect(isNaNOrFinite(new RegExp('test'))).toBe(false)
    })
  })

  // 6. 测试类型保护功能
  describe('type guard functionality', () => {
    it('should work with array filter', () => {
      const mixedArray: unknown[] = [
        NaN,
        1,
        '2',
        3.14,
        Infinity,
        -Infinity,
        null,
        undefined,
        true,
        'abc',
        {},
      ]

      const result = mixedArray.filter(isNaNOrFinite)

      // 应该只包含 NaN 和有限数字
      expect(result).toEqual([NaN, 1, 3.14])
      expect(result.every((item) => typeof item === 'number')).toBe(true)
    })
  })

  // 7. 对比测试：展示函数行为
  describe('comparison with native methods', () => {
    const testValues = [
      NaN,
      0,
      1,
      3.14,
      Infinity,
      -Infinity,
      '123',
      'abc',
      null,
      undefined,
      true,
      false,
    ]

    it('show difference from global isNaN', () => {
      testValues.forEach((value) => {
        const ourResult = isNaNOrFinite(value)
        const globalResult = isNaN(value as any)

        console.log(
          `Value: ${value}, Our: ${ourResult}, Global: ${globalResult}`,
        )
      })
    })

    it('show difference from Number.isNaN', () => {
      testValues.forEach((value) => {
        const ourResult = isNaNOrFinite(value)
        if (typeof value !== 'number') {
          expect(ourResult).toBe(false)
        }
      })
    })
  })

  // 8. 性能测试
  describe('performance', () => {
    it('should handle large input arrays efficiently', () => {
      const testValues = Array.from({ length: 10000 }, (_, index) => {
        // 混合各种类型
        switch (index % 12) {
          case 0:
            return NaN
          case 1:
            return index
          case 2:
            return index.toString()
          case 3:
            return null
          case 4:
            return undefined
          case 5:
            return Infinity
          case 6:
            return -Infinity
          case 7:
            return {}
          case 8:
            return []
          case 9:
            return index % 2 === 0
          case 10:
            return index * 0.1
          case 11:
            return -index
          default:
            return index
        }
      })

      const startTime = performance.now()
      const results = testValues.map(isNaNOrFinite)
      const endTime = performance.now()

      const trueCount = results.filter(Boolean).length

      // 大约 1/12 是 NaN，1/3 是有限数字，总共约 1/4 应该返回 true
      expect(trueCount).toBeGreaterThan(2000)
      expect(trueCount).toBeLessThan(4000)
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  // 9. 组合场景测试
  describe('combined scenarios', () => {
    it('mixed values in real-world scenario', () => {
      const data = [
        // 用户输入数据
        'john_doe', // 用户名 → false
        25, // 年龄 → true
        NaN, // 无效数据 → true
        '25', // 字符串数字 → false
        undefined, // 未定义 → false
        1000.5, // 余额 → true
        Infinity, // 无限值 → false
        null, // 空值 → false
        -5, // 负数 → true
        'invalid', // 无效字符串 → false
      ]

      const validNumericData = data.filter(isNaNOrFinite)

      expect(validNumericData).toEqual([25, NaN, 1000.5, -5])
      expect(validNumericData.every((item) => typeof item === 'number')).toBe(
        true,
      )
    })
  })
})
