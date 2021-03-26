import { NuxtConfig } from '@nuxt/types'
import windicss from '../../../src'

const config: NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    windicss,
  ],

  windicss: {
    viewer: true,
  },
}

export default config
