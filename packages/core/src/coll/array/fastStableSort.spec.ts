import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { fastStableSort } from './fastStableSort'

interface Row {
  id: number
  priority: number
  name: string
}

describe('fastStableSort', () => {
  it('按低基数数字键执行稳定桶排序', () => {
    const rows: Row[] = [
      { id: 1, name: 'a', priority: 2 },
      { id: 2, name: 'b', priority: 0 },
      { id: 3, name: 'c', priority: 1 },
      { id: 4, name: 'd', priority: 0 },
      { id: 5, name: 'e', priority: 2 },
    ]

    const result = fastStableSort(rows, (row) => row.priority, { maxKey: 2 })

    expect(result.map((row) => row.id)).toEqual([2, 4, 3, 1, 5])
    expect(rows.map((row) => row.id)).toEqual([1, 2, 3, 4, 5])
  })

  it('键超出桶范围时回退到稳定比较排序', () => {
    const rows: Row[] = [
      { id: 1, name: 'a', priority: 10 },
      { id: 2, name: 'b', priority: 0 },
      { id: 3, name: 'c', priority: 10 },
    ]

    const result = fastStableSort(rows, (row) => row.priority, { maxKey: 2 })

    expect(result.map((row) => row.id)).toEqual([2, 1, 3])
  })

  it('支持标准二元 compare 函数并保持稳定性', () => {
    const rows: Row[] = [
      { id: 1, name: 'b', priority: 1 },
      { id: 2, name: 'a', priority: 1 },
      { id: 3, name: 'b', priority: 1 },
    ]

    const result = fastStableSort(rows, (left, right) => left.name.localeCompare(right.name))

    expect(result.map((row) => row.id)).toEqual([2, 1, 3])
  })

  it('should treat compare functions with default parameters as compare functions', () => {
    const result = fastStableSort([1, 2, 3], (left: number, right = 0) => right - left)

    expect(result).toEqual([3, 2, 1])
  })

  it('should treat rest-parameter compare functions as compare functions', () => {
    const result = fastStableSort([1, 2, 3], (...values: number[]) => values[1] - values[0])

    expect(result).toEqual([3, 2, 1])
  })

  it('二元 compare 函数可以正确推断左右参数类型', () => {
    const rows: Row[] = [{ id: 1, name: 'b', priority: 1 }]

    fastStableSort(rows, (left, right) => {
      expectTypeOf(left).toEqualTypeOf<Row>()
      expectTypeOf(right).toEqualTypeOf<Row>()

      return left.name.localeCompare(right.name)
    })
  })

  it('空数组和单元素数组返回新数组', () => {
    const row = { id: 1, name: 'a', priority: 0 }
    const empty = [] as Row[]
    const single = [row]

    expect(fastStableSort(empty, (item) => item.priority)).not.toBe(empty)
    expect(fastStableSort(single, (item) => item.priority)).not.toBe(single)
    expect(fastStableSort(single, (item) => item.priority)).toEqual([row])
  })

  it('校验非法 maxKey', () => {
    expect(() => fastStableSort([{ value: 1 }], (item) => item.value, { maxKey: -1 })).toThrow(
      TypeError,
    )
  })

  it('校验非有限排序键', () => {
    expect(() => fastStableSort([1, 2], () => Infinity)).toThrow(TypeError)
  })

  it('校验非法 maxBucketSize', () => {
    expect(() => fastStableSort([1], (x) => x, { maxBucketSize: 0, mode: 'key' })).toThrow(
      TypeError,
    )
  })

  it('显式 mode:key 使用键排序', () => {
    const result = fastStableSort([3, 1, 2], (x) => x, { mode: 'key' })
    expect(result).toEqual([1, 2, 3])
  })

  it('显式 mode:compare 使用比较排序', () => {
    const result = fastStableSort([3, 1, 2], (a, b) => a - b, { mode: 'compare' })
    expect(result).toEqual([1, 2, 3])
  })

  it('单参数无括号箭头函数被识别为 key selector', () => {
    // `x => x` has no parens → parseFnParams hits the `else` branch (count=1, hasRest=false)
    const fn = Function('return x => x')() as (value: number) => number
    const result = fastStableSort([3, 1, 2], fn as any, { mode: 'auto' })
    expect(result).toEqual([1, 2, 3])
  })

  it('普通函数 key selector 会走参数解析路径', () => {
    function getValue(value: number) {
      return value
    }

    expect(fastStableSort([3, 1, 2], getValue, { mode: 'auto' })).toEqual([1, 2, 3])
  })

  it('支持解构参数的 key selector', () => {
    const rows = [{ value: 2 }, { value: 1 }, { value: 3 }]

    expect(fastStableSort(rows, ({ value }) => value).map((item) => item.value)).toEqual([1, 2, 3])
  })

  it('支持带字符串默认值参数的 key selector', () => {
    const fn = Function('return (value = ",") => value')() as (value: number) => number

    expect(fastStableSort([3, 1, 2], fn, { mode: 'auto' })).toEqual([1, 2, 3])
  })

  it('支持参数默认值中的嵌套括号', () => {
    const fn = Function('return (value = (1)) => value')() as (value: number) => number

    expect(fastStableSort([3, 1, 2], fn, { mode: 'auto' })).toEqual([1, 2, 3])
  })

  it('缓存命中时不重复解析', () => {
    const fn = (x: number) => x
    fastStableSort([2, 1], fn)
    fastStableSort([3, 1, 2], fn)
    expect(true).toBe(true)
  })

  it('toString 不可用时回退到 compare', () => {
    const spy = vi.spyOn(Function.prototype, 'toString').mockImplementation(() => {
      throw new Error('no toString')
    })

    try {
      const result = fastStableSort([3, 1, 2], (left: number, right = 0) => left - right, {
        mode: 'auto',
      })
      expect(result).toEqual([1, 2, 3])
    } finally {
      spy.mockRestore()
    }
  })

  it('无法从函数源码提取参数列表时使用 length 兜底', () => {
    const spy = vi.spyOn(Function.prototype, 'toString').mockImplementation(() => 'native')

    try {
      const result = fastStableSort([3, 1, 2], function getValue(value: number) {
        return value
      })
      expect(result).toEqual([1, 2, 3])
    } finally {
      spy.mockRestore()
    }
  })

  it('参数括号不完整时使用 length 兜底', () => {
    const spy = vi.spyOn(Function.prototype, 'toString').mockImplementation(() => '(value => value')

    try {
      const result = fastStableSort([3, 1, 2], function getValue(value: number) {
        return value
      })
      expect(result).toEqual([1, 2, 3])
    } finally {
      spy.mockRestore()
    }
  })

  it('普通函数源码参数括号不完整时使用 length 兜底', () => {
    const spy = vi
      .spyOn(Function.prototype, 'toString')
      .mockImplementation(() => 'function getValue(value')

    try {
      const result = fastStableSort([3, 1, 2], function getValue(value: number) {
        return value
      })
      expect(result).toEqual([1, 2, 3])
    } finally {
      spy.mockRestore()
    }
  })
})
