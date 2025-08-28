import { format } from './format'
import type { ConfigType } from 'dayjs'

const TEMPLATE = 'HH:mm:ss'

export function formatTime(input?: ConfigType) {
  return format(input, TEMPLATE)
}
