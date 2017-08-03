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
      ctx.body = JSON.stringify({
        interventions: await sessionController.generateSessionData(user)
      })
      ctx.status = 200
    } catch (err) {
      logger.error(`Could not generate session data: ${err}`)
      ctx.status = 500
    }
    
  })

}