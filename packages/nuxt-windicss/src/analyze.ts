import { createApp } from 'h3'
import { ApiMiddleware } from 'windicss-analysis'
import { listen } from 'listhen'
import { dirname, join } from 'pathe'
import sirv from 'sirv'
import { resolveModule } from '@nuxt/kit'
import { WindiPluginUtils } from '@windicss/plugin-utils'
import defu from 'defu'
import { AnalyzeOptions, NuxtWindiOptions } from './interfaces'

/**
 * Starts a h3 app via listen that serves the windicss-analysis application.
 */
export async function analyze(runtime: { windiOptions: NuxtWindiOptions; utils: WindiPluginUtils }, options: AnalyzeOptions = {}) {
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

  app.use('/api', ApiMiddleware(runtime.windiOptions, { utils: runtime.utils, ...resolvedOptions.analysis }))

  app.use(
    sirv(
      join(dirname(resolveModule('windicss-analysis')), 'app'),
      { dev: true, single: true },
    ),
  )

  return await listen(app, resolvedOptions.server)
}
