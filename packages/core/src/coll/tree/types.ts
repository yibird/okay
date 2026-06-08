/**
 * 通用树工具使用的字段名配置。
 */
export interface TreeConfig<T> {
  /**
   * 节点唯一标识字段。
   */
  idKey?: keyof T
  /**
   * 包含子节点的字段。
   */
  childrenKey?: keyof T
  /**
   * 扁平列表工具使用的父节点标识字段。
   */
  parentIdKey?: keyof T
}

/**
 * 默认子节点字段推断。
 */
export type DefaultChildrenKey<T> = 'children' extends keyof T ? 'children' : keyof T

/**
 * 树映射工具的配置。
 */
export interface TreeMapConfig<T = any, K extends keyof T = DefaultChildrenKey<T>> {
  /**
   * 包含子节点的字段，默认 `children`。
   */
  childrenKey?: K
}
