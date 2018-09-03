import "@babel/polyfill"

import makeDebug from "debug"
import Koa from "koa"
import bodyParser from "koa-bodyparser"

import render from "./render"
import Resolver from "./resolve"

const debug = makeDebug("httpdf:app")

async function app() {
  const app = new Koa()
  const resolver = new Resolver("./build/documents")
  await resolver.buildIndex()

  app.use(bodyParser())

  app.use(async (ctx, next) => {
    try {
      ctx.document = resolver.resolve(ctx.request.url)
      await next()
    } catch (error) {
      debug("Can't find %o:", ctx.request.url)
      debug(error)
      ctx.status = 404
      ctx.body = "document not found"
    }
  })

  app.use(async ctx => {
    const {
      document: { filename, Component },
      request: { body: props },
    } = ctx

    ctx.set({
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/pdf",
    })
    ctx.response.body = await render(Component, props)
    debug("Rendering %o", filename)
  })

  app.listen(8000)
}

app()
