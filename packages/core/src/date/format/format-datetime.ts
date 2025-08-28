import { format } from './format'
import type { ConfigType } from 'dayjs'

const TEMPLATE = 'YYYY-MM-DD HH:mm:ss'
export function formatDatetime(input?: ConfigType) {
  return format(input, TEMPLATE)
}
