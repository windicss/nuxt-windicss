/*
 ** Windi CSS Configuration File
 **
 ** Docs: https://next.windicss.org/guide/configuration.html
 */
const colors = require('windicss/colors')
const defaultTheme = require('windicss/defaultTheme')
const typography = require('windicss/plugin/typography')
const aspectRatio = require('windicss/plugin/aspect-ratio')

module.exports = {
  darkMode: 'class',
  plugins: [
    typography,
    aspectRatio,
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      blue: colors.sky,
      green: colors.emerald,
      red: colors.red,
      rose: colors.rose,
      yellow: colors.amber,
      gray: colors.warmGray,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        red: {
          500: 'black',
        },
      },
    },
  },
  shortcuts: {
    'light-img': 'block dark:hidden',
    'dark-img': 'hidden dark:block',
  },
}
