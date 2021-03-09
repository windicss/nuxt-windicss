import type { Module, NuxtOptions } from '@nuxt/types'
import type { Configuration as WebpackConfig } from 'webpack'
import type { ModuleOptions } from './types'
import { requireNuxtVersion } from './compatibility'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import { resolve } from 'upath'
import logger from './logger'
import { joinURL, withTrailingSlash } from 'ufo'
import chalk from 'chalk'
import defu from 'defu'
import { UserOptions } from '@windicss/plugin-utils'

const windicssModule: Module<ModuleOptions> = function (moduleOptions) {
  const nuxt = this.nuxt
  const nuxtOptions = this.nuxt.options as NuxtOptions

  const windicssOptions : UserOptions = {
    scan: {
      dirs: ['./'],
      exclude: ['.nuxt/**/*']
    }
  }
  const options = defu.arrayFn(moduleOptions, nuxt.options.tailwindcss, nuxt.options.windicss, {
    windicssOptions,
    viewer: nuxt.options.dev
  }) as ModuleOptions

  requireNuxtVersion(nuxt.constructor.version, '2.10')

  if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss')) {
    logger.error('Cannot use Windi CSS with tailwindcss. Please remove the `@nuxtjs/tailwindcss` module.')
    return
  }

  nuxt.hook('build:before', async () => {
    const { windicssOptions } = options
    await nuxt.callHook('windycss:config', windicssOptions)

    logger.debug('Post hook options', windicssOptions)

    this.extendBuild((config: WebpackConfig,) => {
      // allow users to override the windicss config
      // if they decided to return false - disabling windicss
      if (! config.plugins) {
        config.plugins = []
      }
      config.plugins.push(
          new WindiCSSWebpackPlugin(windicssOptions)
      )
    })
    // add plugin to import windi.css
    nuxt.options.plugins.push(resolve(__dirname, 'files', 'windicss.js'))
  })

  /*
    ** Add /_windi UI
    */
  if (nuxt.options.dev && options.viewer) {
    const path = '/_windicss/'

    // @ts-ignore
    process.nuxt = process.nuxt || {}
    // @ts-ignore
    process.nuxt.$config = process.nuxt.$config || {}
    // @ts-ignore
    process.nuxt.$config.windicss = {
      viewerPath: path,
      getConfig: () => () => ({
        theme: {},
        variants: {},
        plugins: [],
      })
    }

    this.addServerMiddleware({ path, handler: require.resolve('./middleware/viewer') })

    nuxt.hook('listen', () => {
      const url = withTrailingSlash(joinURL(nuxt.server.listeners && nuxt.server.listeners[0] ? nuxt.server.listeners[0].url : '/', path))
      nuxt.options.cli.badgeMessages.push(
          `Windi CSS Viewer: ${chalk.underline.yellow(url)}`
      )
    })
  }
}

// @ts-ignore
windicssModule.meta = { name: 'nuxt-windicss-module' }

export default windicssModule
