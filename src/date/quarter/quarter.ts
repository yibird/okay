import type dayjs from 'dayjs'
import { getQuarterNumber, parseQuarterDate } from './quarterShared'

/**
 * 返回日期所属季度编号。
 *
 * 省略、`null` 和空字符串输入会被视为当前日期；其他无效日期会抛出错误。
 *
 * @param date 参考日期，默认当前日期。
 * @returns `1...4` 范围内的季度编号。
 * @throws 当 `date` 无效时抛出错误。
 */
export function quarter(date?: dayjs.ConfigType): number {
  return getQuarterNumber(parseQuarterDate(date))
}
