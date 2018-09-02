import "@babel/polyfill"

import Koa from "koa"
import bodyParser from "koa-bodyparser"

import render from "./render"

const app = new Koa()

app.use(bodyParser())

app.use(async ctx => {
  const { body: props } = ctx.request

  ctx.set("Content-Disposition", 'attachment; filename="filename.pdf"')
  ctx.set("Content-Type", "application/pdf")
  ctx.response.body = await render(props)
})

app.listen(80)
