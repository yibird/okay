export function isFinite(target: unknown): target is number {
  return typeof target === 'number' && Number.isFinite(target)
}
