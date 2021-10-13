import { NuxtConfig } from '@nuxt/types'
import nuxtWindiCSSModule from '../../src'
// @ts-ignore
import themeModule from './theme.config.js'

const config: NuxtConfig = {
  buildModules: [
    'nuxt-vite',
    '@nuxt/typescript-build',
    nuxtWindiCSSModule,
    themeModule,
  ],
  css: [
    '@/css/main.css',
    '@/css/global.sass',
  ],
  build: {
    loaders: {
      css: {
        importLoaders: 3,
      },
    },
  },
  components: true,
}

export default config
