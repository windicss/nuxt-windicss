/*
 ** Windi CSS Configuration File
 **
 ** Docs: https://next.windicss.org/guide/configuration.html
 */
import type { Plugin } from 'windicss/types/interfaces'
import { defineConfig } from 'windicss/helpers'
import typography from 'windicss/plugin/typography'
import aspectRatio from  'windicss/plugin/aspect-ratio'

const plugins : Plugin[] = [
  typography as Plugin,
  aspectRatio as Plugin,
]

export default defineConfig({
  darkMode: 'class',
  plugins,
  attributify: true,
  shortcuts: {
    'light-img': 'block dark:hidden',
    'dark-img': 'hidden dark:block',
  },
})
