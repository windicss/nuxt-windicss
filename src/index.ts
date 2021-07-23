import fs from 'fs'
import type { Module, NuxtOptions } from '@nuxt/types'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import VitePluginWindicss from 'vite-plugin-windicss'
import { relative, join } from 'upath'
import clearModule from 'clear-module'
import defu from 'defu'
import { UserOptions, createUtils, ResolvedOptions } from '@windicss/plugin-utils'
import { Config } from 'windicss/types/interfaces'
import { Configuration as WebpackConfiguration } from 'webpack'
import type { File } from '@nuxt/content/types/content'
import logger from './logger'
import { requireNuxtVersion } from './compatibility'
import type { NuxtWindiOptions } from './interfaces'

const readCache = require('read-cache')

const windicssModule: Module<NuxtWindiOptions> = function(moduleOptions) {
  const nuxt = this.nuxt
  const nuxtOptions = this.nuxt.options as NuxtOptions

  // Prevent if wront version of using tailwind module
  requireNuxtVersion(nuxt.constructor.version, '2.10')
  // Make sure they're not using tailwind
  if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss')) {
    logger.error('Sorry, you can\'t use Windi CSS with Tailwind CSS. Please remove the `@nuxtjs/tailwindcss` module.')
    return
  }

  const defaultConfig: UserOptions = {
    root: nuxtOptions.rootDir,
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
  }

  const windiConfig = defu.arrayFn(moduleOptions, nuxt.options.windicss, defaultConfig) as NuxtWindiOptions

  // allow user to override the
  const ctxOnOptionsResolved = windiConfig.onOptionsResolved
  windiConfig.onOptionsResolved = async(options: ResolvedOptions) => {
    if (ctxOnOptionsResolved) {
      const result = ctxOnOptionsResolved(options)
      return typeof result === 'object' ? result : options
    }
    await nuxt.callHook('windicss:options', options)
    logger.debug('Post hook windicss:options', options)
    return options
  }

  const ctxOnConfigResolved = windiConfig.onConfigResolved
  let passed = false
  windiConfig.onConfigResolved = async(windiConfig: Config, configFilePath?: string) => {
    if (!passed) {
      const { version } = nuxt.resolver.requireModule('windicss/package.json')
      // this hook is ran twice for some reason
      if (configFilePath) {
        clearModule(configFilePath)
        logger.info(`windicss@${version} running with config: \`${relative(nuxtOptions.rootDir, configFilePath)}\``)
        // Restart Nuxt if windi file updates (for modules using windicss:config hook)
        if (nuxt.options.dev)
          nuxt.options.watch.push(configFilePath)
      }
      else {
        logger.info(`windicss@${version} running with inline config.`)
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

  const utils = createUtils(windiConfig, { root: windiConfig.root })

  utils.init()
    .then(() => nuxt.callHook('windicss:utils', utils))

  /**
   * Hook into the template builder, inject the Windi CSS imports.
   *
   * Because we want our windi styles to come before users custom styles, we need to inject them as part of the css config.
   * However, the css config does not let us handle the virtual modules without throwing an error.
   *
   * What we need to do is normalise the windi imports and then modify the App.js template to import explicitly for virtual
   * modules.
   */
  nuxt.hook('build:templates', (
    { templateVars, templatesFiles }:
    { templateVars: { css: ({ src: string; virtual: boolean }|string)[] }; templatesFiles: { src: string }[]},
  ) => {
    const windiImports = templateVars.css.filter(
      css => (typeof css === 'string' ? css : css.src).includes('virtual:windi'),
    )
    // if there is no windi paths configured, then load all of windi in as the first css file
    if (!windiImports.length)
      templateVars.css.unshift('virtual:windi.css')

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
        const file = fs.readFileSync(template.src, { encoding: 'utf-8' })
        // regex replace the css loader
        const regex = /(import '<%= )(relativeToBuild\(resolvePath\(c\.src \|\| c, { isStyle: true }\)\))( %>')/gm
        const subst = '$1c.virtual ? c.src : $2$3'
        const appTemplate = file.replace(regex, subst)
        const newPath = join(__dirname, 'template', 'App.js')
        fs.writeFileSync(newPath, appTemplate)
        template.src = newPath
        return template
      })
  })

  nuxt.hook('build:before', () => {
    // only if they have postcss enabled
    if (nuxt.options.build.postcss) {
      try {
        // this will throw an error if they don't have postcss installed
        require('postcss-import')
        // make sure the plugin object isn't undefined booted
        if (!nuxt.options.build.postcss.plugins)
          nuxt.options.build.postcss.plugins = {}
        // make the postcss-import apply the windi @apply's
        nuxt.options.build.postcss.plugins['postcss-import'] = {
          async load(filename: string) {
            await utils.ensureInit()
            const file = (await readCache(filename, 'utf-8')) as string
            return utils.transformCSS(file, filename)
          },
        }
      }
      catch (e) {
        // do nothing, the app isn't using postcss so no changes are needed
      }
    }
    // @ts-ignore
    this.extendBuild((config: WebpackConfiguration) => {
      config.plugins = config.plugins || []
      // push our webpack plugin
      config.plugins.push(
        // @ts-ignore
        new WindiCSSWebpackPlugin({ ...windiConfig, utils }),
      )
    })
  })

  nuxt.hook('vite:extend', (vite: { nuxt: { options: NuxtOptions }; config: { plugins: any[] } }) => {
    vite.nuxt.options.alias['windi.css'] = 'virtual:windi.css'
    // @ts-ignore
    vite.config.plugins.push(VitePluginWindicss(windiConfig, { root: windiConfig.root, utils }))
  })

  if (nuxtOptions.dev) {
    // @nuxt/content support, only required in dev
    nuxt.hook('content:file:beforeParse', async(md: File) => {
      // only applies to .md files
      if (md.extension !== '.md') return

      await utils.ensureInit()
      // instead of rebuilding the entire windi virtual module we will just insert our styles into the md file
      await utils.extractFile(md.data, md.path, true)
      const css = await utils.generateCSS()
      // add to the end of the file
      md.data += `\n\n<style>${css}</style>`
    })
  }
}

// @ts-ignore
windicssModule.meta = { name: 'nuxt-windicss' }

export default windicssModule
