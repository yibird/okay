# 日期

日期工具基于 Day.js，并补充了范围格式化、相对时间、工作日、周、月、季度和年份计算。所有 `dayjs.ConfigType` 参数都可以接收 `Date`、时间戳、字符串或 Dayjs 对象。

```ts
import {
  businessDays,
  currentMonth,
  currentQuarter,
  currentWeek,
  currentYear,
  dateRange,
  dateTimeRange,
  daysInMonth,
  daysOfMonth,
  diffMonths,
  diffYears,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  formatDate,
  formatDateTime,
  formatRange,
  formatTime,
  isBusinessDay,
  isInMonth,
  isInQuarter,
  isInWeek,
  isInYear,
  isLeapYear,
  isSameDay,
  isWeekend,
  isoWeek,
  monthName,
  monthStarts,
  nextQuarter,
  nextWeek,
  prevQuarter,
  prevWeek,
  quarter,
  quarterOfYear,
  quarterRange,
  quartersAgo,
  quartersLater,
  relativeTime,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  timeRange,
  today,
  weekDays,
  weekOfYear,
  weekRange,
  weekday,
  weekdayIndex,
  weekdayName,
  weekdayNameZh,
  weekdaysOfMonth,
  weekdaysOfWeek,
  weekendsOfMonth,
  weekendsOfWeek,
  weeksOfMonth,
  type BusinessDayOptions,
  type BusinessDaysOptions,
  type RelativeTimeOptions,
} from '@zhouchengfeng/okay-core/date'
```

## 格式化与范围

| 方法             | 类型签名                                                              | 示例                                                      |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| `format`         | `(input?: dayjs.ConfigType, template?: string) => string`             | `format('2026-06-01', 'YYYY/MM/DD')`                      |
| `formatDate`     | `(input?: dayjs.ConfigType) => string`                                | `formatDate('2026-06-01T12:00:00')`                       |
| `formatDateTime` | `(input?: dayjs.ConfigType) => string`                                | `formatDateTime('2026-06-01T12:30:00')`                   |
| `formatTime`     | `(input?: dayjs.ConfigType) => string`                                | `formatTime('2026-06-01T12:30:00')`                       |
| `formatRange`    | `(input?: DateRangeInput, template?: string) => FormattedRangeResult` | `formatRange(['2026-06-01', '2026-06-03'])`               |
| `dateRange`      | `(input?: DateRangeInput) => FormattedRangeResult`                    | `dateRange({ start: '2026-06-01', end: '2026-06-30' })`   |
| `dateTimeRange`  | `(input?: DateRangeInput) => FormattedRangeResult`                    | `dateTimeRange(['2026-06-01 09:00', '2026-06-01 18:00'])` |
| `timeRange`      | `(input?: DateRangeInput) => FormattedRangeResult`                    | `timeRange(['2026-06-01 09:00', '2026-06-01 18:00'])`     |

```ts
format('2026-06-01T09:30:00', 'YYYY年MM月DD日 HH:mm')
// '2026年06月01日 09:30'

dateRange(['2026-06-01', '2026-06-30'])
// ['2026-06-01', '2026-06-30']

dateTimeRange('2026-06-01T09:30:00')
// { startDate: '2026-06-01 09:30:00', endDate: null }
```

## 相对时间和自然日

| 方法            | 类型签名                                                                                             | 示例                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `relativeTime`  | `(date: dayjs.ConfigType, options?: RelativeTimeOptions) => string`                                  | `relativeTime('2026-06-01', { baseDate: '2026-06-03' })` |
| `today`         | `() => Dayjs`                                                                                        | `today().format('YYYY-MM-DD')`                           |
| `isSameDay`     | `(left: dayjs.ConfigType, right?: dayjs.ConfigType) => boolean`                                      | `isSameDay('2026-06-01', '2026-06-01T23:59:59')`         |
| `weekday`       | `(date?: dayjs.ConfigType, locale?: 'en' \| 'zh', style?: 'full' \| 'short') => string \| undefined` | `weekday('2026-06-01', 'zh', 'short')`                   |
| `weekdayIndex`  | `(date?: dayjs.ConfigType) => number`                                                                | `weekdayIndex('2026-06-01')`                             |
| `weekdayName`   | `(day?: number \| Dayjs) => string`                                                                  | `weekdayName(1)`                                         |
| `weekdayNameZh` | `(day?: number \| Dayjs) => string`                                                                  | `weekdayNameZh(1)`                                       |

