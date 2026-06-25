import dayjs from 'dayjs'
import { isoWeek } from './isoWeek'

/**
 * 返回日期对应的 ISO 周序号。
 *
 * 这是围绕 `isoWeek` 的别名式包装。
 *
 * @param date 参考日期，默认当前日期。
 * @returns `1...53` 范围内的 ISO 周序号。
 * @throws 当 `date` 无效时抛出错误。
 */
export function weekOfYear(date?: dayjs.ConfigType): number {
  const currentDate = date === undefined ? dayjs() : dayjs(date)
  return isoWeek(currentDate)
}
