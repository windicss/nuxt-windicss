import { NuxtConfig } from '@nuxt/types'
import nuxtBuildOptimisations from '../../../src'

const config : NuxtConfig = {
  target: 'static',
  modern: 'client',
  buildModules: [
    '@nuxt/typescript-build',
    nuxtBuildOptimisations
  ]
}

export default config
