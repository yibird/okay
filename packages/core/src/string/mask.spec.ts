import { describe, expect, it } from 'vitest'
import { mask, maskBankCard, maskEmail, maskIdCard, maskName, maskPhone } from './index'

describe('mask', () => {
  it('按配置保留开头和结尾并遮盖中间字符', () => {
    expect(mask('13800138000', { keepStart: 3, keepEnd: 4 })).toBe('138****8000')
    expect(mask('abcdef', { keepStart: 2, keepEnd: 2 })).toBe('ab**ef')
  })

  it('支持固定遮盖长度', () => {
    expect(mask('abcdef', { keepStart: 1, keepEnd: 1, maskLength: 3 })).toBe('a***f')
    expect(mask('abcdef', { keepStart: 1, keepEnd: 1, maskLength: 0 })).toBe('af')
  })

  it('空值返回配置的空值文本', () => {
    expect(mask(null, { emptyValue: '-' })).toBe('-')
    expect(mask(undefined, { emptyValue: 'N/A' })).toBe('N/A')
    expect(mask(null)).toBe('')
  })

  it('不会拆坏 Unicode 代理对字符', () => {
    expect(mask('\u{1F600}abc', { keepStart: 1, keepEnd: 1 })).toBe('\u{1F600}**c')
  })

  it('校验非法遮盖配置', () => {
    expect(() => mask('abcdef', { keepStart: Number.POSITIVE_INFINITY })).toThrow(TypeError)
    expect(() => mask('abcdef', { keepEnd: Number.NaN })).toThrow(TypeError)
    expect(() => mask('abcdef', { maskChar: '' })).toThrow(TypeError)
    expect(() => mask('abcdef', { maskLength: Number.NEGATIVE_INFINITY })).toThrow(TypeError)
  })

  it('短文本会按最小遮盖长度减少可见字符', () => {
    expect(mask('ab', { keepStart: 1, keepEnd: 1, minMaskLength: 1 })).toBe('a*')
    expect(mask('a', { keepStart: 1, minMaskLength: 1 })).toBe('*')
  })

  it('空字符串和无需遮盖的文本保持原样', () => {
    expect(mask('')).toBe('')
    expect(mask('ab', { keepStart: 1, keepEnd: 1 })).toBe('ab')
  })
})

describe('maskEmail', () => {
  it('默认只遮盖邮箱本地部分', () => {
    expect(maskEmail('alice@example.com')).toBe('a****@example.com')
  })

  it('完整遮盖单字符邮箱本地部分', () => {
    expect(maskEmail('a@example.com')).toBe('*@example.com')
  })

  it('非法邮箱形态回退到通用遮盖', () => {
    expect(maskEmail('alice.example.com')).toBe('a****************')
    expect(maskEmail('a@')).toBe('a*')
    expect(maskEmail('a@b@c')).toBe('a****')
  })

  it('空值返回配置的空值文本', () => {
    expect(maskEmail(null, { emptyValue: '-' })).toBe('-')
  })
})

describe('maskPhone', () => {
  it('默认保留手机号前 3 位和后 4 位数字', () => {
    expect(maskPhone('13800138000')).toBe('138****8000')
  })

  it('默认保留号码分隔符', () => {
    expect(maskPhone('138-0013-8000')).toBe('138-****-8000')
  })

  it('支持把格式化号码按普通文本遮盖', () => {
    expect(maskPhone('138-0013-8000', { preserveFormat: false })).toBe('138******8000')
  })

  it('没有数字时回退到通用遮盖并避免完整暴露', () => {
    expect(maskPhone('phone')).toBe('*****')
  })

  it('支持自定义数字遮盖字符', () => {
    expect(maskPhone('138-0013-8000', { maskChar: '•' })).toBe('138-••••-8000')
  })

  it('空手机号返回配置的空值文本', () => {
    expect(maskPhone(null, { emptyValue: '-' })).toBe('-')
  })

  it('空手机号字符串保持原样', () => {
    expect(maskPhone('')).toBe('')
  })
})

describe('maskIdCard', () => {
  it('默认保留身份证号前 6 位和后 4 位', () => {
    expect(maskIdCard('11010519491231002X')).toBe('110105********002X')
  })
})

describe('maskBankCard', () => {
  it('默认遮盖银行卡中间数字并保留分隔符', () => {
    expect(maskBankCard('6222 8888 8888 8888')).toBe('6222 **** **** 8888')
  })
})

describe('maskName', () => {
  it('常见姓名默认保留第一个字符', () => {
    expect(maskName('\u5F20\u4E09')).toBe('\u5F20*')
  })

  it('完整遮盖单字姓名', () => {
    expect(maskName('\u5F20')).toBe('*')
  })
})
