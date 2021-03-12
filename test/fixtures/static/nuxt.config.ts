import { NuxtConfig } from '@nuxt/types'
import nuxtWindicssModule from '../../../src'

const config : NuxtConfig = {
  target: 'static',
  modern: 'client',
  buildModules: [
    nuxtWindicssModule
  ]
}

export default config
