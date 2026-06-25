/**
 * 脱敏工具接受的输入值类型。
 */
export type MaskValue = string | number | bigint | null | undefined

/**
 * 通用文本脱敏配置。
 */
export interface MaskOptions {
  /**
   * 保留开头的字符数。
   *
   * 传入小数时会向下取整；传入负数时按 `0` 处理。
   */
  keepStart?: number
  /**
   * 保留结尾的字符数。
   *
   * 当 `keepStart` 和 `keepEnd` 超过原始长度时，会优先满足开头保留数量。
   */
  keepEnd?: number
  /**
   * 用于遮盖敏感内容的字符。
   *
   * 可以传入多个字符，例如 `••`；不能传入空字符串。
   */
  maskChar?: string
  /**
   * 最终渲染的遮盖字符数量。
   *
   * 传入 `auto` 时会和被遮盖的原始字符数量保持一致；传入数字时可固定输出长度。
   */
  maskLength?: number | 'auto'
  /**
   * 非空输入中至少需要被遮盖的原始字符数量。
   *
   * 适合短文本场景，避免因为保留数量过大而泄露完整内容。
   */
  minMaskLength?: number
  /**
   * `null` 和 `undefined` 输入的返回值。
   *
   * 默认返回空字符串，避免把空值转换成 `"null"` 或 `"undefined"`。
   */
  emptyValue?: string
}

/**
 * 邮箱脱敏配置。
 *
 * `keepStart` 和 `keepEnd` 作用于邮箱本地部分（`@` 前），域名始终保留。
 */
export interface MaskEmailOptions extends MaskOptions {
  /**
   * 保留邮箱本地部分开头的字符数。
   *
   * 默认保留 `1` 个字符，例如 `alice@example.com` 会变成 `a****@example.com`。
   */
  keepStart?: number
  /**
   * 保留邮箱本地部分结尾的字符数。
   *
   * 默认不保留结尾字符，域名部分始终保留。
   */
  keepEnd?: number
}

/**
 * 数字类脱敏配置（手机号、银行卡号等）。
 */
export interface MaskDigitOptions {
  /**
   * 保留开头的数字数量。
   *
   * 当 `preserveFormat` 为 `true` 时，只统计数字，不统计空格、短横线等分隔符。
   */
  keepStart?: number
  /**
   * 保留结尾的数字数量。
   *
   * 当 `preserveFormat` 为 `true` 时，只统计数字，不统计空格、短横线等分隔符。
   */
  keepEnd?: number
  /**
   * 用于替换敏感数字的字符。
   *
   * 可以传入多个字符；不能传入空字符串。
   */
  maskChar?: string
  /**
   * 最终渲染的遮盖字符数量。
   *
   * 传入 `auto` 时会和被遮盖的原始数字数保持一致；传入数字时可固定输出长度。
   * 仅在 `preserveFormat` 为 `false` 时生效。
   */
  maskLength?: number | 'auto'
  /**
   * 非空输入中至少需要被遮盖的数字数量。
   *
   * 适合短号码场景，避免保留完整数字。
   */
  minMaskLength?: number
  /**
   * `null` 和 `undefined` 输入的返回值。
   *
   * 默认返回空字符串。
   */
  emptyValue?: string
  /**
   * 是否保留原始格式中的非数字字符。
   *
   * 默认为 `true`，手机号、银行卡等格式化字符串会保留空格、短横线等分隔符。
   */
  preserveFormat?: boolean
}

/**
 * 姓名脱敏配置。
 *
 * `keepStart` 和 `keepEnd` 按 Unicode 码点计数，适合中文姓名。
 */
export interface MaskNameOptions extends MaskOptions {
  /**
   * 保留姓名开头的字符数。
   *
   * 默认保留 `1` 个字符。
   */
  keepStart?: number
  /**
   * 保留姓名结尾的字符数。
   *
   * 默认不保留结尾字符。
   */
  keepEnd?: number
}
