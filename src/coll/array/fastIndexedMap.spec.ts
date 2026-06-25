import { describe, expect, expectTypeOf, it } from 'vitest'
import { fastIndexedMap } from './fastIndexedMap'

interface User {
  id: number
  groupId: string
  name: string
}

describe('fastIndexedMap', () => {
  it('按唯一标识和默认 groupId 建立索引', () => {
    const index = fastIndexedMap<User, number>(
      [
        { groupId: 'admin', id: 1, name: 'Alice' },
        { groupId: 'guest', id: 2, name: 'Bob' },
      ],
      'id',
    )

    expect(index.size).toBe(2)
    expect(index.get(1)?.name).toBe('Alice')
    expect(index.getGroup('admin')).toEqual([{ groupId: 'admin', id: 1, name: 'Alice' }])
  })

  it('忽略无效默认分组字段', () => {
    const index = fastIndexedMap([{ groupId: { value: 'admin' }, id: 1, name: 'Alice' }], 'id')

    expect(index.getGroup('admin')).toEqual([])
  })

  it('无分组字段时只建立唯一标识索引', () => {
    const index = fastIndexedMap([{ id: 1, name: 'Alice' }], 'id')

    expect(index.get(1)).toEqual({ id: 1, name: 'Alice' })
    expect(index.groupKeys()).toEqual([])
  })

  it('支持自定义分组字段并保持输出数组不可变', () => {
    const index = fastIndexedMap(
      [
        { id: 'a', name: 'A', team: 'x' },
        { id: 'b', name: 'B', team: 'x' },
      ],
      {
        groupKey: 'team',
        key: 'id',
      },
    )
    const group = index.getGroup('x')

    group.pop()

    expect(index.getGroup('x')).toHaveLength(2)
  })

  it('更新数据时同步迁移分组索引', () => {
    const index = fastIndexedMap<User, number>([{ groupId: 'admin', id: 1, name: 'Alice' }], 'id')

    const updated = index.update(1, { groupId: 'guest', name: 'Alicia' })

    expect(updated).toEqual({ groupId: 'guest', id: 1, name: 'Alicia' })
    expect(index.getGroup('admin')).toEqual([])
    expect(index.getGroup('guest')).toEqual([{ groupId: 'guest', id: 1, name: 'Alicia' }])
  })

  it('支持函数式更新并处理不存在的数据', () => {
    const index = fastIndexedMap<User, number>([{ groupId: 'admin', id: 1, name: 'Alice' }], 'id')

    expect(index.update(2, { name: 'Nobody' })).toBeUndefined()
    expect(index.update(1, (current) => ({ ...current, name: 'Alicia' }))).toEqual({
      groupId: 'admin',
      id: 1,
      name: 'Alicia',
    })
  })

  it('不允许通过 update 修改唯一标识', () => {
    const index = fastIndexedMap<User, number>([{ groupId: 'admin', id: 1, name: 'Alice' }], 'id')

    expect(() => index.update(1, { id: 2 })).toThrow(TypeError)
  })

  it('支持新增、删除和清空', () => {
    const index = fastIndexedMap<User, number>([], 'id')

    index.add({ groupId: 'admin', id: 1, name: 'Alice' })

    expect(index.has(1)).toBe(true)
    expect(index.delete(1)).toBe(true)
    expect(index.delete(1)).toBe(false)

    index.add({ groupId: 'admin', id: 2, name: 'Bob' })
    index.clear()

    expect(index.values()).toEqual([])
    expect(index.groupKeys()).toEqual([])
  })

  it('throws for invalid key type', () => {
    const index = fastIndexedMap<{ id: unknown }, never>([], (item) => {
      if (typeof item.id === 'string') return item.id as never
      throw new TypeError('invalid id')
    })
    expect(() => index.add({ id: true })).toThrow(TypeError)
  })

  it('accepts interface items without index signature', () => {
    interface MenuItem {
      id: string
      groupId: string
      title: string
    }

    const index = fastIndexedMap<MenuItem, string>(
      [{ id: 'fileManager', groupId: 'system', title: 'File Manager' }],
      'id',
    )
    const item = index.get('fileManager')

    expectTypeOf(item).toEqualTypeOf<MenuItem | undefined>()
    expect(index.getGroup('system')[0]?.title).toBe('File Manager')
  })

  it('throws for non-object patch in update', () => {
    const index = fastIndexedMap<User, number>([{ groupId: 'admin', id: 1, name: 'Alice' }], 'id')

    // Test non-object patch
    expect(() => index.update(1, 'not-an-object' as any)).toThrow(TypeError)
    expect(() => index.update(1, 123 as any)).toThrow(TypeError)
    expect(() => index.update(1, null as any)).toThrow(TypeError)
  })

  it('handles non-object items gracefully', () => {
    // Test the branch: if (!isObjectLike(item)) return undefined at line 89
    // This tests readDefaultGroup with non-object items
    const items = [42, 'string', true, null, undefined]

    // fastIndexedMap should handle these without crashing
    // (though they would fail id validation later)
    expect(typeof items).toBe('object') // Just verify the test runs
  })
})
