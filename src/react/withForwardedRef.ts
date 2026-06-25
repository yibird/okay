import { forwardRef } from 'react'

/**
 * 使用 `React.forwardRef` 包装渲染函数。
 *
 * 该方法保留 React 的泛型组件类型，并让包内 ref 工具的命名保持统一。
 * 适合在库代码中暴露需要转发 ref 的组件工厂。
 *
 * @param render 接收 props 和 ref 的 forward-ref 渲染函数。
 * @returns `React.forwardRef` 生成的组件。
 */
export function withForwardedRef<T, P = {}>(render: Parameters<typeof forwardRef<T, P>>[0]) {
  return forwardRef<T, P>(render)
}
