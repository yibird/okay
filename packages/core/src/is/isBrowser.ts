/**
 * 判断当前运行时是否暴露浏览器 DOM 全局对象。
 *
 * @returns 当 `window` 和 `document.createElement` 可用时返回 `true`。
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement === 'function'
  )
}
