import { resolve } from 'path'
import defu from 'defu'
import defaultWindiConfig from './windi.config'

export default function() {
  const nuxt = this.nuxt
  const { hook, options } = nuxt

  hook('windicss:options', (resolvedOptions) => {
    // include user content directory in scan process
    resolvedOptions.scanOptions.dirs.push(resolve(options.srcDir, 'components'))
    return resolvedOptions
  })

  hook('windicss:config', (config) => {
    Object.assign(config, defaultWindiConfig)

    // Workaround for typography plugin not being a function supporting theme
    if (typeof config.theme.extend.typography === 'function') {
      const defaultTheme = nuxt.resolver.requireModule('windicss/defaultTheme')
      const theme = (key) => {
        const keys = key.split('.')
        return keys.reduce((res, _key) => res[_key], defu(config.theme, defaultTheme))
      }
      config.theme.extend.typography = config.theme.extend.typography(theme)
    }
    return config
  })
}
