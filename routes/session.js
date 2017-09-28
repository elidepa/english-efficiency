const resultsController = require('../controllers/results')
const sessionController = require('../controllers/session')
const logger = require('../config/logger').logger

module.exports = router => {

  router.post('/api/session', (ctx, next) => {
    try {
      resultsController.saveResults(ctx.request.body, ctx.state.user.user)
      ctx.status = 200
    } catch (err) {
      ctx.status = 500
    }
  })

  router.get('/api/session', async (ctx, next) => {
    const { user } = ctx.state.user

    // logger.debug(await sessionController.generateSessionData(user))

    try {
      ctx.body = JSON.stringify(await sessionController.generateSessionData(user))
      ctx.status = 200
    } catch (err) {
      logger.error(`Could not generate session data: ${err}`)
      ctx.status = 500
    }
    
  })

  router.get('/api/sessions', async (ctx, next) => {
    try {
      ctx.body = JSON.stringify({
        data: await sessionController.getAllSessionDates()
      })
      ctx.status = 200
    } catch (err) {
      logger.error(`Could not fetch session dates: ${err}`)
      ctx.status = 500
    }
  })
}