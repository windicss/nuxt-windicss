/// <reference types="vitest" />
import { resolve } from 'node:path'
import type { AliasOptions } from 'vite'
import { defineConfig } from 'vite'

const r = (p: string) => resolve(__dirname, p)

export const alias: AliasOptions = {
  'nuxt-windicss': r('./packages/nuxt-windicss'),
}

export default defineConfig({
  test: {
    testTimeout: 1200000,
    include: ['playground/**/*.test.ts'],
  },
  resolve: {
    alias,
  },
})
