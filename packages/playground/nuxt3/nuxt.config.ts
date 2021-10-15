import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  mode: 'static',
  static: true,
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
