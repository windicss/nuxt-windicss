import type { Module, NuxtOptions } from '@nuxt/types'
import type { Configuration as WebpackConfig } from 'webpack'
import { requireNuxtVersion } from './compatibility'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import WindiCSSVitePlugin from 'vite-plugin-windicss'
import { resolve } from 'upath'
import { existsSync } from 'fs'
import logger from './logger'
import clearModule from 'clear-module'
import defu from 'defu'
import { UserOptions } from '@windicss/plugin-utils'

const windicssModule: Module<UserOptions> = function (moduleOptions) {
  const nuxt = this.nuxt
  const nuxtOptions = this.nuxt.options as NuxtOptions

  // Prevent if wront version of using tailwind module
  requireNuxtVersion(nuxt.constructor.version, '2.10')
  if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss')) {
    logger.error('Cannot use Windi CSS with tailwindcss. Please remove the `@nuxtjs/tailwindcss` module.')
    return
  }

  const defaultConfig : UserOptions = {
    config: '~/windi.config.js',
    root: nuxtOptions.rootDir,
    scan: {
      dirs: ['./'],
      exclude: [
        'node_modules',
        '.git',
        '.nuxt',
        '*.template.html',
        'app.html'
      ],
      include: []
    },
    transformCSS: 'pre',
    preflight: {
      alias: {
        // add nuxt aliases
        'nuxt-link': 'a',
      }
    }
  }

  const config = defu.arrayFn(moduleOptions, nuxt.options.windicss, defaultConfig) as UserOptions

  if (typeof config.config === 'string') {
    const configPath = nuxt.resolver.resolveAlias(config.config)
    if (existsSync(configPath)) {
      clearModule(configPath)
      logger.info(`Reading Windi config from ~/windi.config.js`)
      config.config = nuxt.resolver.requireModule(configPath)
      // Restart Nuxt if windi file updates (for modules using windicss:config hook)
      if (nuxt.options.dev) {
        nuxt.options.watch.push(configPath)
      }
    }
  } else {
    logger.info('Reading Windi config from Nuxt config `windicss.config` property')
  }

  nuxt.hook('build:before', async () => {
    // allow users to override the windicss config
    // if they decided to return false - disabling windicss
    await nuxt.callHook('windicss:config', config)

    logger.debug('Post hook windicss:config', config)

    // add plugin to import windi.css
    nuxt.options.plugins.push(resolve(__dirname, 'template', 'windicss.js'))

    this.extendBuild((webpackConfig: WebpackConfig,) => {
      webpackConfig.plugins = webpackConfig.plugins || []
      // push our webpack plugin
      webpackConfig.plugins.push(
        new WindiCSSWebpackPlugin(config)
      )
    })
  })


  nuxt.hook('vite:extend', (vite: { nuxt: { options: NuxtOptions }, config: { plugins: any[] } }) => {
    vite.nuxt.options.alias['windi.css'] = 'virtual:windi.css'
    // @ts-ignore
    vite.config.plugins.push(WindiCSSVitePlugin(config))
  })

}

// @ts-ignore
windicssModule.meta = { name: 'nuxt-windicss' }

export default windicssModule
