const Router = require('koa-router')
const jwt = require('koa-jwt')
const config = require('../config/auth')

const router = new Router()
const routerProtected = new Router()

module.exports = app => {
  
  // Unauthenticated routes
  require('./test')(router)
  require('./auth')(router)
  app.use(router.routes())

  app.use(jwt({ secret: config.appSecret }))

  // Authenticated routes
  require('./session')(routerProtected)
  require('./results')(routerProtected)
  app.use(routerProtected.routes())
}