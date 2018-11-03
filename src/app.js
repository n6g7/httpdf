import "@babel/polyfill"

import makeDebug from "debug"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import logger from "koa-logger"

import render from "./render"
import Resolver from "./resolve"

const debug = makeDebug("httpdf:app")

const srcRoot = process.env.HTTPDF_DOCUMENTS_SRC
if (!srcRoot)
  throw Error("Document root missing, set the HTTPDF_DOCUMENTS_SRC environment variable")

const distRoot = process.env.HTTPDF_DOCUMENTS_DIST
if (!distRoot)
  throw Error("Document root missing, set the HTTPDF_DOCUMENTS_DIST environment variable")

async function app() {
  const app = new Koa()
  const resolver = new Resolver(srcRoot, distRoot, !!process.env.HTTPDF_WATCH)

  app.use(logger())
  app.use(bodyParser())

  app.use(async (ctx, next) => {
    try {
      ctx.state.document = resolver.resolve(ctx.request.path)
    } catch (error) {
      debug("Can't find %o", ctx.request.url)
      ctx.throw(404, "document not found")
    }
    await next()
  })

  app.use(async (ctx, next) => {
    switch (ctx.method) {
      case "GET":
        ctx.state.props = ctx.request.query
        break
      case "POST":
      case "PUT":
        ctx.state.props = ctx.request.body
        break
      default:
        debug("Can't handle method %o", ctx.method)
        ctx.throw(405)
    }

    await next()
  })

  app.use(async ctx => {
    const {
      document: { filename: defaultFilename, Component },
      props,
    } = ctx.state
    const {
      query: { filename = defaultFilename },
    } = ctx.request

    ctx.set({
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/pdf",
    })

    try {
      ctx.response.body = await render(Component, props)
      debug("Returned %o", filename)
    } catch (errors) {
      ctx.response.status = 400
      ctx.response.body = { errors }
    }
  })

  app.listen(process.env.PORT)
}

app()
