# 集合与树

集合工具分为两类：数组工具用于索引、排序、差异比较和扁平数据建树；树工具用于遍历、查找、路径、叶子节点、线性化和树差异比较。所有方法都保持框架无关，可在 Node.js、浏览器、Vue 和 React 项目中直接使用。

```ts
import {
  depth,
  diffArray,
  diffTree,
  fastIndexedMap,
  fastStableSort,
  findNode,
  findParent,
  findPath,
  firstLeafPath,
  forEachTree,
  keyBy,
  lastLeafPath,
  leaves,
  mapTree,
  listToTree,
  treeToList,
  treeToSet,
  type ArrayDiffResult,
  type DiffArrayOptions,
  type DiffTreeOptions,
  type FastIndexedMap,
  type FastIndexedMapOptions,
  type FastStableSortOptions,
  type ForEachTreeOptions,
  type ListToTreeOptions,
  type TreeConfig,
  type TreeDiffResult,
  type TreeVisitOrder,
} from '@zhouchengfeng/okay/coll'
```

## 数组 API

| 方法             | 类型签名                                                                                                                                                 | 适合场景                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `keyBy`          | `<T, V = T>(array: T[], keyMapper: (item: T) => PropertyKey, valueMapper?: (item: T) => V) => Record<PropertyKey, T \| V>`                               | 将数组按业务 key 转成对象。                        |
| `diffArray`      | `<T, Id extends PropertyKey = PropertyKey>(oldArray: readonly T[], newArray: readonly T[], options?: DiffArrayOptions<T, Id>) => ArrayDiffResult<T, Id>` | 比较两个实体数组的新增、删除、内容变化和位置变化。 |
| `fastIndexedMap` | `<T, Id, Group>(array: readonly T[], keyOrConfig: keyof T \| ((item: T) => Id) \| FastIndexedMapOptions<T, Id, Group>) => FastIndexedMap<T, Id, Group>`  | 高频按 id 查找、更新、删除，并可维护分组索引。     |
| `fastStableSort` | `<T>(array: readonly T[], selectorOrCompare: ((item: T, index?: number) => number) \| ((a: T, b: T) => number), options?: FastStableSortOptions) => T[]` | 稳定排序；低基数数字 key 会自动走计数排序快路径。  |
| `listToTree`     | `<T>(array: readonly T[], config?: ListToTreeOptions<T>) => T[]`                                                                                         | 将带父级标识的扁平数组转换为树。                   |

## keyBy

`keyBy` 使用 mapper 函数生成对象 key。多个元素生成相同 key 时，后面的元素会覆盖前面的元素，这和主流工具库的 `keyBy` 行为一致。

```ts
const users = [
  { id: 'u1', name: 'Alice', role: 'admin' },
  { id: 'u2', name: 'Bob', role: 'user' },
]

const byId = keyBy(users, (user) => user.id)
// {
//   u1: { id: 'u1', name: 'Alice', role: 'admin' },
//   u2: { id: 'u2', name: 'Bob', role: 'user' },
// }

const roleById = keyBy(
  users,
  (user) => user.id,
  (user) => user.role,
)
// { u1: 'admin', u2: 'user' }
```

## diffArray

`diffArray` 适合比较有稳定身份标识的数组，例如接口返回的实体列表、配置项列表或表格行。默认会读取对象的 `id` 字段；如果数组项不是对象，且本身是 `string | number | symbol`，会把数组项自身作为唯一标识。

```ts
const oldUsers = [
  { id: 1, name: 'Alice', role: 'user' },
  { id: 2, name: 'Bob', role: 'admin' },
]

const newUsers = [
  { id: 2, name: 'Bob', role: 'owner' },
  { id: 3, name: 'Carol', role: 'user' },
]

const diff = diffArray(oldUsers, newUsers)

diff.added.map((item) => item.id)
// [3]

diff.removed.map((item) => item.id)
// [1]

diff.updated[0]
// {
//   id: 2,
//   oldIndex: 1,
//   index: 0,
//   oldItem: { id: 2, name: 'Bob', role: 'admin' },
//   newItem: { id: 2, name: 'Bob', role: 'owner' },
//   valueChanged: true,
//   indexChanged: true,
// }
```

自定义唯一标识和相等判断：

```ts
const result = diffArray(oldUsers, newUsers, {
  idKey: (user) => user.id,
  isEqual: (oldUser, newUser) => oldUser.role === newUser.role,
})
```

关键返回类型：

```ts
interface ArrayDiffResult<T, Id extends PropertyKey> {
  added: Array<{ id: Id; index: number; item: T }>
  removed: Array<{ id: Id; index: number; item: T }>
  updated: Array<{
    id: Id
    oldIndex: number
    index: number
    oldItem: T
    newItem: T
    valueChanged: boolean
    indexChanged: boolean
  }>
}
```

## fastIndexedMap

`fastIndexedMap` 内部维护 `Map` 索引，适合在表格、缓存、实体仓库中频繁按 id 读取和局部更新。`getGroup`、`values` 会返回新数组，便于作为不可变输出交给视图层。

