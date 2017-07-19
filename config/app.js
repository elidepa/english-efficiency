const Koa = require('koa')
const app = new Koa()
const helmet = require('koa-helmet')
const koaBody = require('koa-body')
const cors = require('kcors')
const requestLogger = require('./logger').requestLogger
const logger = require('./logger').logger

app.use(async (ctx, next) => {
  const requestArrived = Date.now()
  await next()
  requestLogger.info(`${ctx.method} ${ctx.path} ${ctx.status} ${Date.now() - requestArrived}ms`)
})

app.use(helmet())
app.use(cors())
app.use(koaBody())

module.exports = app