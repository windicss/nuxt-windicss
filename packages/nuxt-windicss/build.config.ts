import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    'src/index',
    { input: 'src/template/', outDir: 'dist/template', format: 'esm', declaration: false },
  ],
  externals: [
    '@windicss/plugin-utils',
    'consola',
    'pathe',
    'defu'
  ],
})
