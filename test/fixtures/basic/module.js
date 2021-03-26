import themeConfig from './theme.config'

export default function themeModule() {
  // wait for nuxt options to be normalized
  const { nuxt } = this

  themeConfig(nuxt)
}
