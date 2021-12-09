import type { ResolvedOptions, WindiPluginUtils, UserOptions } from '@windicss/plugin-utils'
import type { Config } from 'windicss/types/interfaces'
import type { ListenOptions } from 'listhen'
import type { AnalysisOptions } from 'windicss-analysis'

export type AnalyzeOptions = true|false|{
  analysis?: AnalysisOptions
  server?: Partial<ListenOptions>
}

export type NuxtWindiOptions = UserOptions & {
  /**
   * Pass a pre-instantiated WindiPluginUtils instance to avoid duplicate scans if you're using the engine elsewhere.
   *
   * @default undefined
   */
  utils?: WindiPluginUtils

  /**
   * Launches Windi Analyze when in development mode.
   * @default false
   */
  analyze?: AnalyzeOptions

  /**
   * Shows nuxt-windicss and windicss versions on build:before hook.
   * @default true
   */
  displayVersionInfo?: boolean
}

// pollyfill @todo nuxt/kit export
type NuxtHookResult = Promise<void> | void

declare module '@nuxt/types' {
  interface NuxtConfig {
    windicss?: NuxtWindiOptions
  }
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    windicss?: NuxtWindiOptions
  }
  interface NuxtOptions {
    windicss?: NuxtWindiOptions
  }
  interface ConfigSchema {
    windicss?: NuxtWindiOptions
  }
  interface NuxtHooks {
    'windicss:options': (options: ResolvedOptions) => NuxtHookResult
    'windicss:config': (config: Config) => NuxtHookResult
    'windicss:utils': (utils: WindiPluginUtils) => NuxtHookResult

    // pollyfill for @nuxt/content
    'content:file:beforeParse': (md: {
      path: string
      extension: string
      data: any
    }) => NuxtHookResult
  }
}
