import { describe, test, expect } from 'vitest'
import cheerio from 'cheerio'
import { globby } from 'globby'

const execa = require('execa');
const fs = require('fs')
const path = require("pathe");

describe('nuxt3',  () => {

  test('renders css files without @apply', async() => {
    // Note: this is a hacky solution
    await execa('pnpm', ['build'], { cwd: __dirname });

    const globDir = path.join(__dirname, '.output', 'public', '_nuxt', 'assets')

    const cssFiles = await globby('*.css', {
      cwd: globDir,
      followSymbolicLinks: true
    })

    let foundAttributify = false
    cssFiles
      .map(f => fs.readFileSync(path.join(globDir, f), 'utf-8'))
      .forEach(css => {
        if (!foundAttributify && css.includes('[bg~=blue-400]'))
          foundAttributify = true
        expect(css).not.toContain('@apply')
      })
    expect(foundAttributify).toBeTruthy()
  })
})
