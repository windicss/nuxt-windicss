import { describe, test, expect } from 'vitest'
import cheerio from 'cheerio'

const fs = require('node:fs')
const execa = require('execa')
const path = require('pathe')

describe('nuxt2-vite', () => {
  test('index html transformed correctly', async () => {
    // Note: this is a hacky solution
    await execa('pnpm', ['generate'], { cwd: __dirname })

    const html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8')

    const $ = cheerio.load(html)
    $('style').each((i, $s) => {
      const html = $($s).html()
      expect(html).not.toContain('@apply')
      if (html) {
        expect(html).toMatchSnapshot('script-' + i)
      }
    })
  })
})
