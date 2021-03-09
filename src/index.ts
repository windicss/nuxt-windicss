import type { Module, NuxtOptions } from '@nuxt/types'
import type { Configuration as WebpackConfig } from 'webpack'
import { requireNuxtVersion } from './compatibility'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import { resolve } from 'upath'
import logger from './logger'
import defu from 'defu'
import { UserOptions } from '@windicss/plugin-utils'
import { Options } from 'windicss-webpack-plugin/dist/interfaces'

const windicssModule: Module<Options> = function (moduleOptions) {
  const nuxt = this.nuxt
  const nuxtOptions = this.nuxt.options as NuxtOptions

  const windicssOptions : UserOptions = {
    scan: {
      dirs: ['./'],
      exclude: ['.nuxt/**/*']
    },
    preflight: {
      alias: {
        // add nuxt aliases
        'nuxt-link': 'a',
      }
    }
  }
  const options = defu.arrayFn(moduleOptions, nuxt.options.tailwindcss, nuxt.options.windicss, windicssOptions) as Options

  requireNuxtVersion(nuxt.constructor.version, '2.10')

  if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss')) {
    logger.error('Cannot use Windi CSS with tailwindcss. Please remove the `@nuxtjs/tailwindcss` module.')
    return
  }

  nuxt.hook('build:before', async () => {
    await nuxt.callHook('windycss:config', options)

    logger.debug('Post hook options', options)

    this.extendBuild((config: WebpackConfig,) => {
      // allow users to override the windicss config
      // if they decided to return false - disabling windicss
      if (! config.plugins) {
        config.plugins = []
      }
      config.plugins.push(
          new WindiCSSWebpackPlugin(options)
      )
    })
    // add plugin to import windi.css
    nuxt.options.plugins.push(resolve(__dirname, 'files', 'plugins', 'windicss.js'))
  })

}

// @ts-ignore
windicssModule.meta = { name: 'nuxt-windicss-module' }

export default windicssModule
