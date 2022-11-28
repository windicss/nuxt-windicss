import { visit } from 'unist-util-visit'
import { createUtils } from '@windicss/plugin-utils'
import { extname } from 'pathe'
import config from '#windicss/config'

export default async (nitroApp) => {
  const utils = createUtils({
    enablePreflight: false,
    scan: false,
    preflight: false,
    config,
  }, { name: 'nuxt-windicss-nitro' })
  nitroApp.hooks.hook('content:file:afterParse', async (content) => {
    if (!content.body || !Array.isArray(content.body.children))
      return

    const ext = extname(content.id)
    // only markdown supported
    if (!ext.endsWith('md'))
      return

    await utils.ensureInit()

    visit(content.body, n => !!n?.props?.class, (node) => {
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
    content.body.children.push({
      type: 'element',
      tag: 'style',
      props: {
        innerHTML: css,
      },
    })
  })
}
