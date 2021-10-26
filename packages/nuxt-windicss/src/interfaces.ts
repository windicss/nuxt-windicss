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
   * Reuse existing utils if exists
   */
  utils?: WindiPluginUtils
  /**
   * The path where the virtual module should be injected. By default this is the project root but for
   * some projects (such as craco), specifying the directory is needed.
   *
   * Only applicable for webpack plugin.
   */
  virtualModulePath?: string
  /**
  * Starts a server for Windi Analyze.
  */
  analyze?: AnalyzeOptions
  /**
   * Shows nuxt-windicss and windicss versions on build:before hook.
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

declare module '@nuxt/kit-edge' {
  interface NuxtConfig {
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

// @ts-ignore
declare module '@nuxt/kit' {
  interface NuxtConfig {
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
