import { ResolvedOptions } from '@windicss/plugin-utils'
import { Config } from 'windicss/types/interfaces'
import { File } from '@nuxt/content/types/content'
import { HookResult } from '@nuxt/kit'
import { WindiPluginUtils } from 'vite-plugin-windicss'
import { NuxtWindiOptions } from './interfaces'

// pollyfill @todo nuxt/kit export
type NuxtHookResult = Promise<void> | void

declare module '@nuxt/types' {
  interface NuxtConfig {
    windicss?: NuxtWindiOptions
  }
}

declare module '@nuxt/kit' {
  interface NuxtHooks {
    'windicss:options': (options: ResolvedOptions) => NuxtHookResult
    'windicss:config': (config: Config) => NuxtHookResult
    'windicss:utils': (utils: WindiPluginUtils) => NuxtHookResult

    // pollyfill for @nuxt/content
    'content:file:beforeParse': (md: File) => HookResult
  }
}
