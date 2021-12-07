import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    cjsBridge: true,
    emitCJS: false,
  },
  entries: [
    { builder: 'rollup', input: 'src/module' },
    { input: 'src/template/', outDir: 'dist/template', format: 'esm', declaration: false },
  ],
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    '@nuxt/kit-edge',
    '@windicss/plugin-utils',
    'consola',
    'pathe',
    'defu',
  ],
})
