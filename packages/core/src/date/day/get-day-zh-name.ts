import dayjs, { type Dayjs } from 'dayjs'

const DAY_NAMES = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]

/**
 * 获取当前星期几的名称
 * @param day 星期几，0 表示星期日，1 表示星期一，以此类推
 * @returns 星期几的名称
 */
export function getDayZhName(day?: number | Dayjs) {
  if (day === undefined) {
    // Return current day name if no input provided
    return DAY_NAMES[dayjs().day()]
  }

  let dayNumber: number

  if (typeof day === 'number') {
    dayNumber = ((day % 7) + 7) % 7
  } else if (dayjs.isDayjs(day)) {
    dayNumber = day.day()
  } else {
    return DAY_NAMES[dayjs().day()]
  }

  return DAY_NAMES[dayNumber]
}
