import { NuxtWindiOptions } from './interfaces'

declare module '@nuxt/types' {
  interface NuxtConfig {
    windicss?: NuxtWindiOptions
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      nuxt: any
    }
  }
}
