
/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  darkMode: 'class',
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ],
    options: {
      whitelist: []
    }
  },
  theme: {
    darkSelector: '.dark',
    extend: {
      typography: {},
      colors: {
        primary: '#d8002d',
        secondary: '#333',
        dark: '#091a28',
        elevated: '#dfe8ef'
      },
      margin: {
        'top-bar': '100px'
      },
      fontFamily: {
        Saira: ['Saira']
      },
      maxWidth: {
        '1/4': '25%'
      }
    }
  },
  variants: {
    backgroundColor: [
      // 'dark',
      // 'dark-hover',
      // 'dark-group-hover',
      // 'dark-even',
      // 'dark-odd'
    ]
  },
  plugins: [
    require('tailwindcss-dark-mode'),
    require('@tailwindcss/typography')
  ]
}
