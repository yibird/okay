import { format } from './format'
import type { ConfigType } from 'dayjs'

const TEMPLATE = 'YYYY-MM-DD'
export function formatDate(input?: ConfigType) {
  return format(input, TEMPLATE)
}
