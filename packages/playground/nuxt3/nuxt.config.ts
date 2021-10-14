import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  mode: 'static',
  static: true,
  css: [
    '@/css/main.css',
    // '@/css/global.scss',
  ],
  buildModules: [
    'nuxt-windicss',
  ],
})
