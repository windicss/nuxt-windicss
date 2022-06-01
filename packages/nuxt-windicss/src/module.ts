import { readFileSync, writeFileSync } from 'fs'
import { ensureDirSync } from 'fs-extra'
import { join, relative } from 'pathe'
import { createUtils } from '@windicss/plugin-utils'
import type { ResolvedOptions, UserOptions, WindiPluginUtils } from '@windicss/plugin-utils'
import type { Config } from 'windicss/types/interfaces'
import {
  clearRequireCache,
  defineNuxtModule,
  extendViteConfig,
  extendWebpackConfig,
  isNuxt2,
  isNuxt3,
  requireModule,
  tryRequireModule,
} from '@nuxt/kit'
import type { File } from '@nuxt/content/types/content'
import VitePluginWindicss from 'vite-plugin-windicss'
import { version } from '../package.json'
import logger from './logger'
import { analyze } from './analyze'
import type { AnalyzeOptions } from './types'

type NuxtHookResult = Promise<void> | void

export type ModuleOptions = UserOptions & {
  /**
   * Pass a pre-instantiated WindiPluginUtils instance to avoid duplicate scans if you're using the engine elsewhere.
   *
   * @default undefined
   */
  utils?: WindiPluginUtils

  /**
   * Launches Windi Analyze when in development mode.
   * @default false
   */
  analyze?: AnalyzeOptions

  /**
   * Shows nuxt-windicss and windicss versions on build:before hook.
   * @default true
   */
  displayVersionInfo?: boolean
}

