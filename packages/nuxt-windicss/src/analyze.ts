import { createApp } from 'h3'
import { ApiMiddleware } from 'windicss-analysis'
import { listen } from 'listhen'
import { dirname, join } from 'pathe'
import sirv from 'sirv'
import { resolveModule } from '@nuxt/kit'

export async function analyze(options: any) {
  const app = createApp()

  app.use('/api', ApiMiddleware(options.windiOptions, { utils: options.utils }))

  app.use(
    sirv(
      join(dirname(resolveModule('windicss-analysis')), 'app'),
      { dev: true, single: true },
    ),
  )

  const server = await listen(app, { port: 3330, showURL: false })
  return server.url
}
