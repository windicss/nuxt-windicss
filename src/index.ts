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
    root: nuxtOptions.rootDir,
    scan: {
      dirs: ['./'],
      exclude: [
        'node_modules',
        '.git',
        '.nuxt/**/*',
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
        // @nuxt/image module
        'nuxt-img': 'img',
      }
    }
  }

  const config = defu.arrayFn(moduleOptions, nuxt.options.windicss, defaultConfig) as UserOptions

  /*
   * If a config isn't preset then check for windi.config.js and setup the nuxt watcher on it otherwise the config may
   * be using one of the following:
   * - windi.config.ts
   * - windi.config.js
   * - tailwind.config.ts
   * - tailwind.config.js
   *
   * Note: we should let the @windi/util package resolve the config if it's different
   */
  if (typeof config.config === 'undefined') {
    const preferredConfigPath = '~/windi.config.js'
    const configPath = nuxt.resolver.resolveAlias(preferredConfigPath)
    if (existsSync(configPath)) {
      clearModule(configPath)
      logger.info(`Reading Windi config from ${preferredConfigPath}`)
      // Restart Nuxt if windi file updates (for modules using windicss:config hook)
      if (nuxt.options.dev) {
        nuxt.options.watch.push(configPath)
      }
    }
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
