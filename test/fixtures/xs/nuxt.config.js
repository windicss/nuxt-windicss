import nuxtBuildOptimisations from '../../../src'

const ESLintPlugin = require('eslint-webpack-plugin');
let path = '.env'
if (process.env.NODE_ENV === 'staging') {
  path = '.env.staging'
}
if (process.env.NODE_ENV === 'production') {
  path = '.env.prod'
}
if (process.env.NODE_ENV === 'qa') {
  path = '.env.qa'
}
require('dotenv').config({
  path: path
})
const date = new Date()
const timestamp = date.getTime()
module.exports = {
  env: {
    baseUrl: process.env.XCLAIM_BASE_URL,
    adminBaseURL: process.env.ADMIN_BASE_URL
  },
  ssr: false,
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    title: 'XS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'cache-control', content: 'max-age=0' },
      { 'http-equiv': 'cache-control', content: 'no-cache' },
      { 'http-equiv': 'expires', content: '0' },
      { 'http-equiv': 'pragma', content: 'no-cache' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Martel+Sans&family=Open+Sans&display=swap'
      },
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#ffe600',
    height: '2px'
  },
  loadingIndicator: {
    name: 'rectangle-bounce',
    color: '#ffe600',
    background: '#ffffff'
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/element-ui',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.XCLAIM_BASE_URL
  },
  /**
   * Auth config
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/jwt/token',
            method: 'get',
            propertyName: 'data.jwt'
          },
          logout: {
            url: '/auth/jwt/token',
            method: 'delete'
          },
          user: {
            url: '/auth/me',
            method: 'get',
            propertyName: 'data'
          }
        }
      }
    },
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/dashboard'
    },
    watchLoggedIn: true,
    rewriteRedirects: true,
    fullPathRedirect: true
  },
  router: {
    // middleware: ['auth', 'token']
  },
  /*
   ** Build configuration
   */
  build: {
    plugins: process.env.NODE_ENV === 'dev' ? [
      new ESLintPlugin({
        fix: true
      }),
    ] : [],

    /*
     ** You can extend webpack config here
     */
    extend (config) {
      config.devtool = process.env.NODE_ENV === 'dev' ? 'eval-source-map' : ''
    },

    filenames: {
      app: ({ isDev }) =>
        isDev ? '[name].js' : '[chunkhash].' + timestamp + '.js',
      chunk: ({ isDev }) =>
        isDev ? '[name].js' : '[chunkhash].' + timestamp + '.js',
      css: ({ isDev }) =>
        isDev ? '[name].css' : '[contenthash].' + timestamp + '.css'
    }
  },
  buildModules: [nuxtBuildOptimisations],
  buildOptimisations: {
    profile: 'risky'
  }
}
