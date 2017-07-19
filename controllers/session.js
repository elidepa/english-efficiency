const models = require('../models')
const sessionConfig = require('../config/session')
const instructions = require('../config/instructions')
const logger = require('../config/logger').logger
const Promise = require('bluebird')
const _ = require('lodash')

const bigramProbabilities = [0.00881828477417,0.00871361945338,0.00862145054948,0.00851997697014,0.00845949344261,0.00841531067576,0.00830464362619,0.00829318829791,0.00824334423308,0.00823014293947,0.00821520801263,0.00815240518543,0.00814744411257,0.0081121137361,0.00808508729622,0.00807936931385,0.00790029449895,0.00788096480213,0.00786810740095,0.00786133123812,0.00780831695891,0.00778174377769,0.00777350258335,0.00777124148252,0.00775397470757,0.00773762202226,0.00766549656235,0.00766198732349,0.00766072966594,0.00765811569405,0.00761061948743,0.00760975807963,0.00756949518884,0.00756801933971,0.0075650974981,0.00753180321577,0.00750399617577,0.0075033650753,0.00743585192788,0.00741436779206,0.00741062326977,0.00739216504115,0.0073822110916,0.00738193773012,0.00735479500072,0.00731925876477,0.00731545290652,0.00725329178107,0.00721758679011,0.00717759206835,0.0071761235752,0.00715240938516,0.00715136277955,0.00714283708156,0.00710866213605,0.0070730670522,0.00706497524932,0.00702338427821,0.00701896419499,0.00701648349629,0.00691009243914,0.0068904904626,0.00688244322835,0.00686001092734,0.00685020777555,0.00680635408097,0.00678857747116,0.00678729309406,0.00676628850374,0.00676105147317,0.00675109276387,0.00674820878396,0.0067404308005,0.00673017017117,0.0067274169764,0.00672249538789,0.00670747294643,0.00668331047384,0.0066543009462,0.00665420369571,0.00665352229326,0.006636615529,0.00661851979913,0.00656300069792,0.00655541624184,0.00654939028158,0.00651281100983,0.00650856530678,0.00642410277365,0.00641139022052,0.00640827928676,0.00640138607718,0.00638481606571,0.00638064716782,0.00635299763251,0.00623506622051,0.00615837431484,0.00615409377903,0.0061388499007,0.00611960155246,0.00611359463122,0.00600647360046,0.005993890318,0.00599086646615,0.00588906565353,0.0058694982934,0.00585337656448,0.00584657324939,0.00583828889272,0.00583671471134,0.00571509448783,0.00569567900722,0.00569083649557,0.00566226724543,0.00555401079632,0.00549989852777,0.00537895527149,0.00535825757731,0.00534047252974,0.00532485760674,0.00531791431154,0.00530245851586,0.00529528675233,0.00527118767104,0.00523993294449,0.00520251584738,0.00519263946023,0.00510181378134,0.005099543161,0.00509908817152,0.00506885506186,0.0050490861693,0.00496496558142,0.00482949944179,0.0047923062696,0.00471769199777,0.00470336805062,0.00467212360082,0.00447957326541,0.00442297986546,0.0042981008312,0.00428060342439,0.00410897535715,0.0039963905583,0.00395989782759,0.00387269280914,0.00385112570211,0.00379408683219,0.00361161679624,0.0033411183039,0.00325634595387,0.00314483015313,0.00314483015313,0.00281187618766,0.00231749388103,0.00218068505728,0.00197045363172,0.00178388046907,0.000764066880557]
const bigramValues = ['in','er','re','on','at','ou','ed','es','ar','te','st','as','ve','se','ea','hi','de','be','no','li','wa','ho','ra','om','we','ca','yo','ly','ta','et','ad','il','ac','un','ge','rs','ul','tr','rt','ni','sa','mo','im','po','mi','ts','av','pl','ev','ab','da','rd','fe','op','ag','mp','fr','ba','up','ex','ga','gr','fa','ef','cr','sc','ds','ok','um','br','pi','kn','ew','ny','oi','mu','lu','tw','dr','oh','nk','pu','ui','ft','ju','va','rg','eg','af','hu','rc','aw','nu','ip','ph','jo','gs','rv','xt','hy','tc','yi','eq','oy','lk','ze','wr','sw','bs','ws','rb','rf','eb','dg','lm','lp','ax','kl','cs','yp','yl','hm','az','xe','py','za','bt','sq','dw','gt','uy','ky','hl','mn','uk','uo','ko','wt','fs','wd','wf','ji','ln','wc','tz','wb','yu','ku','gw','hp','vs','rq','rz','yk','hk','wg','zg','cw','wv']

function weightedRand(spec) {
  let i, sum=0, r=Math.random()
  for (i in spec) {
    sum += spec[i]
    if (r <= sum) return i
  }
}

module.exports = {
  generateSessionData: async (username) => {
    try {
      const user = await models.User.findOne({ email: username })
      const { group } = user
      const sessionType = sessionConfig.groupConfig[group][user.sessions.length ? user.sessions.length : 0]
      let interventions = sessionConfig.interventionConfig[group][sessionType]

      interventions = _.shuffle(interventions)

      const sessionData = await Promise.all(_.map(interventions, async intervention => {
        const session = _.merge(intervention, { instructions: instructions[intervention.type] })
        if (intervention.type === 'V') {
          return session
        } else if (intervention.type === 'A') {
          const sentences = await models.Sentence.aggregate([
            {
              $match: { intervention: 'A' }
            }
          ]).sample(200).exec()
          const interventionData = {
            sentences: _(sentences).uniq().take(100).map(sentenceObject => sentenceObject.sentence).value()
          }
          return _.merge(session, { interventionData })
        } else if (intervention.type === 'M') {
          const interventionData = await Promise.all(_(_.times(100, () => bigramValues[weightedRand(bigramProbabilities)]))
            .map(async bigram => {
              const found = await models.Pseudoword.aggregate([
                {
                  $match: { bigram }
                },
                {
                  $unwind: '$pseudoword'
                }
              ]).sample(1).exec()
              if (!found[0]) {
                logger.error(`found undefined, bigram=${bigram}`)
              }
              return {
                bigram: found[0].bigram,
                pseudoword: found[0].pseudoword
              }
            })
            .value()
          )
          return _.merge(session, {interventionData})
        }
      }))

      return sessionData
      
    } catch (err) {
      logger.error(`Generating session data failed: ${err}`)
    }
  }
}