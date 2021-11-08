import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  cjsBridge: true,
  entries: [
    'src/module',
    { input: 'src/template/', outDir: 'dist/template', format: 'esm', declaration: false },
  ],
  externals: [
    '@nuxt/kit',
    '@nuxt/kit-edge',
    '@windicss/plugin-utils',
    'consola',
    'pathe',
    'defu',
  ],
})
