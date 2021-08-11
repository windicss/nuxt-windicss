import fs from 'fs'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import VitePluginWindicss from 'vite-plugin-windicss'
import { relative, join } from 'upath'
import clearModule from 'clear-module'
import { createUtils, ResolvedOptions } from '@windicss/plugin-utils'
import { Config } from 'windicss/types/interfaces'
import { Configuration as WebpackConfiguration } from 'webpack'
import type { File } from '@nuxt/content/types/content'
import { defineNuxtModule, extendBuild } from '@nuxt/kit'
import logger from './logger'
import type { NuxtWindiOptions } from './interfaces'

const readCache = require('read-cache')

export default defineNuxtModule<NuxtWindiOptions>(nuxt => ({
  name: 'nuxt-windicss',
  configKey: 'windicss',
  defaults: {
    root: nuxt.options.rootDir,
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
  },
  setup(windiConfig) {
    const nuxtOptions = nuxt.options

    // Make sure they're not using tailwind
    if (nuxtOptions.buildModules.includes('@nuxtjs/tailwindcss')) {
      logger.error('Sorry, you can\'t use Windi CSS with Tailwind CSS. Please remove the `@nuxtjs/tailwindcss` module.')
      return
    }

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
        const { version } = require('windicss/package.json')
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

    const ensureInit = utils.init()
      .then(() => nuxt.callHook('windicss:utils', utils))

    /**
     * Hook into the template builder, inject the Windi CSS imports.
     *
     * Because we want our windi styles to come before users custom styles, we need to inject them as part of the css config.
     * However, the css config does not let us handle the virtual modules without throwing an error.
     *
     * What we need to do is normalize the windi imports and then modify the App.js template to import explicitly for virtual
     * modules.
     */
    // @ts-expect-error nuxt 2 only
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
      const postcssOptions: any = nuxt.options.build.postcss
      if (postcssOptions) {
        try {
          // this will throw an error if they don't have postcss installed
          require('postcss-import')
          // make sure the plugin object isn't undefined booted
          if (!postcssOptions.plugins)
            postcssOptions.plugins = {}
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
          // do nothing, the app isn't using postcss so no changes are needed
        }
      }
    })

    extendBuild((config: WebpackConfiguration) => {
      config.plugins = config.plugins || []
      // push our webpack plugin
      config.plugins.push(
        // @ts-ignore
        new WindiCSSWebpackPlugin({ ...windiConfig, utils }),
      )
    })

    nuxt.hook('vite:extend', (vite: { config: { plugins: any[] } }) => {
      nuxt.options.alias['windi.css'] = 'virtual:windi.css'
      // @ts-ignore
      vite.config.plugins.push(VitePluginWindicss(windiConfig, { root: windiConfig.root, utils }))
    })

    if (nuxtOptions.dev) {
      // @nuxt/content support, only required in dev
      nuxt.hook('content:file:beforeParse', async(md: File) => {
        // only applies to .md files
        if (md.extension !== '.md') return

        await ensureInit
        // instead of rebuilding the entire windi virtual module we will just insert our styles into the md file
        await utils.extractFile(md.data, md.path, true)
        const css = await utils.generateCSS()
        // add to the end of the file
        md.data += `\n\n<style>${css}</style>`
      })
    }
  },
}))
