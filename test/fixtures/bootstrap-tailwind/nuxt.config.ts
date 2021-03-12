import { NuxtConfig } from '@nuxt/types'
import windicssModule from '../../../src'

const config : NuxtConfig = {
  modules: [
    '@nuxtjs/auth',
    'bootstrap-vue/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/axios'
  ],
  buildModules: [
    '@nuxt/typescript-build',
    windicssModule
  ],

  components: true
}

export default config
