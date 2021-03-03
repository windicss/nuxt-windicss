import { NuxtConfig } from '@nuxt/types'
import nuxtBuildOptimisations from '../../../src'

const config : NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    nuxtBuildOptimisations
  ]
}

export default config
