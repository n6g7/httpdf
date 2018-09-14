import "@babel/polyfill"

import makeDebug from "debug"
import Koa from "koa"
import bodyParser from "koa-bodyparser"

import render from "./render"
import Resolver from "./resolve"

const debug = makeDebug("httpdf:app")

const documentRoot = process.env.HTTPDF_DOCUMENT_ROOT
if (!documentRoot)
  throw Error("Document root missing, set the HTTPDF_DOCUMENT_ROOT environment variable")

async function app() {
  const app = new Koa()
  const resolver = new Resolver(documentRoot)
  await resolver.buildIndex()

  app.use(bodyParser())

  app.use(async (ctx, next) => {
    try {
      ctx.state.document = resolver.resolve(ctx.request.url)
    } catch (error) {
      debug("Can't find %o", ctx.request.url)
      ctx.throw(404, "document not found")
    }
    await next()
  })

  app.use(async ctx => {
    const {
      state: {
        document: { filename, Component },
      },
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
