import { ModuleOptions } from './types'

declare module '@nuxt/types' {
  interface NuxtConfig {
    windicss: ModuleOptions
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      nuxt: any
    }
  }
}
