import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  css: [
    '@/css/main.css',
  ],
  components: true,
  windicss: {
    analyze: false,
  },
  modules: [
    'nuxt-windicss',
  ],
})
