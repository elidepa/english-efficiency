const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))
const crypto = Promise.promisifyAll(require('crypto'))
const scrypt = require('scrypt')

const parseMongoError = require('../lib/parse-mongo-error')
const logger = require('../config/logger').logger
const models = require('../models')
const appSecret = require('../config/auth').appSecret

module.exports = router => {
  router.post('/api/login', async (ctx, next) => {
    try {
      // TODO: Actual auth logic
      logger.trace(ctx.request.body)
      const user = await models.User.findOne({ email: ctx.request.body.email })
      const token = await jwt.signAsync({ user: user.email }, appSecret, { expiresIn: 60 * 60 * 48 })
      ctx.status = 200
      ctx.body = JSON.stringify({token})
    } catch (err) {
      switch (err.name) {
      case 'TypeError': {
        switch (err.message) {
        case 'Cannot read property \'email\' of null': {
          logger.info(`Could not log in user: ${ctx.request.body.email}`)
          ctx.status = 400
          ctx.body = {
            err: 'Login error'
          }
          break
        }
        default: {
          logger.error(`Unknown error: ${err.message}`)
          ctx.status = 500
          ctx.body = {
            err: 'Unkown error' 
          }
        }
        }
        break
      }
      default: {
        logger.error(`Unknown error: ${err.message}`)
        ctx.status = 500
        ctx.body = {
          err: 'Unkown error' 
        }
      }
      }
    }
  })

  router.post('/api/user', async (ctx, next) => {
    try {
      const { email, group } = ctx.request.body

      const user = new models.User({
        email,
        group,
        sessions: []
      })

      logger.trace(`Creating user ${user.email}`)

      await user.save();

      logger.trace(`Succesfully created user ${user.email}`)

      ctx.status = 200
    } catch (err) {
      if (err.name === 'MongoError') {
        const code = parseMongoError.parseErrorCode(err.message)
        switch (code) {
        case 'E11000': {
          logger.info(`Tried to create user with duplicate email address: ${ctx.request.body.email}`)
          ctx.status = 400
          ctx.body = {
            err: 'Duplicate email' 
          }
          break
        }
        default: {
          logger.error(`Unknown error when creating user: ${err.message}`)
          ctx.status = 500
          ctx.body = {
            err: 'Unknown error' 
          }
        }
        }
      } else if (err.name === 'ValidationError') {
        logger.info(`Error validating user data: ${err.message}`)
        ctx.status = 400
        ctx.body = {
          err: 'Validation error' 
        }
      } else {
        logger.error(`Unknown error when creating user: ${err}`)
        ctx.status = 500
        ctx.body = {
          err: 'Unknown error' 
        }
      }
    }
  })
}
