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
    aspectRatio
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      blue: colors.lightBlue,
      green: colors.emerald,
      red: colors.red,
      rose: colors.rose,
      yellow: colors.amber,
      gray: colors.warmGray
    },
    extend: {
      screens: {
        xs: '414px'
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)'
        }
      },
      spacing: {
        18: '4.5rem',
        46: '11.5rem',
        '580px': '580px',
        '640px': '640px'
      },
    }
  },
  shortcuts: {
    'light-img': 'block dark:hidden',
    'dark-img': 'hidden dark:block'
  }
}
