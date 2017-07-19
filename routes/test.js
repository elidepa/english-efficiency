const models = require('../models')

module.exports = router => {
  router.get('/', (ctx, next) => {
    ctx.body = 'Hello, world!'
    return next()
  })

  router.get('/json', (ctx, next) => {
    ctx.body = {
      foo: 'bar'
    }
    return next()
  })

  router.post('/test', async (ctx, next) => {
    try {
      const test = new models.User({
        username: 'samulid',
        password: 'pippelikeiju',
        salt: 'vituttaa'
      })
      test.sessions.push({})
      await test.save()
      ctx.status = 200
    } catch (err) {
      console.log(err)
      ctx.status = 500
    }
  })
    
  router.get('/test', async (ctx, next) => {
    const dbRes = await models.Sentence.findOne()
    ctx.status = 200
    ctx.body = JSON.stringify(dbRes)
    return next()
  })
}