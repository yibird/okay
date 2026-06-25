/**
 * 可以直接使用或通过 Promise 等待的值。
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * 自身属性值都是可等待值的对象。
 */
export type PromiseObject = Record<PropertyKey, Awaitable<unknown>>

/**
 * 递归解包对象中每个可等待属性值后的类型。
 */
export type AwaitedObject<T extends PromiseObject> = {
  [K in keyof T]: Awaited<T[K]>
}
