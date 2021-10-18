import { readFileSync, writeFileSync } from 'fs'
import { relative, join } from 'pathe'
import { createUtils } from '@windicss/plugin-utils'
import type { ResolvedOptions } from '@windicss/plugin-utils'
import type { Config } from 'windicss/types/interfaces'
import {
  defineNuxtModule,
  extendViteConfig,
  isNuxt2,
  clearRequireCache,
  importModule,
  requireModulePkg,
  requireModule,
  tryRequireModule,
  isNuxt3,
} from '@nuxt/kit'
import type { File } from '@nuxt/content/types/content'
import logger from './logger'
import type { NuxtWindiOptions } from './interfaces'
import { NAME, NUXT_CONFIG_KEY, defaultWindiOptions } from './constants'
import { analyze } from '.'

const defineNuxtWindiCSSModule = defineNuxtModule<NuxtWindiOptions>(nuxt => ({
  name: NAME,
  configKey: NUXT_CONFIG_KEY,
  defaults: {
    root: nuxt.options.rootDir,
    ...defaultWindiOptions,
  },
  async setup(nuxtWindiOptions: NuxtWindiOptions) {
    const nuxtOptions = nuxt.options

    // Make sure they're not using tailwind
    // @todo move to a util
    if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss')) {
      logger.error('Sorry, you can\'t use Windi CSS with Tailwind CSS. Please remove the `@nuxtjs/tailwindcss` module.')
      return
    }

    // allow user to override the options with hooks
    const ctxOnOptionsResolved = nuxtWindiOptions.onOptionsResolved
    nuxtWindiOptions.onOptionsResolved = async(options: ResolvedOptions) => {
      if (ctxOnOptionsResolved) {
        const result = ctxOnOptionsResolved(options)
        return typeof result === 'object' ? result : options
      }
      await nuxt.callHook('windicss:options', options)
      logger.debug('Post hook windicss:options', options)
      return options
    }

    const ctxOnConfigResolved = nuxtWindiOptions.onConfigResolved
    let passed = false
    nuxtWindiOptions.onConfigResolved = async(windiConfig: Config, configFilePath?: string) => {
      if (!passed) {
        // Note: jiti issues when using requireModulePkg
        let configType = 'inline'
        // this hook is ran twice for some reason
        if (configFilePath) {
          clearRequireCache(configFilePath)
          configType = relative(nuxtOptions.rootDir, configFilePath)
          // Restart Nuxt if windi file updates (for modules using windicss:config hook)
          if (nuxt.options.dev)
            nuxt.options.watch.push(configFilePath)
        }

        // avoid being too verbose
        if (nuxt.options.dev && !nuxt.options.build) {
          const { version } = requireModulePkg('windicss')
          logger.info(`windicss@${version} running with config: ${configType}.`)
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

    const utils = createUtils(nuxtWindiOptions, { root: nuxtWindiOptions.root, name: NAME })

    const ensureInit = utils.init()
      .then(() => nuxt.callHook('windicss:utils', utils))

    // if the user hasn't manually added virtual:windi.css to their nuxt config then we push it as the first stylesheet
    const windiImports = nuxt.options.css.filter(
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
      // @ts-ignore
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
            const newPath = join(__dirname, 'template', 'App.js')
            writeFileSync(newPath, appTemplate)
            template.src = newPath
            return template
          })
      })
    }

    // import's in pcss files should run via windi's @apply's
    nuxt.hook('build:before', () => {
      // only if they have postcss enabled
      const postcssOptions: any = nuxt.options.build.postcss
      if (postcssOptions) {
        try {
          // this will throw an error if they don't have postcss installed
          requireModule('postcss-import')
          // make sure the plugin object isn't undefined booted
          if (!postcssOptions.plugins)
            postcssOptions.plugins = {}
          const readCache = require('read-cache')
          // make the postcss-import apply the windi @apply's
          postcssOptions.plugins['postcss-import'] = {
            async load(filename: string) {
              await ensureInit

              const file = (await readCache(filename, 'utf-8')) as string
              return utils.transformCSS(file, filename)
            },
          }
        }
        catch (e) {
          logger.info(e)
          // do nothing, the app isn't using postcss so no changes are needed
        }
      }
    })

    // webpack 4/5
    nuxt.hook('webpack:config', (configs) => {
      // @todo use extendWebpackConfig once it supports modern build
      const WindiCSSWebpackPlugin = requireModule('windicss-webpack-plugin').default
      const plugin = new WindiCSSWebpackPlugin({ ...nuxtWindiOptions, utils })

      configs.forEach((config) => {
        config.plugins = config.plugins || []
        config.plugins.push(plugin)
      })
    })

    // Vite
    extendViteConfig(async(config) => {
      const VitePluginWindicss = await importModule('vite-plugin-windicss')
      const plugin = VitePluginWindicss(nuxtWindiOptions, { root: nuxtWindiOptions.root, utils, name: NAME })
      // legacy compatibility with webpack plugin support
      nuxt.options.alias['windi.css'] = 'virtual:windi.css'

      config.plugins = config.plugins || []
      config.plugins.push(plugin)
    })

    if (nuxtOptions.dev) {
      // @nuxt/content support
      // We need to compile md files on the fly and inject the transformed CSS
      nuxt.hook('content:file:beforeParse', async(file: File) => {
        // only applies to .md files
        if (file.extension !== '.md') return

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
      if (nuxtWindiOptions.analyze !== false) {
        // need to check if the server has already started to show a logger message rather than a cli badge
        let serverStarted = false
        nuxt.hook('listen', () => {
          serverStarted = true
        })
        analyze({
          windiOptions: nuxtWindiOptions,
          utils,
        }, nuxtWindiOptions.analyze)
          .then((server) => {
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
}))

/**
 * Export package.json meta into the module
 */
export const defineModuleMeta = () => {
  // __dirname by itself is CJS which we should avoid
  const __dirname = new URL('.', import.meta.url).pathname

  let meta = {
    configKey: NUXT_CONFIG_KEY,
  }
  // it shouldn't fail but who knows
  const pkg = tryRequireModule(`${__dirname}/../package.json`)
  if (pkg) {
    meta = {
      ...meta,
      ...pkg,
    }
  }
  return meta
}

defineNuxtWindiCSSModule.meta = defineModuleMeta()

export default defineNuxtWindiCSSModule
