import { NuxtConfig } from '@nuxt/types'
import windicssModule from '../../../src'

const config : NuxtConfig = {
  buildModules: [
    'nuxt-vite',
    windicssModule
  ]
}

export default config
