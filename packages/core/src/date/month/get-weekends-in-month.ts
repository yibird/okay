import { getAllDaysInMonth } from './get-all-days-in-month'

export function getWeekendsInMonth(year: number, month: number) {
  return getAllDaysInMonth(year, month).filter((item) => {
    const dayOfWeek = item.day()
    return dayOfWeek === 0 || dayOfWeek === 6
  })
}
