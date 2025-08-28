/**
 * 判断当前环境是否是浏览器环境
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isBrowser() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )
}
