import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  clean: true,
  deps: {
    skipNodeModulesBundle: true,
    neverBundle: ['react', 'react-dom', 'vue'],
  },
  dts: true,
  entry: {
    index: resolve(rootDir, 'src/index.ts'),
    async: resolve(rootDir, 'src/async/index.ts'),
    coll: resolve(rootDir, 'src/coll/index.ts'),
    date: resolve(rootDir, 'src/date/index.ts'),
    file: resolve(rootDir, 'src/file/index.ts'),
    is: resolve(rootDir, 'src/is/index.ts'),
    number: resolve(rootDir, 'src/number/index.ts'),
    react: resolve(rootDir, 'src/react/index.ts'),
    string: resolve(rootDir, 'src/string/index.ts'),
    vue: resolve(rootDir, 'src/vue/index.ts'),
  },
  failOnWarn: true,
  fixedExtension: true,
  format: 'esm',
  minify: true,
  name: '@zhouchengfeng/okay',
  outDir: resolve(rootDir, 'dist'),
  platform: 'neutral',
  report: true,
  sourcemap: false,
  tsconfig: resolve(rootDir, 'tsconfig.json'),
  target: 'es2022',
  treeshake: true,
})
