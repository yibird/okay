import dayjs from 'dayjs'

/**
 * Check if a date falls within a specific quarter of a year
 * @param date The date to check
 * @param quarter The quarter to check against (1-4)
 * @param year The year to check against (optional, defaults to current year)
 * @returns boolean indicating whether the date is in the specified quarter
 */
export function isDateInQuarter(
  date: dayjs.ConfigType,
  quarter: number,
  year?: number,
) {
  const d = dayjs(date)
  const currentYear = year ?? d.year()

  // Validate quarter input
  if (quarter < 1 || quarter > 4 || !Number.isInteger(quarter)) {
    throw new Error('Quarter must be an integer between 1 and 4')
  }

  const startMonth = (quarter - 1) * 3
  const startDate = dayjs(new Date(currentYear, startMonth, 1)).startOf('month')
  const endDate = startDate.add(2, 'month').endOf('month')

  // Using the correct dayjs comparison methods
  return (
    (d.isAfter(startDate) || d.isSame(startDate)) &&
    (d.isBefore(endDate) || d.isSame(endDate))
  )
}
