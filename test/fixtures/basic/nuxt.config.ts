import { NuxtConfig } from '@nuxt/types'
import nuxtWindicssModule from '../../../src'
// @ts-ignore
import themeModule from './theme.config.js'

const config : NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    nuxtWindicssModule,
    themeModule,
  ]
}

export default config