```ts
relativeTime('2026-06-03T12:00:00', {
  baseDate: '2026-06-01T12:00:00',
  locale: 'en-US',
})
// 'in 2 days'

isSameDay('2026-06-01T00:00:00', '2026-06-01T23:59:59')
// true

weekday('2026-06-01', 'zh', 'short')
// '周一'

weekdayName(1)
// 'Monday'

weekdayNameZh(1)
// '星期一'
```

## 工作日

| 方法            | 类型签名                                                                                    | 示例                                       |
| --------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `isBusinessDay` | `(date: dayjs.ConfigType, options?: BusinessDayOptions) => boolean`                         | `isBusinessDay('2026-06-01')`              |
| `businessDays`  | `(start: dayjs.ConfigType, end: dayjs.ConfigType, options?: BusinessDaysOptions) => number` | `businessDays('2026-06-01', '2026-06-30')` |
| `isWeekend`     | `(date?: dayjs.ConfigType) => boolean`                                                      | `isWeekend('2026-06-06')`                  |

```ts
businessDays('2026-06-01', '2026-06-30', {
  holidays: ['2026-06-19'],
  weekendDays: [0, 6],
})
// 21

isBusinessDay('2026-06-06')
// false
```

## 周

| 方法             | 类型签名                                                                           | 示例                                   |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------- |
| `currentWeek`    | `(date?: dayjs.ConfigType, options?: { weekStartDay?: 0 \| 1 }) => [Dayjs, Dayjs]` | `currentWeek('2026-06-03')`            |
| `startOfWeek`    | `(date?: dayjs.ConfigType, options?: { weekStartDay?: number }) => Dayjs`          | `startOfWeek('2026-06-03')`            |
| `endOfWeek`      | `(date?: dayjs.ConfigType, options?: { weekStartDay?: number }) => Dayjs`          | `endOfWeek('2026-06-03')`              |
| `prevWeek`       | `(date?: dayjs.ConfigType, options?: { weekStartDay?: 0 \| 1 }) => [Dayjs, Dayjs]` | `prevWeek('2026-06-03')`               |
| `nextWeek`       | `(date?: dayjs.ConfigType, options?: { weekStartDay?: 0 \| 1 }) => [Dayjs, Dayjs]` | `nextWeek('2026-06-03')`               |
| `weekRange`      | `(date?: dayjs.ConfigType) => WeekRange`                                           | `weekRange('2026-06-03')`              |
| `weekDays`       | `(date?: dayjs.ConfigType) => Dayjs[]`                                             | `weekDays('2026-06-03')`               |
| `weekdaysOfWeek` | `(date?: dayjs.ConfigType, options?) => Dayjs[]`                                   | `weekdaysOfWeek('2026-06-03')`         |
| `weekendsOfWeek` | `(date?: dayjs.ConfigType, options?) => Dayjs[]`                                   | `weekendsOfWeek('2026-06-03')`         |
| `weekOfYear`     | `(date?: dayjs.ConfigType) => number`                                              | `weekOfYear('2026-06-03')`             |
| `isoWeek`        | `(date?: dayjs.ConfigType) => number`                                              | `isoWeek('2026-06-03')`                |
| `isInWeek`       | `(date: dayjs.ConfigType, referenceDate?: dayjs.ConfigType) => boolean`            | `isInWeek('2026-06-02', '2026-06-03')` |

```ts
weekRange('2026-06-03')
// { startTime: Dayjs, endTime: Dayjs }

weekDays('2026-06-03').map((day) => day.format('YYYY-MM-DD'))
// ['2026-05-31', ...]

currentWeek('2026-06-03', { weekStartDay: 1 }).map((day) => day.format('YYYY-MM-DD'))
// ['2026-06-01', '2026-06-07']

weekdaysOfWeek('2026-06-03').map((day) => day.format('YYYY-MM-DD'))
// ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05']
```

## 月

