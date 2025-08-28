import React from 'react'

/**
 * React.forwardRef() 简写方法,泛型T表示组件类型(component type)或元素类型(element type),
 * 泛型E表示props类型
 *
 * @param renderFunction 渲染函数
 * @returns React.forwardRef(renderFunction) 转发之后的组件
 */
export function withRef<
  T extends React.ComponentType<any> | keyof HTMLElementTagNameMap,
  E = {},
>(
  renderFunction: React.ForwardRefRenderFunction<
    React.ElementRef<T>,
    E & Omit<React.ComponentPropsWithoutRef<T>, keyof E>
  >,
) {
  return React.forwardRef(renderFunction)
}
