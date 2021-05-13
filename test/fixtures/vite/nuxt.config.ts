import { NuxtConfig } from '@nuxt/types'
import windicssModule from '../../../dist'

const config: NuxtConfig = {
  buildModules: [
    'nuxt-vite',
    windicssModule,
  ],
  components: true,
  // @ts-ignore
  windicss: {
    config: __dirname + '/windi.config.js'
  }
}

export default config
