import { NuxtWindiOptions } from './interfaces'

export const NAME = 'nuxt-windicss'
export const NUXT_CONFIG_KEY = 'windicss'
export const defaultWindiOptions: Partial<NuxtWindiOptions> = {
  analyze: false,
  scan: {
    dirs: ['./'],
    exclude: [
      'node_modules',
      'node_modules_dev',
      'node_modules_prod',
      'dist',
      '.git',
      '.github',
      '.nuxt',
      // testing files & folders
      'coverage',
      '**/__snapshots__',
      '*.test.js',
    ],
  },
  preflight: {
    alias: {
      // add nuxt aliases
      'nuxt-link': 'a',
      // @nuxt/image module
      'nuxt-img': 'img',
    },
  },
}
