import dayjs from 'dayjs'

export const parseQuarterDate = (date?: dayjs.ConfigType): dayjs.Dayjs => {
  const parsed = date === undefined || date === null || date === '' ? dayjs() : dayjs(date)

  if (!parsed.isValid()) {
    throw new Error('Invalid date provided')
  }

  return parsed
}

export const getQuarterNumber = (date: dayjs.Dayjs): number => Math.floor(date.month() / 3) + 1
