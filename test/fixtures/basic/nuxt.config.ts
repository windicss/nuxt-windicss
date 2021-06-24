import { NuxtConfig } from '@nuxt/types'
import nuxtWindicssModule from '../../../src'
// @ts-ignore
import themeModule from './theme.config.js'

const config: NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    nuxtWindicssModule,
    themeModule,
  ],
  css: [
    '@/css/main.css',
  ],
  build: {
    loaders: {
      css: {
        importLoaders: 3,
      }
    }
  },
  components: true,
}

export default config