| 方法              | 类型签名                                                        | 示例                                     |
| ----------------- | --------------------------------------------------------------- | ---------------------------------------- |
| `currentMonth`    | `() => number`                                                  | `currentMonth()`                         |
| `startOfMonth`    | `(year: number, month: number) => Dayjs`                        | `startOfMonth(2026, 6)`                  |
| `endOfMonth`      | `(year: number, month: number) => Dayjs`                        | `endOfMonth(2026, 6)`                    |
| `daysInMonth`     | `(year: number, month: number) => number`                       | `daysInMonth(2026, 2)`                   |
| `daysOfMonth`     | `(year: number, month: number) => Dayjs[]`                      | `daysOfMonth(2026, 6)`                   |
| `weeksOfMonth`    | `(year: number, month: number, startOfWeek?: number) => number` | `weeksOfMonth(2026, 6)`                  |
| `weekdaysOfMonth` | `(year: number, month: number) => Dayjs[]`                      | `weekdaysOfMonth(2026, 6)`               |
| `weekendsOfMonth` | `(year: number, month: number) => Dayjs[]`                      | `weekendsOfMonth(2026, 6)`               |
| `isInMonth`       | `(date: dayjs.ConfigType, month: number) => boolean`            | `isInMonth('2026-06-01', 6)`             |
| `monthName`       | `(month: number, locale?: string) => string`                    | `monthName(6, 'zh-CN')`                  |
| `diffMonths`      | `(left: dayjs.ConfigType, right: dayjs.ConfigType) => number`   | `diffMonths('2026-06-01', '2026-01-01')` |

```ts
daysInMonth(2026, 2)
// 28

weekendsOfMonth(2026, 6).map((day) => day.format('YYYY-MM-DD'))
```

## 季度

| 方法             | 类型签名                                                              | 示例                                 |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------ |
| `currentQuarter` | `() => [Dayjs, Dayjs]`                                                | `currentQuarter()`                   |
| `quarter`        | `(date?: dayjs.ConfigType) => number`                                 | `quarter('2026-06-01')`              |
| `startOfQuarter` | `(date?: dayjs.ConfigType) => Dayjs`                                  | `startOfQuarter('2026-06-01')`       |
| `endOfQuarter`   | `(date?: dayjs.ConfigType) => Dayjs`                                  | `endOfQuarter('2026-06-01')`         |
| `quarterOfYear`  | `(date?: dayjs.ConfigType) => QuarterOfYear`                          | `quarterOfYear('2026-06-01')`        |
| `quarterRange`   | `(date?: dayjs.ConfigType) => QuarterRangeInfo`                       | `quarterRange('2026-06-01')`         |
| `prevQuarter`    | `(date?: dayjs.ConfigType) => QuarterRange`                           | `prevQuarter('2026-06-01')`          |
| `nextQuarter`    | `(date?: dayjs.ConfigType) => QuarterRange`                           | `nextQuarter('2026-06-01')`          |
| `quartersAgo`    | `(n: number, date?: dayjs.ConfigType) => QuarterRange`                | `quartersAgo(2, '2026-06-01')`       |
| `quartersLater`  | `(n: number, date?: dayjs.ConfigType) => QuarterRange`                | `quartersLater(2, '2026-06-01')`     |
| `isInQuarter`    | `(date: dayjs.ConfigType, quarter: number, year?: number) => boolean` | `isInQuarter('2026-06-01', 2, 2026)` |

```ts
quarter('2026-06-01')
// 2

quarterRange('2026-06-01')
// { quarter: 2, startTime: Dayjs, endTime: Dayjs, year: 2026, toString: [Function] }

nextQuarter('2026-06-01').startTime.format('YYYY-MM-DD')
// '2026-07-01'

quartersAgo(2, '2026-06-01').startTime.format('YYYY-MM-DD')
// '2025-10-01'
```

## 年

| 方法          | 类型签名                                                      | 示例                                    |
| ------------- | ------------------------------------------------------------- | --------------------------------------- |
| `currentYear` | `() => number`                                                | `currentYear()`                         |
| `startOfYear` | `(year: number) => Dayjs`                                     | `startOfYear(2026)`                     |
| `endOfYear`   | `(year: number) => Dayjs`                                     | `endOfYear(2026)`                       |
| `isInYear`    | `(date: dayjs.ConfigType, year: number) => boolean`           | `isInYear('2026-06-01', 2026)`          |
| `isLeapYear`  | `(date?: dayjs.ConfigType) => boolean`                        | `isLeapYear('2024-01-01')`              |
| `monthStarts` | `(year: number) => Dayjs[]`                                   | `monthStarts(2026)`                     |
| `diffYears`   | `(left: dayjs.ConfigType, right: dayjs.ConfigType) => number` | `diffYears('2026-01-01', '2024-01-01')` |

```ts
monthStarts(2026).map((day) => day.format('YYYY-MM-DD'))
// ['2026-01-01', '2026-02-01', ...]
```

## 范围类型

```ts
type DateRangeInput =
  | dayjs.ConfigType
  | [dayjs.ConfigType, dayjs.ConfigType]
  | { start: dayjs.ConfigType; end: dayjs.ConfigType }

type FormattedRangeResult = { startDate: string; endDate: null } | [string, string]
```
