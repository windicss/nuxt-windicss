module.exports = {
  preset: '@nuxt/test-utils',
  transformIgnorePatterns: [
    'node_modules/(?!@nuxtjs\\/vuetify)'
  ],
  testTimeout: 10000
}
