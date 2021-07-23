import { setupTest, getNuxt } from '@nuxt/test-utils'

const cheerio = require('cheerio')

describe('Dev test', () => {

  // @ts-ignore
  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: true,
    },
  })

  test('renders index route', async() => {
    // @ts-ignore
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    $('style').each((i, $s) => {
      const html = $($s).html()
      if (html) {
        expect(html).toMatchSnapshot('script-' + i)
      }
    })
  })
})


describe('Dev manual configuration test', () => {

  // @ts-ignore
  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      css: [
        'virtual:windi-base.css',
        '@/css/main.css',
        'virtual:windi-components.css',
        'virtual:windi-utilities.css',
      ],
      dev: true,
    },
  })

  test('renders index route', async() => {
    // @ts-ignore
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    $('style').each((i, $s) => {
      const html = $($s).html()
      if (html) {
        expect(html).toMatchSnapshot('script-' + i)
      }
    })
  })
})

describe('Production test', () => {
  // @ts-ignore
  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: false,
    },
  })

  test('renders index route', async() => {
    // @ts-ignore
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    $('style').each((i, $s) => {
      const html = $($s).html()
      if (html) {
        expect(html).toMatchSnapshot('script-' + i)
      }
    })
  })
})