```ts
const index = fastIndexedMap(
  [
    { id: 1, groupId: 'frontend', name: 'Alice' },
    { id: 2, groupId: 'backend', name: 'Bob' },
  ],
  {
    key: 'id',
    groupKey: 'groupId',
  },
)

index.get(1)
// { id: 1, groupId: 'frontend', name: 'Alice' }

index.getGroup('frontend')
// [{ id: 1, groupId: 'frontend', name: 'Alice' }]

index.update(1, { name: 'Alicia' })
index.add({ id: 3, groupId: 'frontend', name: 'Carol' })
index.delete(2)

index.values().map((item) => item.name)
// ['Alicia', 'Carol']
```

## fastStableSort

`fastStableSort` 不会修改源数组。传入一元函数时默认按数字 key 排序；传入二元函数时按标准 compare 函数排序。如果 key 都是 `0..maxKey` 范围内的小整数，会使用稳定计数排序。

```ts
const tasks = [
  { id: 1, priority: 2, title: 'write docs' },
  { id: 2, priority: 0, title: 'fix build' },
  { id: 3, priority: 1, title: 'review types' },
]

const sorted = fastStableSort(tasks, (task) => task.priority, {
  maxKey: 2,
})

sorted.map((task) => task.id)
// [2, 3, 1]
```

使用 compare 函数：

```ts
const byTitle = fastStableSort(tasks, (left, right) => left.title.localeCompare(right.title))

byTitle.map((task) => task.title)
// ['fix build', 'review types', 'write docs']
```

## listToTree

`listToTree` 会浅拷贝每个节点，并在 `childrenKey` 下创建子节点数组。找不到父节点的项目会被提升为根节点，避免数据丢失。

`config` 支持 `idKey`、`parentIdKey`、`childrenKey` 和 `rootParentValue`。这些字段只用于控制建树规则，不会修改源数组节点。

返回类型保持为 `T[]`，不会强行扩展调用方的业务类型。如果需要在 TypeScript 中直接访问 `children` 或自定义子节点字段，请在业务 interface 上声明对应的可选字段。

```ts
const list = [
  { id: 1, parentId: null, title: 'root' },
  { id: 2, parentId: 1, title: 'settings' },
  { id: 3, parentId: 1, title: 'profile' },
]

const tree = listToTree(list, {
  idKey: 'id',
  parentIdKey: 'parentId',
  childrenKey: 'children',
  rootParentValue: null,
})

tree[0].children.map((node) => node.title)
// ['settings', 'profile']
```

## 树 API

| 方法            | 类型签名                                                                                                                    | 适合场景                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `forEachTree`   | `<T>(tree: T[], visitor: (node: T, level: number, parent: T \| null) => void, options?: ForEachTreeOptions) => void`        | 前序或后序遍历整棵树。                       |
| `findNode`      | `<T>(tree: T[], targetId: string \| number, config?: TreeConfig<T>) => T \| null`                                           | 根据节点 id 查找第一个匹配节点。             |
| `findParent`    | `<T>(tree: T[], targetId: string \| number, config?: TreeConfig<T>) => T \| null`                                           | 根据节点 id 查找父节点。                     |
| `findPath`      | `<T>(tree: T[], targetId: string \| number, config?: TreeConfig<T>) => T[]`                                                 | 返回从根节点到目标节点的一条路径。           |
| `depth`         | `<T>(tree: T[], childrenKey?: string) => number`                                                                            | 计算树最大深度，根节点深度为 `1`。           |
| `leaves`        | `<T>(tree: T[], childrenKey?: string) => T[]`                                                                               | 收集所有叶子节点。                           |
| `firstLeafPath` | `<T>(tree: T[], childrenKey?: string) => T[]`                                                                               | 返回第一条从根到叶子的路径。                 |
| `lastLeafPath`  | `<T>(tree: T[], childrenKey?: string) => T[]`                                                                               | 返回最后一条从根到叶子的路径。               |
| `mapTree`       | `<T, U, K>(tree: T[], mapper: (node: T) => U \| null, config?: TreeMapConfig<T, K>) => U[]`                                 | 映射树结构，并允许过滤当前节点。             |
| `treeToList`    | `<T>(tree: T[], childrenKey?: string) => T[]`                                                                               | 按前序遍历顺序将树转为数组。                 |
| `treeToSet`     | `<T>(tree: T[], childrenKey?: string) => Set<T>`                                                                            | 按前序遍历顺序将树转为 `Set`。               |
| `diffTree`      | `<T, Id>(oldTree: readonly T[], newTree: readonly T[], options?: DiffTreeOptions<T, Id, keyof T>) => TreeDiffResult<T, Id>` | 比较两棵树的新增、删除、内容变化和路径变化。 |

示例数据：

```ts
const tree = [
  {
    id: 1,
    title: 'root',
    children: [
      { id: 2, title: 'settings' },
      { id: 3, title: 'profile', children: [{ id: 4, title: 'avatar' }] },
    ],
  },
]
```

