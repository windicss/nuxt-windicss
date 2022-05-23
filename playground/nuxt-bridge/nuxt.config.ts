// @ts-ignore
import themeModule from './theme.config.js'
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  target: 'static',
  buildModules: [
    'nuxt-windicss',
    'nuxt-schema-org',
    themeModule,
  ],
  css: [
    '@/css/main.css',
    '@/css/global.sass',
  ],
  windicss: {
    analyze: true
  },
  build: {
    loaders: {
      css: {
        importLoaders: 3,
      },
    },
    transpile: ['vue-demi', 'nuxt-schema-org']
  },
  components: true,
})
