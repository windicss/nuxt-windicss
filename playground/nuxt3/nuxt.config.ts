import { defineNuxtConfig } from 'nuxt3'
import nuxtWindicssModule from '../../dist'

export default defineNuxtConfig({
  mode: 'static',
  static: true,
  css: [
    '@/css/main.css',
  ],
  buildModules: [
    nuxtWindicssModule,
  ],
})
