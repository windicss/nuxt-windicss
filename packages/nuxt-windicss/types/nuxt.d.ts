import type { ResolvedOptions, WindiPluginUtils } from '@windicss/plugin-utils'
import type { Config } from 'windicss/types/interfaces'
import type { File } from '@nuxt/content/types/content'
import type { NuxtWindiOptions } from '../src/interfaces'

// pollyfill @todo nuxt/kit export
type NuxtHookResult = Promise<void> | void

declare module '@nuxt/types' {
  interface NuxtConfig {
    windicss?: NuxtWindiOptions
  }
}

declare module '@nuxt/kit' {
  interface NuxtConfig {
    windicss?: NuxtWindiOptions
  }
  interface NuxtHooks {
    'windicss:options': (options: ResolvedOptions) => NuxtHookResult
    'windicss:config': (config: Config) => NuxtHookResult
    'windicss:utils': (utils: WindiPluginUtils) => NuxtHookResult

    // pollyfill for @nuxt/content
    'content:file:beforeParse': (md: File) => NuxtHookResult
  }
}
