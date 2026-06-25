# 数字

数字工具基于缓存的 `Intl.NumberFormat` 实现，适合表格、统计卡片、金额、百分比和紧凑数字展示。快捷方法会自动复用内部 formatter；在高频循环中，可以用 `createNumberFormatter` 显式创建可复用 formatter。

```ts
import {
  createNumberFormatter,
  formatCompactNumber,
  formatCurrency,
  formatNumber,
  formatPercent,
  type CreateNumberFormatterOptions,
  type FormatCompactNumberOptions,
  type FormatCurrencyOptions,
  type FormatNumberOptions,
  type FormatPercentOptions,
  type NumberFormatValue,
  type NumberFormatter,
  type PercentFormatValue,
} from '@zhouchengfeng/okay/number'
```

## 类型

```ts
type NumberFormatValue = number | bigint | null | undefined
type PercentFormatValue = number | null | undefined

interface FormatNumberBehaviorOptions {
  locale?: Intl.LocalesArgument
  fallback?: string
  allowNonFinite?: boolean
}

interface FormatNumberOptions
  extends
    FormatNumberBehaviorOptions,
    Omit<
      Intl.NumberFormatOptions,
      'style' | 'currency' | 'currencyDisplay' | 'currencySign' | 'unit' | 'unitDisplay'
    > {}

interface FormatPercentOptions extends FormatNumberOptions {
  valueMode?: 'ratio' | 'percent'
}

interface FormatCurrencyOptions
  extends FormatNumberBehaviorOptions, Omit<Intl.NumberFormatOptions, 'style' | 'currency'> {
  currency?: string
}

interface FormatCompactNumberOptions
  extends FormatNumberBehaviorOptions, Omit<FormatNumberOptions, 'notation'> {}

interface CreateNumberFormatterOptions
  extends FormatNumberBehaviorOptions, Intl.NumberFormatOptions {}

type NumberFormatter = (value: NumberFormatValue) => string
```

`formatNumber` 固定为十进制数字，不能传入 `style`、`currency`、`unit` 等互相冲突的选项。货币请使用 `formatCurrency`，紧凑数字请使用 `formatCompactNumber`；只有 `createNumberFormatter` 会开放完整的 `Intl.NumberFormatOptions`。

## API 总览

| 方法                    | 类型签名                                                                                                                                                                               | 说明                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `formatNumber`          | `(value: NumberFormatValue, options?: FormatNumberOptions) => string`                                                                                                                  | 格式化普通十进制数字。             |
| `formatPercent`         | `(value: PercentFormatValue, options?: FormatPercentOptions) => string`                                                                                                                | 格式化百分比，默认把输入当比例值。 |
| `formatCurrency`        | `(value: NumberFormatValue, options?: FormatCurrencyOptions) => string` 或 `(value: NumberFormatValue, currency: string, options?: Omit<FormatCurrencyOptions, 'currency'>) => string` | 格式化货币，支持货币代码快捷参数。 |
| `formatCompactNumber`   | `(value: NumberFormatValue, options?: FormatCompactNumberOptions) => string`                                                                                                           | 使用紧凑记法展示大数字。           |
| `createNumberFormatter` | `(options?: CreateNumberFormatterOptions) => NumberFormatter`                                                                                                                          | 创建可复用 formatter，适合热路径。 |

## formatNumber

`formatNumber` 适合普通数值展示，例如人数、数量、比率、表格列。`null`、`undefined` 和默认不允许的非有限数字会返回 `fallback`。

```ts
formatNumber(1234567.891, {
  locale: 'en-US',
  maximumFractionDigits: 2,
})
// '1,234,567.89'

formatNumber(1234567.891, {
  locale: 'zh-CN',
  minimumFractionDigits: 2,
})
// '1,234,567.891'

formatNumber(null, { fallback: '-' })
// '-'

formatNumber(Number.NaN, { fallback: 'N/A' })
// 'N/A'
```

允许 `NaN`、`Infinity` 交给 `Intl` 处理：

```ts
formatNumber(Infinity, {
  allowNonFinite: true,
  locale: 'en-US',
})
// '∞'
```

## formatPercent

默认 `valueMode: 'ratio'`，即 `0.12` 输出 `12%`。如果输入已经是百分比数值，使用 `valueMode: 'percent'`。

```ts
formatPercent(0.256, {
  maximumFractionDigits: 1,
})
// '25.6%'

formatPercent(25.6, {
  valueMode: 'percent',
  maximumFractionDigits: 1,
})
// '25.6%'

formatPercent(undefined, { fallback: '--' })
// '--'
```

使用固定小数位：

```ts
formatPercent(0.8, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
// '80.00%'
```

## formatCurrency

支持两种调用方式：配置对象，或把货币代码作为第二个参数。货币代码遵循 ISO 4217，例如 `CNY`、`USD`、`EUR`。

```ts
formatCurrency(1288, 'CNY', {
  locale: 'zh-CN',
})
// '¥1,288.00'

formatCurrency(1288, {
  currency: 'USD',
  currencyDisplay: 'code',
  locale: 'en-US',
})
// 'USD 1,288.00'

formatCurrency(null, 'EUR', {
  fallback: '待定',
})
// '待定'
```

控制小数位：

```ts
formatCurrency(1288.5, 'CNY', {
  locale: 'zh-CN',
  maximumFractionDigits: 0,
})
// '¥1,289'
```

## formatCompactNumber

适合指标卡片、列表计数和图表坐标轴。该方法固定使用 `notation: 'compact'`，你可以通过 `compactDisplay`、`maximumFractionDigits` 等选项控制展示细节。

```ts
formatCompactNumber(12_000, {
  locale: 'en-US',
})
// '12K'

formatCompactNumber(1_280_000, {
  compactDisplay: 'long',
  locale: 'en-US',
  maximumFractionDigits: 1,
})
// '1.3 million'

formatCompactNumber(12_000, {
  locale: 'zh-CN',
})
// '1.2万'
```

## createNumberFormatter

当同一组格式化配置会重复使用时，优先创建 formatter，减少热路径里解析配置的开销。

```ts
const formatPrice: NumberFormatter = createNumberFormatter({
  currency: 'USD',
  locale: 'en-US',
  style: 'currency',
})

for (const price of [12, 19.9, 1288]) {
  formatPrice(price)
}
// '$12.00', '$19.90', '$1,288.00'
```

也可以用于单位展示：

```ts
const formatDistance = createNumberFormatter({
  locale: 'en-US',
  style: 'unit',
  unit: 'kilometer',
  unitDisplay: 'short',
})

formatDistance(42)
// '42 km'
```

## 使用建议

| 场景             | 推荐                    |
| ---------------- | ----------------------- |
| 单次展示普通数字 | `formatNumber`          |
| 单次展示金额     | `formatCurrency`        |
| 单次展示百分比   | `formatPercent`         |
| 展示大数字缩写   | `formatCompactNumber`   |
| 表格列大量格式化 | `createNumberFormatter` |
| 需要稳定快照测试 | 显式传入 `locale`       |
| 空值需要占位     | 设置 `fallback`         |
