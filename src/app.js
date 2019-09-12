import "@babel/polyfill"

import makeDebug from "debug"
import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"

import { srcRoot, distRoot } from "./config"
import render from "./render"
import Resolver from "./resolve"

const debug = makeDebug("httpdf:app")

export default async function makeApp() {
  const app = express()
  const resolver = new Resolver(srcRoot, distRoot)

  if (process.env.HTTPDF_WATCH) await resolver.startWatching()
  else await resolver.indexOnce()

  debug("resolver ready")

  app.use(morgan("dev"))
  app.use(bodyParser.json())

  app.use(async (req, res, next) => {
    req.state = {}
    try {
      req.state.document = resolver.resolve(req.path)
      next()
    } catch (error) {
      debug("Can't find %o", req.originalUrl)
      res.status(404).send("document not found")
    }
  })

  app.use(async (req, res, next) => {
    switch (req.method) {
      case "GET":
        req.state.props = req.query
        next()
        break
      case "POST":
      case "PUT":
        req.state.props = req.body
        next()
        break
      default:
        debug("Can't handle method %o", req.method)
        res.status(405).send("method not allowed")
    }
  })

  app.use(async (req, res) => {
    const {
      state: {
        document: { filename: defaultFilename, Component },
        props,
      },
      query: { filename = defaultFilename },
    } = req

    try {
      const stream = await render(Component, props)
      stream.pipe(res)
      res.set({
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/pdf",
      })
      debug("Returned %o", filename)
    } catch (errors) {
      res.status(400).json({ errors })
    }
  })

  return app
}

if (require.main === module) {
  makeApp().then(app => {
    app.listen(process.env.PORT)
    debug("httpdf listening on %o", process.env.port)
  })
}
