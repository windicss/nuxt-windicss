import { defineNuxtConfig } from 'nuxt3'
import nuxtWindicssModule from '../../dist'

export default defineNuxtConfig({
  css: [
    '@/css/main.css',
    '@/css/global.sass',
  ],
  buildModules: [
    nuxtWindicssModule,
  ],
})
