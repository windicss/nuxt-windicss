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
    expect($('style').first().html()).toMatchSnapshot()
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
    expect($('style').first().html()).toMatchSnapshot()
  })
})
