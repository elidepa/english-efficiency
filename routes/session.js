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
    
  //   ctx.body = JSON.stringify({
  //     interventions: [
  //       {
  //         type: 'V',
  //         duration: 30000,
  //         instructions: [
  //           { text: 'placeholder' }
  //         ]
  //       },
  //       {
  //         type: 'M',
  //         duration: 30000,
  //         instructions: [
  //           { text: 'placeholder' }
  //         ],
  //         interventionData: {
  //           bigrams: [
  //             'ab',
  //             'ab',
  //             'ab',
  //             'ab',
  //             'ab',
  //             'ab'
  //           ],
  //           pseudowords: [
  //             'abba',
  //             'abba',
  //             'abba',
  //             'abba',
  //             'abba',
  //             'abba'
  //           ]
  //         }
  //       },
  //       {
  //         type: 'A',
  //         duration: 30000,
  //         instructions: [
  //           { text: "Your task is to type the shown sentences and react to changes on the screen as fast as possible." },
  //           { text: "1. Start typing the shown phrase as fast and accurately as possible." },
  //           {
  //             text: "2. While you are typing, a rectangle will appear at the top of the screen every couple of seconds. When this occurs, press the LEFT Ctrl key as fast as possible.",
  //             img: "/images/SoA_2.png"
  //           },
  //           {
  //             instruction: "3. Immediately resume typing after pressing the Ctrl key. "
  //           },
  //           {
  //             text: "4. You should press the LEFT Ctrl key within 2 seconds after the rectangle appears, or the screen will turn black. If that happens, press the Ctrl key to continue the exercise. ",
  //             img: "/images/SoA_3.png"},
  //           {
  //             text: "5. Press Enter when you finish the phrase to bring up the next one.",
  //             img: "/images/SoA_5.png"
  //           }
  //         ],
  //         interventionData: {
  //           sentences: [
  //             'Testilause 1',
  //             'Testilause 2',
  //             'Testilause 3'
  //           ]
  //         }
  //       }
  //     ]
  //   })
  })

}