module.exports = {
  preset: '@nuxt/test-utils',
  testTimeout: 150000,
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
