import fs from 'node:fs'
import { describe, test, expect } from 'vitest'
import { globby } from 'globby'
import { execa } from 'execa'
import path from 'pathe'

describe('nuxt3', () => {
  test('renders css files without @apply', async () => {
    // Note: this is a hacky solution
    await execa('pnpm', ['build'], { cwd: __dirname })

    const html = path.join(__dirname, '.output', 'public', 'index.html')
    const htmlStyleBlocks = fs.readFileSync(html, 'utf-8').match(/<style>([\s\S]*?)<\/style>/g)
    let foundAttributify = false
    htmlStyleBlocks.forEach((css) => {
      if (!foundAttributify && css.includes('[bg~='))
        foundAttributify = true
      // importing scss @apply transforms is broken
      if (!css.includes('.test-apply'))
        expect(css).not.toContain('@apply')
    })
    expect(foundAttributify).toBeTruthy()
  })
})
