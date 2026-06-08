# 开发指南

这份指南面向维护者和贡献者，说明本仓库的开发、测试、文档和发布前检查流程。Okay 的核心目标是类型安全、运行时性能、良好的开发体验和可维护的 API。

## 仓库结构

```txt
packages/
  core/   # 框架无关工具函数
  vue/    # Vue 3 composables 与 ref 工具
  react/  # React ref 工具
docs/     # VitePress 文档站
scripts/  # 基准测试和工程脚本
```

核心逻辑优先放在 `packages/core`。只有依赖 Vue 或 React 运行时的能力，才放在对应框架包。

## 常用命令

| 命令                  | 说明                            |
| --------------------- | ------------------------------- |
| `pnpm install`        | 安装工作区依赖。                |
| `pnpm run build`      | 构建所有包。                    |
| `pnpm run typecheck`  | 执行 TypeScript 类型检查。      |
| `pnpm run test:unit`  | 运行 Vitest 单元测试。          |
| `pnpm run test:bench` | 运行 Mitata 基准测试脚本。      |
| `pnpm run docs:dev`   | 启动 VitePress 文档开发服务器。 |
| `pnpm run docs:build` | 构建生产文档站。                |
| `pnpm run verify`     | 发布前综合检查。                |

## 新增工具方法

新增公开方法时，请按下面顺序处理：

1. 明确使用场景和命名，优先参考 lodash、remeda、radash、es-toolkit 的常见命名。
2. 在最合适的包里实现，框架无关逻辑放在 `core`。
3. 从对应 `index.ts` 导出函数和必要类型。
4. 添加单元测试，覆盖正常输入、边界输入和异常输入。
5. 如果方法性能敏感，补充或更新基准测试。
6. 在文档中补充用途、类型签名、参数说明、返回值和示例。

示例：

```ts
// packages/core/src/coll/array/example.ts
export function example<T>(items: readonly T[]): T[] {
  return [...items]
}
```

## 文档要求

公开 API 的文档需要达到“复制即可试”的标准。

| 内容     | 要求                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------- |
| 导入示例 | 只从包入口导入，例如 `@zhouchengfeng/okay-core`、`@zhouchengfeng/okay-vue`、`@zhouchengfeng/okay-react`。 |
| 类型签名 | 写出用户需要理解的泛型、参数和返回值。                                                                    |
| 参数说明 | 解释行为，而不是重复变量名。                                                                              |
| 返回值   | 对对象、元组、数组和错误结果写清结构。                                                                    |
| 示例     | 每个公开方法至少有一个对应示例。                                                                          |
| 边界行为 | 写清空值、无效输入、重复 key、找不到节点等情况。                                                          |

文档站基于 VitePress：

```bash
pnpm run docs:dev
pnpm run docs:build
```

## 测试策略

每个公开工具都应有单元测试。测试重点包括：

| 类型     | 示例                                          |
| -------- | --------------------------------------------- |
| 正常路径 | 常见业务输入能得到预期结果。                  |
| 边界输入 | 空数组、空树、空字符串、`null`、`undefined`。 |
| 异常输入 | 重复 id、无效日期、无效文件类型。             |
| 类型行为 | 类型守卫、泛型推导、返回值收窄。              |
| 性能风险 | 深树、大数组、高频格式化、并发任务。          |

运行单元测试：

```bash
pnpm run test:unit
```

## 性能基准

性能敏感方法需要用基准测试验证，而不是只凭直觉优化。适合基准测试的方法包括：

| 模块 | 方法                                                        |
| ---- | ----------------------------------------------------------- |
| 异步 | `parallel`、`batchSync`、`singleFlight`                     |
| 集合 | `diffArray`、`fastIndexedMap`、`fastStableSort`、`diffTree` |
| 数字 | `formatNumber`、`createNumberFormatter`                     |
| 文件 | `formatBytes`                                               |

运行基准：

```bash
pnpm run test:bench
```

## 发布前检查

提交发布前至少执行：

```bash
pnpm run docs:build
pnpm run verify
```

如果只修改文档，至少保证 `pnpm run docs:build` 通过。如果修改了源码或类型，需要额外运行 `pnpm run typecheck` 和 `pnpm run test:unit`。

## API 稳定性

公开 API 一旦进入文档，就应视为稳定承诺。删除、重命名或改变行为时，需要同时更新：

| 位置     | 内容                                     |
| -------- | ---------------------------------------- |
| 源码导出 | 移除旧导出，避免无意兼容层继续存在。     |
| 单元测试 | 删除旧 API 测试，补充新 API 行为。       |
| 文档     | 更新导入、签名、示例和迁移说明。         |
| README   | 如果 README 展示了该 API，也要同步修改。 |

命名优先选择清晰且常见的表达，例如 `findPath` 表示查找从根到目标节点的一条路径，`treeToList` 表示将树线性化为数组。
