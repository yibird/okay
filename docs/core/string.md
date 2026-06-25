# 字符串

`@zhouchengfeng/okay` 的字符串工具目前聚焦敏感信息脱敏。所有脱敏方法都接受 `string | number | bigint | null | undefined`，空值默认返回空字符串，适合直接用于表格、详情页和日志输出前处理。

```ts
import {
  mask,
  maskBankCard,
  maskEmail,
  maskIdCard,
  maskName,
  maskPhone,
  type MaskDigitOptions,
  type MaskEmailOptions,
  type MaskNameOptions,
  type MaskOptions,
  type MaskValue,
} from '@zhouchengfeng/okay/string'
```

## 类型

```ts
type MaskValue = string | number | bigint | null | undefined

interface MaskOptions {
  keepStart?: number
  keepEnd?: number
  maskChar?: string
  maskLength?: number | 'auto'
  minMaskLength?: number
  emptyValue?: string
}

interface MaskDigitOptions {
  keepStart?: number
  keepEnd?: number
  maskChar?: string
  minMaskLength?: number
  emptyValue?: string
  preserveFormat?: boolean
}

interface MaskEmailOptions extends Omit<MaskOptions, 'keepStart' | 'keepEnd'> {
  keepStart?: number
  keepEnd?: number
}

interface MaskNameOptions extends Omit<MaskOptions, 'keepStart' | 'keepEnd'> {
  keepStart?: number
  keepEnd?: number
}
```

## API 总览

| 方法           | 类型签名                                                      | 默认行为                                             | 示例                                                      |
| -------------- | ------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| `mask`         | `(value: MaskValue, options?: MaskOptions) => string`         | 按 Unicode code point 保留首尾，其余字符用掩码覆盖。 | `mask('alice@example.com', { keepStart: 2, keepEnd: 4 })` |
| `maskPhone`    | `(phone: MaskValue, options?: MaskDigitOptions) => string`    | 保留前 3 位和后 4 位数字，并保留空格、短横线等格式。 | `maskPhone('+86 138-1234-5678')`                          |
| `maskBankCard` | `(bankCard: MaskValue, options?: MaskDigitOptions) => string` | 保留前 4 位和后 4 位数字。                           | `maskBankCard('6222 8888 8888 1234')`                     |
| `maskIdCard`   | `(idCard: MaskValue, options?: MaskOptions) => string`        | 保留前 6 位和后 4 位字符。                           | `maskIdCard('11010519491231002X')`                        |
| `maskEmail`    | `(email: MaskValue, options?: MaskEmailOptions) => string`    | 只脱敏邮箱本地部分，域名保持可读。                   | `maskEmail('alice@example.com')`                          |
| `maskName`     | `(name: MaskValue, options?: MaskNameOptions) => string`      | 默认保留第一个字符，其余字符脱敏。                   | `maskName('张三')`                                        |

## mask

通用文本脱敏，适合 token、邮箱本地部分、订单号、用户 ID 等没有固定格式的字符串。

```ts
mask('okay-access-token-2026', {
  keepStart: 4,
  keepEnd: 4,
})
// 'okay****************2026'

mask('🙂customer@example.com', {
  keepStart: 1,
  keepEnd: 4,
  maskChar: '•',
})
// '🙂••••••••••••••••.com'

mask(null, { emptyValue: '-' })
// '-'
```

## maskPhone

用于手机号、座机号等数字类号码。默认 `preserveFormat: true`，只统计数字，不把空格、`+`、`-` 计入保留位数。

```ts
maskPhone('13812345678')
// '138****5678'

maskPhone('+86 138-1234-5678')
// '+86 138-****-5678'

maskPhone('+86 138-1234-5678', {
  preserveFormat: false,
  maskChar: '#',
})
// '+86#138-1234#5678'
```

## maskBankCard

银行卡号通常需要保留首尾用于核对，中间数字隐藏。

```ts
maskBankCard('6222 8888 8888 1234')
// '6222 **** **** 1234'

maskBankCard('6222888888881234', {
  maskChar: '•',
  keepStart: 6,
  keepEnd: 4,
})
// '622288••••••1234'
```

## maskIdCard

身份证号默认展示行政区划和末尾校验位附近信息。

```ts
maskIdCard('11010519491231002X')
// '110105********002X'

maskIdCard('11010519491231002X', {
  keepStart: 3,
  keepEnd: 2,
  maskLength: 6,
})
// '110******2X'
```

## maskEmail

当输入是合法单 `@` 邮箱时，只脱敏本地部分；如果不是邮箱形态，会退回通用 `mask` 逻辑，避免原样泄露。

```ts
maskEmail('alice@example.com')
// 'a****@example.com'

maskEmail('alice@example.com', {
  keepStart: 2,
  keepEnd: 1,
})
// 'al**e@example.com'

maskEmail('not-an-email')
// 'n*********'
```

## maskName

适合中文姓名、英文姓名或包含扩展字符的昵称。

```ts
maskName('张三')
// '张*'

maskName('Alice', {
  keepStart: 1,
  keepEnd: 1,
})
// 'A***e'

maskName(undefined, { emptyValue: '匿名用户' })
// '匿名用户'
```

## 选择建议

| 场景                 | 推荐方法       |
| -------------------- | -------------- |
| 不确定格式的任意文本 | `mask`         |
| 手机号、座机号       | `maskPhone`    |
| 银行卡号、账号类数字 | `maskBankCard` |
| 中国居民身份证号     | `maskIdCard`   |
| 邮箱地址             | `maskEmail`    |
| 姓名、昵称           | `maskName`     |
