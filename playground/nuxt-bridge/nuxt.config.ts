import nuxtWindiCSSModule from '../../dist'
// @ts-ignore
import themeModule from './theme.config.js'
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  target: 'static',
  buildModules: [
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
})
