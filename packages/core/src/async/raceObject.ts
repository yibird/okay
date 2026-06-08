import type { AwaitedObject, PromiseObject } from './types'

/**
 * `raceObject` 最先完成项的键和值。
 */
export type RaceObjectResult<T extends PromiseObject> = {
  /**
   * 最先完成的属性键。
   */
  key: keyof T
  /**
   * 最先完成属性对应的解析值。
   */
  value: AwaitedObject<T>[keyof T]
}

/**
 * 对对象中的异步值执行竞速，并保留最先完成值对应的属性键。
 *
 * 该方法适合需要知道“哪个任务最先完成”的场景。输入对象的字符串键和 symbol 键都会被保留；
 * 如果传入空对象，会和 `Promise.race([])` 一样保持等待状态。
 *
 * @param object 属性值为可等待值的对象。
 * @returns 最先完成的属性键和值。
 */
export async function raceObject<T extends PromiseObject>(object: T): Promise<RaceObjectResult<T>> {
  const entries = Reflect.ownKeys(object).map((key) =>
    Promise.resolve(object[key as keyof T]).then((value) => ({
      key: key as keyof T,
      value: value as AwaitedObject<T>[keyof T],
    })),
  )

  return Promise.race(entries)
}
