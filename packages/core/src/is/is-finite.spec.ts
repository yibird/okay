import { describe, it, expect } from 'vitest'
import { isFinite } from './is-finite' // 请替换为实际路径

describe('isFinite', () => {
  // 测试真正的有限数字
  describe('should return true for finite numbers', () => {
    it('positive integers', () => {
      expect(isFinite(0)).toBe(true)
      expect(isFinite(1)).toBe(true)
      expect(isFinite(42)).toBe(true)
      expect(isFinite(999999)).toBe(true)
    })

    it('negative integers', () => {
      expect(isFinite(-1)).toBe(true)
      expect(isFinite(-42)).toBe(true)
      expect(isFinite(-999999)).toBe(true)
    })

    it('positive floats', () => {
      expect(isFinite(0.1)).toBe(true)
      expect(isFinite(3.14)).toBe(true)
      expect(isFinite(123.456)).toBe(true)
    })

    it('negative floats', () => {
      expect(isFinite(-0.1)).toBe(true)
      expect(isFinite(-3.14)).toBe(true)
      expect(isFinite(-123.456)).toBe(true)
    })

    it('Number constants', () => {
      expect(isFinite(Number.MAX_VALUE)).toBe(true)
      expect(isFinite(Number.MIN_VALUE)).toBe(true)
      expect(isFinite(Number.EPSILON)).toBe(true)
    })

    it('boundary values', () => {
      expect(isFinite(Number.MAX_SAFE_INTEGER)).toBe(true)
      expect(isFinite(Number.MIN_SAFE_INTEGER)).toBe(true)
    })
  })

  // 测试非有限数字
  describe('should return false for non-finite numbers', () => {
    it('Infinity values', () => {
      expect(isFinite(Infinity)).toBe(false)
      expect(isFinite(-Infinity)).toBe(false)
      expect(isFinite(Number.POSITIVE_INFINITY)).toBe(false)
      expect(isFinite(Number.NEGATIVE_INFINITY)).toBe(false)
    })

    it('NaN', () => {
      expect(isFinite(NaN)).toBe(false)
      expect(isFinite(Number.NaN)).toBe(false)
    })
  })

  // 测试非数字类型
  describe('should return false for non-number types', () => {
    it('strings', () => {
      expect(isFinite('')).toBe(false)
      expect(isFinite('0')).toBe(false)
      expect(isFinite('123')).toBe(false)
      expect(isFinite('3.14')).toBe(false)
      expect(isFinite('abc')).toBe(false)
      expect(isFinite('true')).toBe(false)
    })

    it('booleans', () => {
      expect(isFinite(true)).toBe(false)
      expect(isFinite(false)).toBe(false)
    })

    it('null and undefined', () => {
      expect(isFinite(null)).toBe(false)
      expect(isFinite(undefined)).toBe(false)
    })

    it('objects', () => {
      expect(isFinite({})).toBe(false)
      expect(isFinite({ number: 123 })).toBe(false)
      expect(isFinite(new Number(123))).toBe(false) // 包装对象
    })

    it('arrays', () => {
      expect(isFinite([])).toBe(false)
      expect(isFinite([1, 2, 3])).toBe(false)
      expect(isFinite([123])).toBe(false)
    })

    it('functions', () => {
      expect(isFinite(() => {})).toBe(false)
      expect(isFinite(function () {})).toBe(false)
    })

    it('symbols', () => {
      expect(isFinite(Symbol('test'))).toBe(false)
      expect(isFinite(Symbol.iterator)).toBe(false)
    })

    it('bigint', () => {
      expect(isFinite(123n)).toBe(false)
      expect(isFinite(BigInt(9007199254740991))).toBe(false)
    })
  })

  // 测试边缘情况
  describe('edge cases', () => {
    it('empty values', () => {
      expect(isFinite('')).toBe(false)
      expect(isFinite(null)).toBe(false)
      expect(isFinite(undefined)).toBe(false)
    })

    it('numeric strings that look like numbers', () => {
      expect(isFinite('0')).toBe(false)
      expect(isFinite('123')).toBe(false)
      expect(isFinite('-123')).toBe(false)
      expect(isFinite('3.14')).toBe(false)
    })

    it('whitespace strings', () => {
      expect(isFinite(' ')).toBe(false)
      expect(isFinite('    ')).toBe(false)
      expect(isFinite('\t')).toBe(false)
      expect(isFinite('\n')).toBe(false)
    })

    it('date objects', () => {
      expect(isFinite(new Date())).toBe(false)
      expect(isFinite(new Date('2023-01-01'))).toBe(false)
    })

    it('regex objects', () => {
      expect(isFinite(/regex/)).toBe(false)
      expect(isFinite(new RegExp('test'))).toBe(false)
    })
  })

  // 测试类型保护功能 - 修正版本
  describe('type guard functionality', () => {
    it('should narrow type to number when true', () => {
      const value: unknown = 42

      if (isFinite(value)) {
        // value 应该被推断为 number 类型
        expect(typeof value).toBe('number')
        expect(value.toFixed(2)).toBe('42.00') // 可以调用数字方法
      } else {
        // 使用 expect.fail() 替代 fail()
        expect.fail('Should have been identified as finite number')
      }
    })

    it('should not narrow type when false', () => {
      const value: unknown = 'not a number'

      if (isFinite(value)) {
        expect.fail('Should not have been identified as finite number')
      } else {
        // value 仍然是 unknown 类型
        expect(typeof value).not.toBe('number')
      }
    })

    it('should work in array filter with type narrowing', () => {
      const mixedArray: unknown[] = [
        1,
        '2',
        3.14,
        NaN,
        Infinity,
        -Infinity,
        null,
        undefined,
        true,
      ]

      const numbers = mixedArray.filter(isFinite)

      expect(numbers).toEqual([1, 3.14])
      expect(numbers.every((n) => typeof n === 'number')).toBe(true)
    })
  })

  // 性能测试（可选）
  describe('performance', () => {
    it('should handle large numbers of inputs quickly', () => {
      const testArray = Array.from({ length: 10000 }, (_, i) =>
        i % 2 === 0 ? i : i.toString(),
      )

      const start = performance.now()
      const result = testArray.filter(isFinite)
      const end = performance.now()

      expect(result.length).toBe(5000)
      // 放宽性能要求，避免在不同机器上失败
      expect(end - start).toBeLessThan(500) // 应该在500ms内完成
    })
  })
})

// 额外的边界测试（可选）
describe('additional edge cases for isFinite', () => {
  it('hex numbers', () => {
    expect(isFinite(0xff)).toBe(true) // 255
  })

  it('scientific notation', () => {
    expect(isFinite(1e3)).toBe(true) // 1000
    expect(isFinite(1e-3)).toBe(true) // 0.001
  })

  it('very small numbers', () => {
    // oxlint-disable-next-line no-loss-of-precision
    expect(isFinite(5e-324)).toBe(true) // 接近 MIN_VALUE
  })

  it('very large numbers', () => {
    expect(isFinite(1.7976931348623157e308)).toBe(true) // MAX_VALUE
  })

  it('zero values', () => {
    expect(isFinite(0)).toBe(true)
    expect(isFinite(-0)).toBe(true) // 负零也是有限数字
  })

  it('numeric separators', () => {
    expect(isFinite(1_000_000)).toBe(true)
    expect(isFinite(0.000_001)).toBe(true)
  })
})
