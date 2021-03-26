const typography = require('windicss/plugin/typography')()
/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  darkMode: 'class',
  plugins: [typography],
  theme: {
    darkSelector: '.dark',
    extend: {
      typography: {},
      colors: {
        primary: '#d8002d',
        secondary: '#333',
        dark: '#091a28',
        elevated: '#dfe8ef',
      },
      margin: {
        'top-bar': '100px',
      },
      fontFamily: {
        Saira: ['Saira'],
      },
      maxWidth: {
        '1/4': '25%',
      },
    },
  },
}