## forEachTree

`forEachTree` 使用显式栈遍历，不依赖递归调用，因此深树不容易触发调用栈溢出。`level` 从 `0` 开始，根节点的 `parent` 为 `null`。

```ts
const ids: number[] = []

forEachTree(tree, (node, level, parent) => {
  ids.push(node.id)
  parent?.id
  level
})

ids
// [1, 2, 3, 4]
```

后序遍历：

```ts
const postOrder: number[] = []

forEachTree(
  tree,
  (node) => {
    postOrder.push(node.id)
  },
  { order: 'post' satisfies TreeVisitOrder },
)

postOrder
// [2, 4, 3, 1]
```

## findNode

`findNode` 根据 `targetId` 查找第一个 id 匹配的节点。匹配时会把节点 id 和目标 id 转成字符串比较，因此 `1` 与 `'1'` 会被视为同一个 id。

```ts
findNode(tree, 3)?.title
// 'profile'

findNode(tree, 999)
// null
```

自定义 id 字段和子节点字段：

```ts
const customTree = [{ key: 'root', nodes: [{ key: 'child', title: 'child node' }] }]

findNode(customTree, 'child', {
  idKey: 'key',
  childrenKey: 'nodes',
})?.title
// 'child node'
```

## findParent

`findParent` 返回目标节点的父节点。目标节点是根节点或不存在时返回 `null`。

```ts
findParent(tree, 4)?.id
// 3

findParent(tree, 1)
// null
```

## findPath

`findPath` 返回从根节点到目标节点的一条路径，数组包含目标节点本身。未找到目标节点时返回空数组。

```ts
findPath(tree, 4).map((node) => node.id)
// [1, 3, 4]

findPath(tree, 999)
// []
```

## depth

`depth` 计算树的最大节点深度。空树返回 `0`，只有根节点时返回 `1`。

```ts
depth(tree)
// 3

depth([{ id: 1 }])
// 1

depth([])
// 0
```

## leaves

`leaves` 收集所有叶子节点。子节点字段缺失、不是数组或为空数组时，该节点都会被视为叶子节点。

```ts
leaves(tree).map((node) => node.id)
// [2, 4]
```

## firstLeafPath

`firstLeafPath` 从第一个根节点开始，每层都选择第一个子节点，直到叶子节点。

```ts
firstLeafPath(tree).map((node) => node.id)
// [1, 2]
```

## lastLeafPath

`lastLeafPath` 从最后一个根节点开始，每层都选择最后一个子节点，直到叶子节点。

```ts
lastLeafPath(tree).map((node) => node.id)
// [1, 3, 4]
```

## mapTree

`mapTree` 会把源树映射成新树。mapper 返回 `null` 时会过滤当前节点，但它的子节点不会被直接丢弃，而是挂到最近的已映射祖先节点下。

```ts
const options = mapTree(tree, (node) => ({
  label: node.title,
  value: node.id,
}))

options[0].children[1]
// { label: 'profile', value: 3, children: [...] }
```

过滤当前节点并保留后代：

```ts
const withoutProfile = mapTree(tree, (node) => {
  if (node.id === 3) return null
  return { id: node.id, title: node.title }
})

withoutProfile[0].children.map((node) => node.id)
// [2, 4]
```

## treeToList

`treeToList` 按前序遍历顺序返回所有节点。返回数组保留源树中的原始对象引用，不会克隆节点，也不会移除 `children` 字段。

```ts
const list = treeToList(tree)

list.map((node) => node.id)
// [1, 2, 3, 4]

list[0] === tree[0]
// true
```

## treeToSet

`treeToSet` 和 `treeToList` 遍历顺序一致，但返回 `Set`，适合需要快速判断节点引用是否存在的场景。

```ts
const set = treeToSet(tree)

set.has(tree[0])
// true
```

## diffTree

`diffTree` 默认使用 `id` 作为唯一标识、`children` 作为子节点字段。节点内容比较会忽略子节点字段，避免子树变化误判父节点内容变化；同一个节点的路径变化也会进入 `updated`。

```ts
const oldTree = [{ id: 'a', title: 'Old', children: [{ id: 'b', title: 'Child' }] }]

const newTree = [{ id: 'a', title: 'New', children: [{ id: 'c', title: 'Added' }] }]

const result = diffTree(oldTree, newTree)

result.added.map((item) => item.id)
// ['c']

result.removed.map((item) => item.id)
// ['b']

result.updated[0].valueChanged
// true
```

关键返回类型：

```ts
interface TreeDiffResult<T, Id extends PropertyKey> {
  added: Array<{ id: Id; path: Id[]; node: T }>
  removed: Array<{ id: Id; path: Id[]; node: T }>
  updated: Array<{
    id: Id
    path: Id[]
    oldPath: Id[]
    oldNode: T
    newNode: T
    valueChanged: boolean
    pathChanged: boolean
  }>
}
```
