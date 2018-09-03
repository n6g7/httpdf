import "@babel/polyfill"

import makeDebug from "debug"
import Koa from "koa"
import bodyParser from "koa-bodyparser"

import render from "./render"
import buildResolver from "./resolve"

const debug = makeDebug("pdfgen:app")

async function app() {
  const app = new Koa()
  const resolve = await buildResolver("./build/documents")

  app.use(bodyParser())

  app.use(async (ctx, next) => {
    try {
      ctx.document = resolve(ctx.request.url)
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

  app.listen(80)
}

app()
