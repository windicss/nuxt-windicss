import type { Options } from 'windicss-webpack-plugin/dist/interfaces'

declare module '@nuxt/types' {
  interface NuxtConfig {
    windicss?: Options
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      nuxt: any
    }
  }
}
