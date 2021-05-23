import { NuxtConfig } from '@nuxt/types'
import windicssModule from '../../../dist'

const config: NuxtConfig = {
  buildModules: [
    'nuxt-vite',
    windicssModule,
  ],
  components: true,
}

export default config
