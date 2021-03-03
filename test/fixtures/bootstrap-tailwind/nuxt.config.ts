import { NuxtConfig } from '@nuxt/types'
import nuxtBuildOptimisations from '../../../src'

const config : NuxtConfig = {
  modules: [
    '@nuxtjs/auth',
    'bootstrap-vue/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/axios'
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    nuxtBuildOptimisations
  ],

  buildOptimisations: {
    profile: 'risky'
  },

  components: true
}

export default config
