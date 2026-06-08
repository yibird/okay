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
  minify: 'dce-only',
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
  packageConfig('@okay/core', 'packages/core', {
    entry: {
      index: resolve(rootDir, 'packages/core/src/index.ts'),
      date: resolve(rootDir, 'packages/core/src/date/index.ts'),
    },
  }),
  packageConfig('@okay/vue', 'packages/vue', {
    deps: { skipNodeModulesBundle: true, neverBundle: ['vue'] },
  }),
  packageConfig('@okay/react', 'packages/react', {
    deps: { skipNodeModulesBundle: true, neverBundle: ['react', 'react-dom'] },
  }),
])
