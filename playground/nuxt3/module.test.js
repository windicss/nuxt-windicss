const cheerio = require('cheerio')
const execa = require('execa');
const fs = require('fs')
const globby = require("globby");
const path = require("pathe");

describe('nuxt3',  () => {

  test('renders css files without @apply', async() => {
    // Note: this is a hacky solution
    await execa('yarn', ['run', 'nuxt', 'build'], { cwd: __dirname });

    const globDir = path.join(__dirname, '.output', 'public', '_nuxt', 'assets')

    const cssFiles = await globby('*.css', {
      cwd: globDir,
      followSymbolicLinks: true
    })

    cssFiles
      .map(f => fs.readFileSync(path.join(globDir, f), 'utf-8'))
      .forEach(html => {
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
})
