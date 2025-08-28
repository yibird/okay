export interface TreeConfig<T> {
  // 节点 ID 字段名称
  idKey?: keyof T
  // 子节点字段名称
  childrenKey?: keyof T
  // 父节点字段名称
  parentIdKey?: keyof T
}

export type DefaultChildrenKey<T> = 'children' extends keyof T
  ? 'children'
  : keyof T

export interface TreeMapConfig<
  T = any,
  K extends keyof T = DefaultChildrenKey<T>,
> {
  childrenKey?: K
}
