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
    root: nuxtOptions.rootDir,
    scan: {
      dirs: ['./'],
      exclude: [
          '.nuxt/**/*',
          '*.template.html'
      ]
    },
    transformCSS: 'pre',
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

  const isViteMode = nuxtOptions.buildModules.includes('nuxt-vite')

  nuxt.hook('build:before', async () => {
    // allow users to override the windicss config
    // if they decided to return false - disabling windicss
    await nuxt.callHook('windicss:config', options)
    if (!options) {
      logger.info('Windi CSS has been disabled via the `windicss:config` hook.')
      return
    }

    logger.debug('Post hook options', options)

    if (!isViteMode) {
      this.extendBuild((config: WebpackConfig,) => {
        if (! config.plugins) { config.plugins = [] }
      config.plugins.push(
          // push our webpack plugin
            new WindiCSSWebpackPlugin(options)
        )
      })
      // add plugin to import windi.css
      nuxt.options.plugins.push(resolve(__dirname, 'webpack', 'plugins', 'windicss.js'))
    } else {
      nuxt.options.plugins.push(resolve(__dirname, 'vite', 'plugins', 'windicss.js'))
    }
  })

  if (isViteMode) {
    nuxt.hook('vite:extend', ({config, nuxt}: { nuxt: { options: NuxtOptions }, config: { plugins: any[] } }) => {
      config.plugins.push(WindiCSSVitePlugin(options))
    })
  }

}

// @ts-ignore
windicssModule.meta = { name: 'nuxt-windicss-module' }

export default windicssModule
