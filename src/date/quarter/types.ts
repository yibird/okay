import type { Dayjs } from 'dayjs'

/**
 * 季度起止范围。
 */
export interface QuarterRange {
  startTime: Dayjs
  endTime: Dayjs
}