export interface ModuleHooks {
  'windicss:options': (options: ResolvedOptions) => NuxtHookResult
  'windicss:config': (config: Config) => NuxtHookResult
  'windicss:utils': (utils: WindiPluginUtils) => NuxtHookResult
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-windicss',
    configKey: 'windicss',
    compatibility: {
      nuxt: '^2.0.0 || ^3.0.0-rc.1',
    },
  },
  defaults: {
    analyze: false,
    displayVersionInfo: true,
    scan: {
      dirs: ['./'],
      exclude: [
        'node_modules',
        'node_modules_dev',
        'node_modules_prod',
        'dist',
        '.git',
        '.github',
        '.nuxt',
        // testing files & folders
        'coverage',
        '**/__snapshots__',
        '*.test.js',
      ],
    },
    preflight: {
      alias: {
        // add nuxt aliases
        'nuxt-link': 'a',
        // @nuxt/image module
        'nuxt-img': 'img',
      },
    },
    transformCSS: 'pre',
  },
  async setup(options: ModuleOptions, nuxt) {
    const nuxtOptions = nuxt.options

    if (!options.root)
      options.root = nuxt.options.rootDir

    // Make sure they're not using tailwind
    // @todo move to a util
    if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss') || nuxtOptions.modules.includes('@nuxtjs/tailwindcss')) {
      logger.error('Sorry, you can\'t use Windi CSS with Tailwind CSS. Please remove the `@nuxtjs/tailwindcss` module.')
      return
    }

    // allow user to override the options with hooks
    const ctxOnOptionsResolved = options.onOptionsResolved
    options.onOptionsResolved = async (options: ResolvedOptions) => {
      if (ctxOnOptionsResolved) {
        const result = ctxOnOptionsResolved(options)
        return typeof result === 'object' ? result : options
      }
      await nuxt.callHook('windicss:options', options)
      logger.debug('Post hook windicss:options', options)
      return options
    }

    const ctxOnConfigResolved = options.onConfigResolved
    let passed = false
    options.onConfigResolved = async (windiConfig: Config, configFilePath?: string) => {
      if (!passed) {
        // Note: jiti issues when using requireModulePkg
        let configType = 'inline'
        // this hook is ran twice for some reason
        if (configFilePath) {
          clearRequireCache(configFilePath)
          configType = `./${relative(nuxtOptions.rootDir, configFilePath)}`
          // Restart Nuxt if windi file updates (for modules using windicss:config hook)
          if (nuxt.options.dev)
            nuxt.options.watch.push(configFilePath)
        }

        // avoid being too verbose
        if (options.displayVersionInfo && nuxt.options.dev) {
          nuxt.hook('build:before', () => {
            logger.info(`\`nuxt-windicss v${version}\` running with config: \`${configType}\`.`)
          })
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

    const utils = createUtils(options, { root: options.root, name: 'nuxt-windicss' })

    const ensureInit = utils.init()
      .then(() => nuxt.callHook('windicss:utils', utils))

    // if the user hasn't manually added virtual:windi.css to their nuxt config then we push it as the first stylesheet
    const windiImports = nuxt.options.css.filter(
      // @ts-expect-error custom css object for windi
      css => (typeof css === 'string' ? css : css.src).includes('virtual:windi'),
    )
    if (!windiImports.length)
      nuxt.options.css.unshift('virtual:windi.css')

    // builds for webpack 5 don't support windi being resolved at the root for some reason
    if (isNuxt3(nuxt) && nuxt.options.vite === false) {
      nuxt.options.css = nuxt.options.css
      // we need to remove the alias at the start for it to work
        .map((css: string) => {
          if (!css.includes('virtual:windi') || css.startsWith('@'))
            return css

          return join('@', css)
        })
    }

    // Nuxt 3 supports virtual css modules
    if (isNuxt2(nuxt)) {
      /**
       * Hook into the template builder, inject the Windi CSS imports.
       *
       * Because we want our windi styles to come before users custom styles, we need to inject them as part of the css config.
       * However, the css config does not let us handle the virtual modules without throwing an error.
       *
       * What we need to do is normalize the windi imports and then modify the App.js template to import explicitly for virtual
       * modules.
       */
      nuxt.hook('build:templates', (
        { templateVars, templatesFiles }:
        { templateVars: { css: ({ src: string; virtual: boolean } | string)[] }; templatesFiles: { src: string }[] },
      ) => {
        // normalise the virtual windi imports
        templateVars.css = templateVars.css.map((css) => {
          const src = typeof css === 'string' ? css : css.src
          if (src.includes('virtual:windi')) {
            return {
              src,
              virtual: true,
            }
          }
          return css
        })
        // replace the contents of App.js
        templatesFiles
          .map((template) => {
            if (!template.src.endsWith('App.js'))
              return template

            // we need to replace the App.js template..
            const file = readFileSync(template.src, { encoding: 'utf-8' })
            // regex replace the css loader
            const regex = /(import '<%= )(relativeToBuild\(resolvePath\(c\.src \|\| c, { isStyle: true }\)\))( %>')/gm
            const subst = '$1c.virtual ? c.src : $2$3'
            const appTemplate = file.replace(regex, subst)
            // make sure the runtime folder exists
            ensureDirSync(join(__dirname, 'runtime'))
            const newPath = join(__dirname, 'runtime', 'App.js')
            writeFileSync(newPath, appTemplate)
            template.src = newPath
            return template
          })
      })
    }

    // import's in pcss files should run via windi's @apply's
    nuxt.hook('build:before', async () => {
      // only if they have postcss enabled
      const nuxtPostcss
        = nuxt.options.postcss /* nuxt3 */
        || nuxt.options.build.postcss.postcssOptions /* older nuxt3 */
        || nuxt.options.build.postcss /* nuxt2 */
      if (!nuxtPostcss)
        return

      // this will throw an error if they don't have postcss installed
      const hasPostCSSImport = tryRequireModule('postcss-import')
      if (!hasPostCSSImport)
        return

      const readCache = requireModule('read-cache')

      const updatedPostcssImport = {
        async load(filename: string) {
          await ensureInit

          const file = (await readCache(filename, 'utf-8')) as string
          return utils.transformCSS(file, filename)
        },
      }

      // make sure the plugin object isn't undefined booted
      nuxtPostcss.plugins = nuxtPostcss.plugins || {}
      // make the postcss-import apply the windi @apply's
      nuxtPostcss.plugins['postcss-import'] = {
        ...nuxtPostcss.plugins['postcss-import'],
        ...updatedPostcssImport,
      }
    })

    // webpack 4/5
    extendWebpackConfig((config) => {
      const WindiCSSWebpackPlugin = requireModule('windicss-webpack-plugin')
      const plugin = new WindiCSSWebpackPlugin({ ...options, utils })
      config.plugins = config.plugins || []
      config.plugins.push(plugin)
    })

    // Vite
    extendViteConfig(async (config) => {
      const plugin = VitePluginWindicss(options, { root: options.root, utils, name: 'nuxt-windicss' })
      // legacy compatibility with webpack plugin support
      nuxt.options.alias['windi.css'] = 'virtual:windi.css'

      config.plugins = config.plugins || []
      config.plugins.unshift(...plugin)
    })

    if (nuxtOptions.dev) {
      // @nuxt/content support
      // We need to compile md files on the fly and inject the transformed CSS
      nuxt.hook('content:file:beforeParse', async (file: File) => {
        // only applies to .md files
        if (file.extension !== '.md')
          return

        await ensureInit
        // instead of rebuilding the entire windi virtual module we will just insert our styles into the md file
        await utils.extractFile(file.data, file.path, true)
        const css = await utils.generateCSS()
        // add to the end of the file
        file.data += `\n\n<style>${css}</style>`
      })

      /**
       * Windi Analysis UI
       *
       * This is hosted in its own server via listhen.
       */
      if (options.analyze !== false) {
        // need to check if the server has already started to show a logger message rather than a cli badge
        let serverStarted = false
        nuxt.hook('listen', () => {
          serverStarted = true
        })
        analyze({
          windiOptions: options,
          utils,
        }, options.analyze)
          .then((server: any) => {
            const message = `WindCSS Analysis: ${server.url}`
            if (isNuxt3(nuxt)) {
              logger.info(message)
            }
            else if (serverStarted) {
              nuxt.hook('build:done', () => {
                serverStarted = true
                logger.info(message)
              })
            }
            else {
              nuxt.options.cli.badgeMessages.push(message)
            }
          })
      }
    }
  },
})
