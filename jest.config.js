module.exports = {
  preset: '@nuxt/test-utils',
  transformIgnorePatterns: [
    'node_modules/(?!@nuxtjs\\/vuetify)',
  ],
  roots: [
    '<rootDir>/test/fixtures',
  ],
  testTimeout: 10000,
}
