import { deepEqual, isObjectLike } from '../../internal/deepEqual'

export type ArrayDiffId = PropertyKey

export type ArrayDiffSelector<T, Id extends ArrayDiffId> = keyof T | ((item: T) => Id)

export interface DiffArrayOptions<T, Id extends ArrayDiffId> {
  /**
   * 用于识别数组项身份的唯一标识字段或选择器。
   *
   * 当数组项是对象时，默认读取 `id` 字段；当数组项是 string、number 或 symbol
   * 这类可作为对象键的原始值时，默认使用数组项本身作为唯一标识。
   * 如果对象没有合法的 `id` 字段，必须显式传入该配置。
   */
  idKey?: ArrayDiffSelector<T, Id>
  /**
   * 自定义数组项内容是否相等的比较函数。
   *
   * 返回 `true` 表示旧数组项和新数组项内容一致。即使内容一致，只要索引发生变化，
   * 仍会在 `updated` 中通过 `indexChanged` 标记出来。
   */
  isEqual?: (oldItem: T, newItem: T) => boolean
}

export interface ArrayDiffAdded<T, Id extends ArrayDiffId> {
  /**
   * 新增项的唯一标识。
   */
  id: Id
  /**
   * 新增项在新数组中的索引。
   */
  index: number
  /**
   * 新增项本身，保持新数组中的原始引用。
   */
  item: T
}

export interface ArrayDiffRemoved<T, Id extends ArrayDiffId> {
  /**
   * 删除项的唯一标识。
   */
  id: Id
  /**
   * 删除项在旧数组中的索引。
   */
  index: number
  /**
   * 删除项本身，保持旧数组中的原始引用。
   */
  item: T
}

export interface ArrayDiffUpdated<T, Id extends ArrayDiffId> {
  /**
   * 更新项的唯一标识。
   */
  id: Id
  /**
   * 更新项在旧数组中的索引。
   */
  oldIndex: number
  /**
   * 更新项在新数组中的索引。
   */
  index: number
  /**
   * 旧数组中的原始数组项。
   */
  oldItem: T
  /**
   * 新数组中的原始数组项。
   */
  newItem: T
  /**
   * 内容是否发生变化，由默认深比较或 `isEqual` 配置决定。
   */
  valueChanged: boolean
  /**
   * 索引是否发生变化，用于表示同一项在数组中的位置移动。
   */
  indexChanged: boolean
}

export interface ArrayDiffResult<T, Id extends ArrayDiffId> {
  /**
   * 只存在于新数组中的数组项。
   */
  added: Array<ArrayDiffAdded<T, Id>>
  /**
   * 只存在于旧数组中的数组项。
   */
  removed: Array<ArrayDiffRemoved<T, Id>>
  /**
   * 同时存在于两个数组中，但内容或索引发生变化的数组项。
   */
  updated: Array<ArrayDiffUpdated<T, Id>>
}

const isValidId = (value: unknown): value is ArrayDiffId =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol'

const getDefaultId = <T, Id extends ArrayDiffId>(item: T): Id => {
  if (isObjectLike(item)) {
    if ('id' in item && isValidId(item.id)) {
      return item.id as Id
    }

    /* v8 ignore next */
    throw new TypeError('diffArray requires idKey for object items without a valid id field')
  }

  if (isValidId(item)) {
    return item as unknown as Id
  }

  throw new TypeError('diffArray requires idKey for items without string, number, or symbol ids')
}

const createSelector = <T, Id extends ArrayDiffId>(selector?: ArrayDiffSelector<T, Id>) => {
  if (!selector) return getDefaultId<T, Id>
  return typeof selector === 'function' ? selector : (item: T) => item[selector] as Id
}

const indexArray = <T, Id extends ArrayDiffId>(array: readonly T[], getId: (item: T) => Id) => {
  const result = new Map<Id, number>()

  for (let index = 0; index < array.length; index++) {
    const item = array[index]
    const id = getId(item)

    if (result.has(id)) {
      throw new TypeError(`diffArray does not allow duplicate item ids: ${String(id)}`)
    }

    result.set(id, index)
  }

  return result
}

/**
 * 对比两个数组并返回详细差异报告。
 *
 * 该方法适合比较具有稳定身份标识的数组，例如接口返回的实体列表、配置项列表或排序后的数据行。
 * 返回结果会拆分为新增、删除和更新三类；其中 `updated` 会同时描述内容变化和索引变化，
 * 因此数组项移动位置时不需要额外的 moved 分类也能被准确表达。
 *
 * @param oldArray 旧数组，通常表示变更前的数据快照。
 * @param newArray 新数组，通常表示变更后的数据快照。
 * @param options 唯一标识选择器和自定义内容比较函数。
 * @returns 包含新增项、删除项和更新项的差异报告。
 */
export function diffArray<T, Id extends ArrayDiffId = ArrayDiffId>(
  oldArray: readonly T[],
  newArray: readonly T[],
  options: DiffArrayOptions<T, Id> = {},
): ArrayDiffResult<T, Id> {
  const getId = createSelector(options.idKey)
  const isEqual = options.isEqual ?? deepEqual
  const oldIndex = indexArray(oldArray, getId)
  const newIndex = indexArray(newArray, getId)
  const added: Array<ArrayDiffAdded<T, Id>> = []
  const removed: Array<ArrayDiffRemoved<T, Id>> = []
  const updated: Array<ArrayDiffUpdated<T, Id>> = []

  for (let index = 0; index < newArray.length; index++) {
    const item = newArray[index]
    const id = getId(item)
    const previousIndex = oldIndex.get(id)

    if (previousIndex === undefined) {
      added.push({
        id,
        index,
        item,
      })
      continue
    }

    const previousItem = oldArray[previousIndex]
    const valueChanged = !isEqual(previousItem, item)
    const indexChanged = previousIndex !== index

    if (valueChanged || indexChanged) {
      updated.push({
        id,
        index,
        indexChanged,
        newItem: item,
        oldIndex: previousIndex,
        oldItem: previousItem,
        valueChanged,
      })
    }
  }

  for (let index = 0; index < oldArray.length; index++) {
    const item = oldArray[index]
    const id = getId(item)

    if (!newIndex.has(id)) {
      removed.push({
        id,
        index,
        item,
      })
    }
  }

  return {
    added,
    removed,
    updated,
  }
}
