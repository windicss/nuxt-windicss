import type { Module, NuxtOptions } from '@nuxt/types'
import type { Configuration as WebpackConfig } from 'webpack'
import { requireNuxtVersion } from './compatibility'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import WindiCSSVitePlugin from 'vite-plugin-windicss'
import { resolve } from 'upath'
import logger from './logger'
import defu from 'defu'
import { UserOptions } from '@windicss/plugin-utils'

const windicssModule: Module<UserOptions> = function (moduleOptions) {
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
  const options = defu.arrayFn(moduleOptions, nuxt.options.tailwindcss, nuxt.options.windicss, windicssOptions) as UserOptions

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

  nuxt.hook('vite:extend', ({ config, nuxt }: { nuxt: { options: NuxtOptions }, config: { plugins: any[] }}) => {
    nuxt.options.alias['windi.css'] = '@virtual/windi.css'
    config.plugins.push(WindiCSSVitePlugin())
  })

}

// @ts-ignore
windicssModule.meta = { name: 'nuxt-windicss-module' }

export default windicssModule
