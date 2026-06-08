import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type UserConfig } from 'tsdown'

const rootDir = dirname(fileURLToPath(import.meta.url))

const shared: UserConfig = {
  clean: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  dts: true,
  failOnWarn: true,
  fixedExtension: true,
  format: 'esm',
  minify: true,
  platform: 'neutral',
  report: true,
  sourcemap: false,
  tsconfig: resolve(rootDir, 'tsconfig.json'),
  target: 'es2022',
  treeshake: true,
}

const packageConfig = (
  name: string,
  directory: string,
  extra: Partial<UserConfig> = {},
): UserConfig => ({
  ...shared,
  entry: {
    index: resolve(rootDir, directory, 'src/index.ts'),
  },
  name,
  outDir: resolve(rootDir, directory, 'dist'),
  ...extra,
})

export default defineConfig([
  packageConfig('@zhouchengfeng/okay-core', 'packages/core', {
    entry: {
      index: resolve(rootDir, 'packages/core/src/index.ts'),
      async: resolve(rootDir, 'packages/core/src/async/index.ts'),
      coll: resolve(rootDir, 'packages/core/src/coll/index.ts'),
      date: resolve(rootDir, 'packages/core/src/date/index.ts'),
      file: resolve(rootDir, 'packages/core/src/file/index.ts'),
      is: resolve(rootDir, 'packages/core/src/is/index.ts'),
      number: resolve(rootDir, 'packages/core/src/number/index.ts'),
      string: resolve(rootDir, 'packages/core/src/string/index.ts'),
    },
  }),
  packageConfig('@zhouchengfeng/okay-vue', 'packages/vue', {
    deps: { skipNodeModulesBundle: true, neverBundle: ['vue'] },
  }),
  packageConfig('@zhouchengfeng/okay-react', 'packages/react', {
    deps: { skipNodeModulesBundle: true, neverBundle: ['react', 'react-dom'] },
  }),
])
