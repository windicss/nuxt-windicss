import { NuxtConfig } from '@nuxt/types'
import nuxtWindicssModule from '../../../dist'

const config : NuxtConfig = {
  target: 'static',
  modern: 'client',
  buildModules: [
    nuxtWindicssModule
  ]
}

export default config
