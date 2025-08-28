import { describe, it, expect } from 'vitest'
import { isNaN } from './is-nan' // 请替换为实际路径

describe('isNaN', () => {
  // 1. 测试真正的 NaN 值
  describe('should return true for real NaN values', () => {
    it('literal NaN', () => {
      expect(isNaN(NaN)).toBe(true)
    })

    it('Number.NaN', () => {
      expect(isNaN(Number.NaN)).toBe(true)
    })

    it('mathematical operations producing NaN', () => {
      expect(isNaN(0 / 0)).toBe(true)
      expect(isNaN(Number('abc'))).toBe(true)
      expect(isNaN(Math.sqrt(-1))).toBe(true)
      expect(isNaN(Math.log(-1))).toBe(true)
    })

    it('NaN from parse methods', () => {
      expect(isNaN(parseInt('abc'))).toBe(true)
      expect(isNaN(parseFloat('xyz'))).toBe(true)
    })
  })

  // 2. 测试非 NaN 数字值
  describe('should return false for non-NaN numbers', () => {
    it('positive integers', () => {
      expect(isNaN(0)).toBe(false)
      expect(isNaN(1)).toBe(false)
      expect(isNaN(42)).toBe(false)
      expect(isNaN(999999)).toBe(false)
    })

    it('negative integers', () => {
      expect(isNaN(-1)).toBe(false)
      expect(isNaN(-42)).toBe(false)
      expect(isNaN(-999999)).toBe(false)
    })

    it('floats', () => {
      expect(isNaN(0.1)).toBe(false)
      expect(isNaN(3.14)).toBe(false)
      expect(isNaN(-123.456)).toBe(false)
    })

    it('Number constants', () => {
      expect(isNaN(Number.MAX_VALUE)).toBe(false)
      expect(isNaN(Number.MIN_VALUE)).toBe(false)
      expect(isNaN(Number.EPSILON)).toBe(false)
    })

    it('boundary values', () => {
      expect(isNaN(Number.MAX_SAFE_INTEGER)).toBe(false)
      expect(isNaN(Number.MIN_SAFE_INTEGER)).toBe(false)
    })

    it('hex and binary numbers', () => {
      expect(isNaN(0xff)).toBe(false) // 255
      expect(isNaN(0b1010)).toBe(false) // 10
      expect(isNaN(0o777)).toBe(false) // 511
    })

    it('scientific notation', () => {
      expect(isNaN(1e3)).toBe(false) // 1000
      expect(isNaN(1e-3)).toBe(false) // 0.001
    })
  })

  // 3. 测试 Infinity 值
  describe('should return false for Infinity values', () => {
    it('positive infinity', () => {
      expect(isNaN(Infinity)).toBe(false)
      expect(isNaN(Number.POSITIVE_INFINITY)).toBe(false)
      expect(isNaN(1 / 0)).toBe(false)
    })

    it('negative infinity', () => {
      expect(isNaN(-Infinity)).toBe(false)
      expect(isNaN(Number.NEGATIVE_INFINITY)).toBe(false)
      expect(isNaN(-1 / 0)).toBe(false)
    })
  })

  // 4. 测试非数字类型
  describe('should return false for non-number types', () => {
    it('strings', () => {
      expect(isNaN('')).toBe(false)
      expect(isNaN('0')).toBe(false)
      expect(isNaN('123')).toBe(false)
      expect(isNaN('NaN')).toBe(false)
      expect(isNaN('Infinity')).toBe(false)
      expect(isNaN('abc')).toBe(false)
    })

    it('booleans', () => {
      expect(isNaN(true)).toBe(false)
      expect(isNaN(false)).toBe(false)
    })

    it('null and undefined', () => {
      expect(isNaN(null)).toBe(false)
      expect(isNaN(undefined)).toBe(false)
    })

    it('objects', () => {
      expect(isNaN({})).toBe(false)
      expect(isNaN({ number: 123 })).toBe(false)
      expect(isNaN(new Number(NaN))).toBe(false) // 包装对象
      expect(isNaN(new Number(123))).toBe(false)
    })

    it('arrays', () => {
      expect(isNaN([])).toBe(false)
      expect(isNaN([1, 2, 3])).toBe(false)
      expect(isNaN([NaN])).toBe(false) // 数组包含NaN
    })

    it('functions', () => {
      expect(isNaN(() => {})).toBe(false)
      expect(isNaN(function () {})).toBe(false)
    })

    it('symbols', () => {
      expect(isNaN(Symbol('test'))).toBe(false)
      expect(isNaN(Symbol.iterator)).toBe(false)
    })

    it('bigint', () => {
      expect(isNaN(123n)).toBe(false)
      expect(isNaN(BigInt(9007199254740991))).toBe(false)
    })
  })

  // 5. 测试边缘情况
  describe('edge cases', () => {
    it('empty values', () => {
      expect(isNaN('')).toBe(false)
      expect(isNaN(null)).toBe(false)
      expect(isNaN(undefined)).toBe(false)
    })

    it('whitespace strings', () => {
      expect(isNaN(' ')).toBe(false)
      expect(isNaN('    ')).toBe(false)
      expect(isNaN('\t')).toBe(false)
      expect(isNaN('\n')).toBe(false)
    })

    it('date objects', () => {
      expect(isNaN(new Date())).toBe(false)
      expect(isNaN(new Date('invalid'))).toBe(false)
    })

    it('regex objects', () => {
      expect(isNaN(/regex/)).toBe(false)
      expect(isNaN(new RegExp('test'))).toBe(false)
    })

    it('special numeric values', () => {
      expect(isNaN(-0)).toBe(false) // 负零
      expect(isNaN(0)).toBe(false) // 正零
    })
  })

  // 6. 测试类型转换场景
  describe('type conversion scenarios', () => {
    it('string coercion', () => {
      // 与全局 isNaN 对比，展示严格性
      expect(isNaN('123')).toBe(false) // 严格版: false
      expect(isNaN('abc')).toBe(false) // 严格版: false
    })

    it('boolean coercion', () => {
      expect(isNaN(true)).toBe(false) // 严格版: false
      expect(isNaN(false)).toBe(false) // 严格版: false
    })

    it('object coercion', () => {
      expect(isNaN({})).toBe(false) // 严格版: false
      expect(isNaN({ valueOf: () => NaN })).toBe(false) // 严格版: false
    })
  })

  // 7. 对比测试：展示与原生方法的区别
  describe('comparison with native methods', () => {
    const testValues = [
      NaN,
      'NaN',
      '123',
      'abc',
      123,
      Infinity,
      null,
      undefined,
      true,
      false,
      {},
      [],
    ]

    it('compare with global isNaN', () => {
      testValues.forEach((value) => {
        const strictResult = isNaN(value)
        const globalResult = isNaN(value as any)

        // 严格版应该更保守
        if (globalResult && !strictResult) {
          // 这是预期的：全局 isNaN 会对非数字类型返回 true
          expect(
            typeof value !== 'number' ||
              value === Infinity ||
              value === -Infinity,
          ).toBe(true)
        }
      })
    })

    it('compare with Number.isNaN', () => {
      testValues.forEach((value) => {
        const strictResult = isNaN(value)
        const numberResult = Number.isNaN(value)

        // 严格版应该与 Number.isNaN 相同，或者更严格（排除 Infinity）
        if (numberResult) {
          expect(strictResult).toBe(true) // Number.isNaN 为 true 时，严格版也应该为 true
        }
      })
    })
  })

  // 8. 性能测试
  describe('performance', () => {
    it('should handle large input arrays efficiently', () => {
      const testValues = Array.from({ length: 10000 }, (_, index) => {
        // 混合各种类型
        switch (index % 10) {
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
          default:
            return index
        }
      })

      const startTime = performance.now()
      const results = testValues.map(isNaN)
      const endTime = performance.now()

      const nanCount = results.filter(Boolean).length

      expect(nanCount).toBe(1000) // 每10个中有1个NaN
      expect(endTime - startTime).toBeLessThan(100) // 应该在100ms内完成
    })
  })

  // 9. 特殊数学运算测试
  describe('special mathematical operations', () => {
    it('invalid mathematical operations', () => {
      // oxlint-disable-next-line erasing-op
      expect(isNaN(0 * Infinity)).toBe(true) // 0 * ∞ = NaN
      expect(isNaN(Infinity / Infinity)).toBe(true) // ∞ / ∞ = NaN
      expect(isNaN(Infinity - Infinity)).toBe(true) // ∞ - ∞ = NaN
    })

    it('valid mathematical operations', () => {
      // oxlint-disable-next-line erasing-op
      expect(isNaN(0 * 5)).toBe(false) // 0
      expect(isNaN(Infinity * 2)).toBe(false) // Infinity
      expect(isNaN(Infinity / 2)).toBe(false) // Infinity
    })
  })
})
