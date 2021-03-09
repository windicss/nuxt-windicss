import { NuxtConfig } from '@nuxt/types'
import nuxtWindicssModule from '../../../src'

const config : NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    nuxtWindicssModule
  ]
}

export default config
