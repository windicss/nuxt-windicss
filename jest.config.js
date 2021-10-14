module.exports = {
  preset: '@nuxt/test-utils',
  // @todo re-implement tests
  testTimeout: 50000,
  transformIgnorePatterns: [
    'node_modules/(?!@nuxt\\/kit)/dist',
  ],
  transform: {
    '^.+\\.jsx?$': 'esbuild-jest',
    '^.+\\.mjs$': 'esbuild-jest',
  },
  moduleFileExtensions: [
    'js',
    'mjs',
    'ts',
  ],
  roots: [
    '<rootDir>/playground',
  ],
}
