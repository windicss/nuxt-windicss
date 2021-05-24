import { NuxtConfig } from '@nuxt/types'
import nuxtWindicssModule from '../../../dist'
// @ts-ignore
import themeModule from './theme.config.js'

const config: NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    nuxtWindicssModule,
    themeModule,
  ],
  css: [
    '@/css/main.scss',
  ],
  components: true,
}

export default config
