# 文件

文件工具面向浏览器和类浏览器运行时，覆盖 Blob 读取、文件名解析、字节大小格式化和文件元信息整理。它们只依赖标准 Web API，不引入额外运行时依赖。

```ts
import {
  blobBase64,
  blobText,
  dataUrl,
  fileExt,
  fileInfo,
  fileParts,
  formatBytes,
  readBuffer,
  readJson,
  readText,
  type FileInfo,
  type FileInfoOptions,
  type FileLike,
  type FileLikeWithMeta,
  type FileParts,
  type FormatBytesOptions,
  type ReadTextOptions,
} from '@zhouchengfeng/okay-core'
```

## 类型

```ts
interface FileLike {
  name?: string
  size: number
  type?: string
}
```

## API 总览

| 方法          | 类型签名                                                          | 示例                                |
| ------------- | ----------------------------------------------------------------- | ----------------------------------- |
| `fileExt`     | `(fileName: string, withDot?: boolean) => string`                 | `fileExt('/assets/avatar.PNG?v=1')` |
| `fileParts`   | `(fileName: string) => FileParts`                                 | `fileParts('archive.tar.gz')`       |
| `formatBytes` | `(bytes: number, options?: FormatBytesOptions) => string`         | `formatBytes(1536)`                 |
| `fileInfo`    | `(file: FileLikeWithMeta, options?: FileInfoOptions) => FileInfo` | `fileInfo(file)`                    |
| `readText`    | `(blob: Blob, options?: ReadTextOptions) => Promise<string>`      | `await readText(file)`              |
| `readBuffer`  | `(blob: Blob) => Promise<ArrayBuffer>`                            | `await readBuffer(file)`            |
| `readJson`    | `<T = unknown>(blob: Blob, fallback?: T) => Promise<T>`           | `await readJson<User[]>(file, [])`  |
| `blobText`    | `(blob: Blob, options?: ReadTextOptions) => Promise<string>`      | `await blobText(file)`              |
| `blobBase64`  | `(blob: Blob) => Promise<string>`                                 | `await blobBase64(file)`            |
| `dataUrl`     | `(blob: Blob) => Promise<string>`                                 | `await dataUrl(file)`               |

## 文件名解析

```ts
fileExt('/assets/avatar.PNG?size=large')
// 'png'

fileExt('avatar.PNG', true)
// '.png'

fileParts('/assets/archive.tar.gz#download')
// { baseName: 'archive.tar.gz', name: 'archive.tar', extension: 'gz' }

fileParts('.env')
// { baseName: '.env', name: '.env', extension: '' }
```

## 文件大小和元信息

```ts
formatBytes(1536)
// '1.5 KiB'

formatBytes(1500, {
  base: 1000,
  decimals: 1,
})
// '1.5 KB'

fileInfo({
  name: '/assets/avatar.PNG',
  size: 1536,
  type: 'image/png',
  lastModified: 1717200000000,
})
// {
//   name: 'avatar',
//   baseName: 'avatar.PNG',
//   extension: 'png',
//   size: 1536,
//   sizeText: '1.5 KiB',
//   type: 'image/png',
//   lastModified: 1717200000000
// }
```

## Blob 读取

```ts
const text = await readText(new Blob(['okay']))
// 'okay'

const buffer = await readBuffer(new Blob(['okay']))
// ArrayBuffer

const json = await readJson<{ name: string }>(new Blob(['{"name":"okay"}']))
// { name: 'okay' }

const fallback = await readJson(new Blob(['invalid json']), { name: 'fallback' })
// { name: 'fallback' }
```

## Blob 转换

```ts
await blobText(new Blob(['okay']))
// 'okay'

await blobBase64(new Blob(['okay']))
// 'b2theQ=='

await dataUrl(new Blob(['okay'], { type: 'text/plain' }))
// 'data:text/plain;base64,b2theQ=='
```

## 选择建议

| 场景                     | 推荐                    |
| ------------------------ | ----------------------- |
| 只需要扩展名             | `fileExt`               |
| 需要文件名、主名和扩展名 | `fileParts`             |
| 展示文件大小             | `formatBytes`           |
| 构建上传前摘要           | `fileInfo`              |
| 读取文本或 JSON          | `readText`、`readJson`  |
| 预览图片或传输 base64    | `dataUrl`、`blobBase64` |
