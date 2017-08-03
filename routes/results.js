const logger = require('../config/logger').logger
const _ = require('lodash')
const models = require('../models')

module.exports = router => {

  router.get('/api/results', async (ctx, next) => {
    try {
      const email = ctx.state.user.user

      const { sessions } = await models.User.findOne({ email })

      results = _.map(sessions, session => _.pick(session, ['date', 'results']))
      ctx.body = JSON.stringify({ sessions: results })
      ctx.status = 200
    } catch (err) {
      logger.error(`Error fetching results: ${err}`)
      ctx.status = 500
    }
  })
}