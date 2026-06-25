import type { PromiseObject } from './types'

/**
 * 与输入对象键保持一致的 `Promise.allSettled` 结果对象。
 */
export type SettledObjectResult<T extends PromiseObject> = {
  [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>
}

/**
 * 以对象形态执行 `Promise.allSettled`。
 *
 * 返回对象会保留输入对象自身的字符串键和 symbol 键。
 *
 * @param object 属性值为可等待值的对象。
 * @returns 与输入键一致的 settled 结果对象。
 */
export async function settleObject<T extends PromiseObject>(
  object: T,
): Promise<SettledObjectResult<T>> {
  const keys = Reflect.ownKeys(object) as Array<keyof T>
  const settled = await Promise.allSettled(keys.map((key) => object[key]))
  const result = {} as SettledObjectResult<T>

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    result[key] = settled[index] as SettledObjectResult<T>[typeof key]
  }

  return result
}
