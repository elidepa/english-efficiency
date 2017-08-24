const sessionController = require('../controllers/session')
const logger = require('../config/logger').logger

module.exports = router => {
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