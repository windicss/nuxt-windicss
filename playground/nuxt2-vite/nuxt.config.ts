import type { NuxtConfig } from '@nuxt/types'
// @ts-ignore
import themeModule from './theme.config.js'

const config: NuxtConfig = {
  buildModules: [
    'nuxt-vite',
    '@nuxt/typescript-build',
    'nuxt-windicss',
    themeModule,
  ],
  css: [
    '@/css/main.css',
    '@/css/global.scss',
  ],
  windicss: {
    analyze: true,
  },
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
