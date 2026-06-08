/**
 * 索引结构支持的键类型。
 */
export type IndexedMapKey = PropertyKey

/**
 * 从数据项中读取索引键的字段名或选择器。
 */
export type IndexedMapSelector<T, K extends IndexedMapKey> = keyof T | ((item: T) => K)

/**
 * `fastIndexedMap` 的索引配置。
 */
export interface FastIndexedMapOptions<T, Id extends IndexedMapKey, Group extends IndexedMapKey> {
  /**
   * 唯一标识选择器。
   */
  key: IndexedMapSelector<T, Id>
  /**
   * 分组选择器。
   *
   * 未传入时会尝试读取 `groupId` 字段；读取不到时不会建立分组索引。
   */
  groupKey?: IndexedMapSelector<T, Group>
}

/**
 * 同时支持唯一标识查找和分组查找的索引结构。
 */
export interface FastIndexedMap<T, Id extends IndexedMapKey, Group extends IndexedMapKey> {
  /**
   * 当前索引中的数据量。
   */
  readonly size: number
  /**
   * 按唯一标识获取单条数据。
   */
  get(id: Id): T | undefined
  /**
   * 按分组标识获取同组数据。
   */
  getGroup(groupId: Group): T[]
  /**
   * 判断唯一标识是否存在。
   */
  has(id: Id): boolean
  /**
   * 新增或替换一条数据。
   */
  add(item: T): T
  /**
   * 按唯一标识浅合并或替换一条数据。
   */
  update(id: Id, patch: Partial<T> | ((current: T) => T)): T | undefined
  /**
   * 按唯一标识删除数据。
   */
  delete(id: Id): boolean
  /**
   * 清空全部数据和索引。
   */
  clear(): void
  /**
   * 返回当前所有数据的快照数组。
   *
   * 每次调用都会创建一个新数组（O(n) 拷贝）；如需高频迭代，请直接使用 `get` 或 `has` 避免拷贝。
   */
  values(): T[]
  /**
   * 返回全部分组标识的快照数组。
   *
   * 每次调用都会创建一个新数组；分组标识本身不会被拷贝。
   */
  groupKeys(): Group[]
}

const isIndexKey = (value: unknown): value is IndexedMapKey => {
  const type = typeof value

  return type === 'string' || type === 'number' || type === 'symbol'
}

const createSelector = <T, K extends IndexedMapKey>(selector: IndexedMapSelector<T, K>) =>
  typeof selector === 'function' ? selector : (item: T) => item[selector] as K

const readDefaultGroup = <T, Group extends IndexedMapKey>(item: T): Group | undefined => {
  const group = (item as Record<PropertyKey, unknown>)['groupId']

  return isIndexKey(group) ? (group as Group) : undefined
}

const resolveConfig = <T, Id extends IndexedMapKey, Group extends IndexedMapKey>(
  keyOrConfig: IndexedMapSelector<T, Id> | FastIndexedMapOptions<T, Id, Group>,
) => {
  if (typeof keyOrConfig === 'object' && keyOrConfig !== null && 'key' in keyOrConfig) {
    return keyOrConfig
  }

  return {
    key: keyOrConfig,
  } as FastIndexedMapOptions<T, Id, Group>
}

/**
 * 创建同时支持单项查找和分组查找的高速索引结构。
 *
 * 内部使用 `Map` 和“分组 Map”维护索引，新增、替换、删除和分组迁移都只更新对应键位。
 * `getGroup`、`values` 会返回新数组，便于在 Vue 或 React 中作为不可变输出使用。
 *
 * @param array 初始数据列表。
 * @param keyOrConfig 唯一标识选择器，或包含唯一标识和分组选择器的配置。
 * @returns 可查询、更新和删除的索引结构。
 */
export function fastIndexedMap<
  T extends Record<PropertyKey, any>,
  Id extends IndexedMapKey,
  Group extends IndexedMapKey = IndexedMapKey,
>(
  array: readonly T[],
  keyOrConfig: IndexedMapSelector<T, Id> | FastIndexedMapOptions<T, Id, Group>,
): FastIndexedMap<T, Id, Group> {
  const config = resolveConfig(keyOrConfig)
  const getId = createSelector(config.key)
  const getGroupId = config.groupKey
    ? createSelector<T, Group>(config.groupKey)
    : (item: T) => readDefaultGroup<T, Group>(item)
  const byId = new Map<Id, T>()
  const groupById = new Map<Id, Group>()
  const byGroup = new Map<Group, Map<Id, T>>()

  const removeFromGroup = (id: Id) => {
    const groupId = groupById.get(id)
    if (groupId === undefined) return

    const group = byGroup.get(groupId)
    group?.delete(id)

    if (group?.size === 0) {
      byGroup.delete(groupId)
    }

    groupById.delete(id)
  }

  const addToGroup = (id: Id, item: T) => {
    const groupId = getGroupId(item)
    if (!isIndexKey(groupId)) return

    const group = byGroup.get(groupId) ?? new Map<Id, T>()
    group.set(id, item)
    byGroup.set(groupId, group)
    groupById.set(id, groupId)
  }

  const setItem = (item: T) => {
    const id = getId(item)
    if (!isIndexKey(id)) {
      throw new TypeError('fastIndexedMap 的唯一标识必须是 string、number 或 symbol')
    }

    removeFromGroup(id)
    byId.set(id, item)
    addToGroup(id, item)

    return item
  }

  for (const item of array) {
    setItem(item)
  }

  return {
    get size() {
      return byId.size
    },
    get: (id) => byId.get(id),
    getGroup: (groupId) => Array.from(byGroup.get(groupId)?.values() ?? []),
    has: (id) => byId.has(id),
    add: setItem,
    update: (id, patch) => {
      const current = byId.get(id)
      if (!current) return undefined

      const next = typeof patch === 'function' ? patch(current) : ({ ...current, ...patch } as T)
      const nextId = getId(next)

      if (nextId !== id) {
        throw new TypeError('fastIndexedMap.update 不允许修改唯一标识，请先 delete 再 add')
      }

      return setItem(next)
    },
    delete: (id) => {
      if (!byId.has(id)) return false

      removeFromGroup(id)
      byId.delete(id)

      return true
    },
    clear: () => {
      byId.clear()
      byGroup.clear()
      groupById.clear()
    },
    values: () => Array.from(byId.values()),
    groupKeys: () => Array.from(byGroup.keys()),
  }
}
