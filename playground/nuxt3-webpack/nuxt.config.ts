import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  mode: 'static',
  static: true,
  builder: 'webpack',
  css: [
    '@/css/main.css',
    // '@/css/global.scss',
  ],
  windicss: {
    analyze: {
      server: {
        port: 4444,
        open: true,
      }
    },
  },
  buildModules: [
    'nuxt-windicss',
  ],
})
