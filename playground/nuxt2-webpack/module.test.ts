import { describe, test, expect } from 'vitest'
import cheerio from 'cheerio'
import execa from 'execa'

const fs = require('node:fs')
const path = require('pathe')

describe('nuxt2-webpack', () => {
  test('index html transformed correctly', async () => {
    // Note: this is a hacky solution
    await execa('pnpm', ['generate'], { cwd: __dirname })

    const html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8')

    const $ = cheerio.load(html)
    $('style').each((i, $s) => {
      const html = $($s).html()
      expect(html).not.toContain('@apply')
    })
  })
})
