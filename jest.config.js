module.exports = {
  preset: '@nuxt/test-utils',
  testTimeout: 50000,
  transform: {
    '^.+\\.jsx?$': 'esbuild-jest',
    '^.+\\.mjs$': 'esbuild-jest',
  },
  moduleFileExtensions: [
    'js',
    'mjs',
    'ts',
  ],
}
