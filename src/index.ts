import type { Module, NuxtOptions } from '@nuxt/types'
import type { Configuration as WebpackConfig } from 'webpack'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import WindiCSSVitePlugin, { ResolvedOptions } from 'vite-plugin-windicss'
import { resolve, relative } from 'upath'
import clearModule from 'clear-module'
import defu from 'defu'
import { UserOptions } from '@windicss/plugin-utils'
import { Config } from 'windicss/types/interfaces'
import { version as windiVersion } from 'windicss/package.json'
import logger from './logger'
import { requireNuxtVersion } from './compatibility'

const windicssModule: Module<UserOptions> = function(moduleOptions) {
  const nuxt = this.nuxt
  const nuxtOptions = this.nuxt.options as NuxtOptions

  // Prevent if wront version of using tailwind module
  requireNuxtVersion(nuxt.constructor.version, '2.10')
  if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss')) {
    logger.error('Cannot use Windi CSS with tailwindcss. Please remove the `@nuxtjs/tailwindcss` module.')
    return
  }

  const defaultConfig: UserOptions = {
    root: nuxtOptions.rootDir,
    scan: {
      dirs: ['./'],
      exclude: [
        'node_modules',
        '.git',
        '.nuxt/**/*',
        '*.template.html',
        'app.html',
      ],
      include: [],
    },
    transformCSS: 'pre',
    preflight: {
      alias: {
        // add nuxt aliases
        'nuxt-link': 'a',
        // @nuxt/image module
        'nuxt-img': 'img',
      },
    },
  }

  const config = defu.arrayFn(moduleOptions, nuxt.options.windicss, defaultConfig) as UserOptions

  // allow user to override the
  const ctxOnOptionsResolved = config.onOptionsResolved
  // @ts-ignore
  config.onOptionsResolved = (options: ResolvedOptions) => {
    if (ctxOnOptionsResolved) {
      const result = ctxOnOptionsResolved(options)
      return typeof result === 'object' ? result : options
    }
    nuxt.callHook('windicss:options', options)
    logger.debug('Post hook windicss:options', options)
    return options
  }

  const ctxOnConfigResolved = config.onConfigResolved
  let passed = false
  // @ts-ignore
  config.onConfigResolved = async(windiConfig: Config, configFilePath?: string) => {
    if (!passed) {
      // this hook is ran twice for some reason
      if (configFilePath) {
        clearModule(configFilePath)
        logger.info(`windicss@${windiVersion} running with config: \`${relative(nuxtOptions.rootDir, configFilePath)}\``)
        // Restart Nuxt if windi file updates (for modules using windicss:config hook)
        if (nuxt.options.dev)
          nuxt.options.watch.push(configFilePath)
      }
      else {
        logger.info(`windicss@${windiVersion} running with inline config.`)
      }
      passed = true
    }
    if (ctxOnConfigResolved) {
      const result = await ctxOnConfigResolved(windiConfig, configFilePath)
      return typeof result === 'object' ? result : windiConfig
    }
    await nuxt.callHook('windicss:config', windiConfig)
    logger.debug('Post hook windicss:config', windiConfig)
    return windiConfig
  }

  nuxt.hook('build:before', () => {
    // add plugin to import windi.css
    nuxt.options.plugins.push(resolve(__dirname, 'template', 'windicss.js'))

    this.extendBuild((webpackConfig: WebpackConfig) => {
      webpackConfig.plugins = webpackConfig.plugins || []
      // push our webpack plugin
      webpackConfig.plugins.push(
        new WindiCSSWebpackPlugin(config),
      )
    })
  })

  nuxt.hook('vite:extend', (vite: { nuxt: { options: NuxtOptions }; config: { plugins: any[] } }) => {
    vite.nuxt.options.alias['windi.css'] = 'virtual:windi.css'
    // @ts-ignore
    vite.config.plugins.push(WindiCSSVitePlugin(config))
  })
}

// @ts-ignore
windicssModule.meta = { name: 'nuxt-windicss' }

export default windicssModule
