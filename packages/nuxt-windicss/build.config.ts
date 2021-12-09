import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  entries: [
    { input: 'src/index' },
    { input: 'src/template/', outDir: 'dist/template', format: 'esm', declaration: false },
  ],
  externals: [
    '@nuxt/schema',
  ],
})
