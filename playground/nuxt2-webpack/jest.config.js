module.exports = {
  preset: '@nuxt/test-utils',
  // @todo re-implement tests
  testTimeout: 10000,
  "transformIgnorePatterns": [
    'node_modules/(?!@nuxt\\/kit)/dist',
  ],
  "moduleFileExtensions": [
    "js",
    "mjs",
    "ts"
  ]
}
