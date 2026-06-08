import dayjs, { type Dayjs } from 'dayjs'

/**
 * 返回归一化到当天开始时间的今天日期。
 *
 * @returns 当前本地日期的 `00:00:00.000`。
 */
export function today(): Dayjs {
  return dayjs().startOf('day')
}
