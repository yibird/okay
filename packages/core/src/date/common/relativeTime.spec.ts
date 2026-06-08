import { describe, expect, it } from 'vitest'
import { relativeTime } from './relativeTime'

describe('relativeTime', () => {
  it('formats past time automatically', () => {
    expect(
      relativeTime('2024-01-01T11:55:00', { baseDate: '2024-01-01T12:00:00', locale: 'en-US' }),
    ).toBe('5 minutes ago')
  })

  it('formats future time automatically', () => {
    expect(
      relativeTime('2024-01-03T12:00:00', { baseDate: '2024-01-01T12:00:00', locale: 'en-US' }),
    ).toBe('in 2 days')
  })

  it('formats with default locale when locale is omitted', () => {
    expect(relativeTime('2024-01-02T00:00:00', { baseDate: '2024-01-01T00:00:00' })).not.toBe('')
  })

  it('supports explicit week unit', () => {
    expect(
      relativeTime('2024-01-10T00:00:00', {
        baseDate: '2024-01-01T00:00:00',
        locale: 'en-US',
        unit: 'week',
      }),
    ).toBe('in 1 week')
  })

  it('supports numeric auto', () => {
    expect(
      relativeTime('2024-01-02T00:00:00', {
        baseDate: '2024-01-01T00:00:00',
        locale: 'en-US',
        numeric: 'auto',
      }),
    ).toBe('tomorrow')
  })

  it('supports short style and floor rounding', () => {
    expect(
      relativeTime('2024-01-01T12:01:20', {
        baseDate: '2024-01-01T12:00:00',
        locale: 'en-US',
        rounding: 'floor',
        style: 'short',
        unit: 'minute',
      }),
    ).toBe('in 1 min.')
  })

  it('supports quarter unit', () => {
    expect(
      relativeTime('2024-07-01', {
        baseDate: '2024-01-01',
        locale: 'en-US',
        style: 'short',
        unit: 'quarter',
      }),
    ).toBe('in 2 qtrs.')
  })

  it('returns fallback for invalid dates', () => {
    expect(relativeTime('invalid', { baseDate: '2024-01-01', fallback: '-' })).toBe('-')
    expect(relativeTime('2024-01-01', { baseDate: 'invalid', fallback: 'N/A' })).toBe('N/A')
  })

  it('auto-selects second unit for very recent time', () => {
    expect(
      relativeTime('2024-01-01T12:00:30', { baseDate: '2024-01-01T12:00:00', locale: 'en-US' }),
    ).toContain('second')
  })

  it('auto-selects hour unit', () => {
    expect(
      relativeTime('2024-01-01T14:00:00', { baseDate: '2024-01-01T12:00:00', locale: 'en-US' }),
    ).toContain('hour')
  })

  it('auto-selects month unit', () => {
    expect(relativeTime('2024-04-01', { baseDate: '2024-01-01', locale: 'en-US' })).toContain(
      'month',
    )
  })

  it('auto-selects year unit', () => {
    expect(relativeTime('2026-01-01', { baseDate: '2024-01-01', locale: 'en-US' })).toContain(
      'year',
    )
  })

  it('supports locale as array', () => {
    expect(() =>
      relativeTime('2024-01-02', { baseDate: '2024-01-01', locale: ['en-US', 'fr'] }),
    ).not.toThrow()
  })

  it('evicts oldest cache entry when full', () => {
    const locales = [
      'en-US',
      'fr',
      'de',
      'es',
      'it',
      'ja',
      'ko',
      'zh-CN',
      'zh-TW',
      'ru',
      'ar',
      'hi',
      'pt-BR',
      'pt-PT',
      'nl',
      'sv',
      'no',
      'da',
      'fi',
      'pl',
      'tr',
      'cs',
      'sk',
      'hu',
      'ro',
      'bg',
      'el',
      'he',
      'id',
      'ms',
      'th',
      'vi',
      'uk',
      'ca',
      'hr',
      'sr',
      'sl',
      'lt',
      'lv',
      'et',
      'is',
      'ga',
      'cy',
      'mt',
      'sq',
      'mk',
      'bs',
      'af',
      'sw',
      'zu',
      'xh',
      'am',
      'bn',
      'ta',
      'te',
      'ml',
      'mr',
      'gu',
      'pa',
      'ur',
      'fa',
      'ne',
      'si',
      'km',
    ]

    for (const locale of locales) {
      relativeTime('2024-01-02', { baseDate: '2024-01-01', locale })
    }

    expect(() =>
      relativeTime('2024-01-02', {
        baseDate: '2024-01-01',
        locale: 'fr',
        numeric: 'always',
        style: 'narrow',
      }),
    ).not.toThrow()
  })

  it('supports ceil rounding', () => {
    expect(
      relativeTime('2024-01-01T12:01:40', {
        baseDate: '2024-01-01T12:00:00',
        locale: 'en-US',
        rounding: 'ceil',
        style: 'short',
        unit: 'minute',
      }),
    ).toBe('in 2 min.')
  })

  it('supports trunc rounding', () => {
    expect(
      relativeTime('2024-01-01T12:01:40', {
        baseDate: '2024-01-01T12:00:00',
        locale: 'en-US',
        rounding: 'trunc',
        style: 'short',
        unit: 'minute',
      }),
    ).toBe('in 1 min.')
  })
})
