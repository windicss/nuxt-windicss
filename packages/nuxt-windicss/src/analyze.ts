import { createApp, fromNodeMiddleware, toNodeListener } from 'h3'
import { ApiMiddleware } from 'windicss-analysis'
import { listen } from 'listhen'
import { dirname, join } from 'pathe'
import sirv from 'sirv'
import { resolveModule } from '@nuxt/kit'
import type { UserOptions, WindiPluginUtils } from '@windicss/plugin-utils'
import defu from 'defu'
import type { AnalyzeOptions } from './types'

/**
 * Starts a h3 app via listen that serves the windicss-analysis application.
 */
export async function analyze(runtime: { windiOptions: UserOptions; utils: WindiPluginUtils }, options: AnalyzeOptions = {}) {
  // options is "true", convert to an object
  if (typeof options === 'boolean')
    options = {}
  const resolvedOptions = defu(options, {
    server: {
      port: 3330,
      showURL: false,
    },
  })

  const app = createApp()

  app.use('/api', fromNodeMiddleware(ApiMiddleware(runtime.windiOptions, { utils: runtime.utils, ...resolvedOptions.analysis })))

  app.use(
    fromNodeMiddleware(sirv(
      join(dirname(resolveModule('windicss-analysis')), 'app'),
      { dev: true, single: true },
    )),
  )

  return await listen(toNodeListener(app), resolvedOptions.server)
}
