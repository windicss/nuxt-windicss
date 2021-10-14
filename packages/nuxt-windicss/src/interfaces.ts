import type { Options } from 'windicss-webpack-plugin/dist/interfaces'

export type NuxtWindiOptions = Options & {
  /**
  * Starts a server for Windi Analyze.
  */
  analyze?: boolean
}
