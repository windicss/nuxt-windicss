import { visit } from 'unist-util-visit'
import { createUtils } from '@windicss/plugin-utils'
import config from '#windicss/config'

export default async (nitroApp) => {
  const utils = createUtils({
    enablePreflight: false,
    scan: false,
    preflight: false,
    config,
  }, { name: 'nuxt-windicss-nitro' })
  nitroApp.hooks.hook('content:file:afterParse', async (file) => {
    await utils.ensureInit()

    visit(file.body, n => !!n?.props?.class, (node) => {
      utils.addClasses([
        // @todo attributify support
        ...node.props.class.split(' '),
      ])
    })
    // only if there's classes to add
    if (!utils.classesPending.size)
      return
    const css = await utils.generateCSS()
    // add to the end of the file
    file.body.children.push({
      type: 'element',
      tag: 'style',
      props: {
        innerHTML: css,
      },
    })
  })
}
