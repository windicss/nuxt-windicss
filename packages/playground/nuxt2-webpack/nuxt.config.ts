import { NuxtConfig } from '@nuxt/types'
// @ts-ignore
import themeModule from './theme.config.js'

const config: NuxtConfig = {
  target: 'static',
  modern: true,
  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-windicss',
    themeModule,
  ],
  windicss: {
    analyze: true
  },
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
