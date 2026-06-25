/**
 * 判断值是否像 DOM `Element`。
 *
 * 实现避免直接使用 `instanceof Element`，因此可在非浏览器运行时、轻量元素 mock 和 iframe
 * 跨 realm 场景中使用。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是类 DOM 元素对象时返回 `true`。
 */
export function isElement(target: unknown): target is Element {
  if (typeof target !== 'object' || target === null) return false

  const candidate = target as { tagName?: unknown }
  return typeof candidate.tagName === 'string' && candidate.tagName.length > 0
}
