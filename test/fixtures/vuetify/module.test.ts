// @ts-nocheck nuxt internals not typed!
import { setupTest, getNuxt } from '@nuxt/test-utils'

const cheerio = require('cheerio')

describe('Dev test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: true
    }
  })

  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="button"]').text().trim()).toEqual('Hello World')
  })

  // test('nuxt options are updated', () => {
  //   const options = getNuxt().options
  //   expect(options.build.cache).toBeTruthy()
  //   expect(options.build.hardSource).toBeFalsy()
  //   expect(options.build.parallel).toBeFalsy()
  //
  //   expect(options.features.layouts).toBeFalsy()
  //   expect(options.features.store).toBeFalsy()
  //   expect(options.features.middleware).toBeFalsy()
  // })
})

describe('Production test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: false
    }
  })

  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="button"]').text().trim()).toEqual('Hello World')
  })
})
