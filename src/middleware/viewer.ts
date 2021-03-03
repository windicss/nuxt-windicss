const { withoutTrailingSlash, withTrailingSlash } = require('ufo')
// @ts-ignore
import createServer from 'tailwind-config-viewer/server'
import type { ServerMiddleware } from "@nuxt/types/config/server-middleware";

const server = createServer({
  tailwindConfigProvider: () => process.nuxt ? process.nuxt.$config.windicss.getConfig() : {}
}).asMiddleware()

const middleware : ServerMiddleware = (req, res) : void => {
    // @ts-ignore
    if (req.originalUrl === withoutTrailingSlash(process.nuxt.$config.windicss.viewerPath)) {
        res.writeHead(301, { Location: withTrailingSlash(req.originalUrl) })
        res.end()
    }
    server(req, res)
}

export default middleware
