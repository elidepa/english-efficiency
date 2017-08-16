const _ = require('lodash')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const mkdirp = require('mkdirp')
const logger = require('../config/logger').logger
const models = require('../models')
const levenshtein = require('js-levenshtein')

const writeMResults = async ({ sectionsStr,practicePhaseKeystrokeStr, pseudoPhaseKeystrokeStr, pseudoPhaseStr }, user) => {
  try {
    const sesNum = user.sessions.length + 1
    mkdirp(`results/${user.email}/${sesNum}`, async (err) => {
      if (err) {
        throw err
      }
      
      await Promise.all([
        fs.writeFileAsync(`results/${user.email}/${sesNum}/mc_sections.csv`, sectionsStr),
        fs.writeFileAsync(`results/${user.email}/${sesNum}/mc_pseudoword_sections.csv`, pseudoPhaseStr),
        fs.writeFileAsync(`results/${user.email}/${sesNum}/mc_keypress_phase_keypresses.csv`, practicePhaseKeystrokeStr),
        fs.writeFileAsync(`results/${user.email}/${sesNum}/mc_pseudoword_phase_keypresses.csv`, pseudoPhaseKeystrokeStr)
      ])
    })
  } catch (err) {
    logger.error(`Error while writing results to file: ${err}`)
  }
}

const writeAResults = async ({ sectionsStr, keystrokeStr, distractionStr }, user) => {
  try {
    const sesNum = user.sessions.length + 1
    mkdirp(`results/${user.email}/${sesNum}`, async (err) => {
      if (err) {
        throw err
      }
      
      await Promise.all([
        fs.writeFileAsync(`results/${user.email}/${sesNum}/sa_sections.csv`, sectionsStr),
        fs.writeFileAsync(`results/${user.email}/${sesNum}/sa_keystrokes.csv`, keystrokeStr),
        fs.writeFileAsync(`results/${user.email}/${sesNum}/sa_visual_stimulus.csv`, distractionStr)
      ])
    })
  } catch (err) {
    logger.error(`Error while writing results to file: ${err}`)
  }
}

const writeTResults = async ({ sectionsStr, keystrokeStr }, user) => {
  try {
    const sesNum = user.sessions.length + 1
    mkdirp(`results/${user.email}/${sesNum}`, async (err) => {
      if (err) {
        throw err
      }
      
      await Promise.all([
        fs.writeFileAsync(`results/${user.email}/${sesNum}/t_sections.csv`, sectionsStr),
        fs.writeFileAsync(`results/${user.email}/${sesNum}/t_keystrokes.csv`, keystrokeStr)
      ])
    })
  } catch (err) {
    logger.error(`Error while writing results to file: ${err}`)
  }
}

const writeVResults = async ({ clickStr, mouseStr }, user) => {
  try {
    const sesNum = user.sessions.length + 1
    mkdirp(`results/${user.email}/${sesNum}`, async (err) => {
      if (err) {
        throw err
      }
      
      await Promise.all([
        fs.writeFileAsync(`results/${user.email}/${sesNum}/vs_clicks.csv`, clickStr),
        fs.writeFileAsync(`results/${user.email}/${sesNum}/vs_mouse.csv`, mouseStr)
      ])
    })
  } catch (err) {
    logger.error(`Error while writing results to file: ${err}`)
  }
}

const calculateAvgIKI = (sections) => {
  const totalIKI = _.reduce(sections, (total, { keystrokes }) => {
    // filter for single characters
    const filteredKeystrokes = _.filter(keystrokes, ({key}) => { return key.length === 1 })
    if (_.isEmpty(filteredKeystrokes)) {
      return total
    }
    return total + (_.last(filteredKeystrokes).keydown - filteredKeystrokes[0].keyup)
  }, 0)

  const totalLength = _.reduce(sections, (total, { keystrokes }) => {
    const filteredKeystrokes = _.filter(keystrokes, ({key}) => { return key.length === 1 })
    if (_.isEmpty(filteredKeystrokes)) {
      return total
    }
    return total + filteredKeystrokes.length - 1
  }, 0)

  return totalIKI / totalLength
}

const calculateMAvgIKI = (sections) => {
  const totalIKI = _.reduce(sections, (total, { keystrokes }) => {
    // filter for single characters
    const filteredKeystrokes = _.filter(keystrokes, ({key}) => { return key.length === 1 })
    return total + _.reduce(filteredKeystrokes, (iki, { keyup, keydown, key }, index) => {
      if (index > 0) {
        logger.trace(`iki=${iki}, keydown=${keydown}, keyup=${filteredKeystrokes[index - 1].keyup}`)
        return iki + keydown - filteredKeystrokes[index - 1].keyup
      }
      return iki
    }, 0)
  }, 0)

  const totalLength = _.reduce(sections, (total, { keystrokes }) => {
    return total + keystrokes.length - 1
  }, 0)

  logger.trace(`totalLength=${totalLength}, totalIKI=${totalIKI}`)

  return totalIKI / totalLength
}

const calculateWPM = (sections) => {
  const avgIKI = calculateAvgIKI(sections)
  logger.trace(`avgIKI=${avgIKI}`)
  return 60000 / (avgIKI * 5)
}

const calculateError = (sections) => {
  const totalEditDistance = _(sections)
    .map(({ section }) => {
      const { sentence, userInput } = section
      return levenshtein(sentence, userInput)
    })
    .sum()
  const errorLength = _.reduce(sections, (total, { section }) => {
    const { sentence, userInput } = section
    return total + Math.max(sentence.length, userInput.length)
  }, 0)
  logger.trace(`totalEditDistance=${totalEditDistance}, errorLength=${errorLength}`)
  return totalEditDistance / errorLength
}

const calculateAvgReactionTime = (sections) => {
  const totalReactionTimes = _.reduce(sections, (total, { distractions }) => {
    return total + _.reduce(distractions, (sumReactionTimes, { distractionShown, reaction }) => {
      return sumReactionTimes + reaction - distractionShown
    }, 0)
  }, 0)
  const totalDistractions = _.reduce(sections, (total, {distractions}) => {
    return total + distractions.length
  }, 0)

  return totalReactionTimes / totalDistractions
}

const calculateVError = (sections) => {
  return _.reduce(sections, (errors, { section }) => {
    if (section.cue !== section.kbdClick.key) {
      return errors + 1
    }
    return errors
  }, 0) / sections.length
}

const calculateAvgSearchTime = (sections) => {
  return _.reduce(sections, (total, { section }) => {
    return total + section.kbdClick.time - section.cueShown
  }, 0) / sections.length
}

const parseMResults = ({ sections }) => {
  let sectionsStr = 'section_id\tbigram\tpseudoword\n'
  let practicePhaseKeystrokeStr = 'section_id\trepetition\tkeystroke_id\tletter\tpressTime\treleaseTime\tcorrect\n'
  let pseudoPhaseKeystrokeStr = 'section_id\trepetition\tkeystroke_id\tletter\tpressTime\treleaseTime\n'
  let pseudoPhaseStr = 'section_id\tpseudo_section_id\tpseudoword\tuser_input\n'
  
  _.forEach(sections, ({ keystrokes, section }, sectionKey) => {
    sectionsStr += `${sectionKey}\t${section.bigram}\t${section.pseudoword}\n`

    _.forEach(keystrokes.practiceKeystrokes, ({ repetition, key, keydown, keyup, correct }, keystrokeId) => {
      practicePhaseKeystrokeStr += `${sectionKey}\t${repetition}\t${keystrokeId}\t${key}\t${keydown}\t${keyup}\t${correct}\n`;
    })

    _.forEach(keystrokes.pseudoKeystrokes, ({ repetition, key, keydown, keyup }, keystrokeId) => {
      pseudoPhaseKeystrokeStr += `${sectionKey}\t${repetition}\t${keystrokeId}\t${key}\t${keydown}\t${keyup}\n`
    })

    _.forEach(section.userInputs, (userInput, repetition) => {
      pseudoPhaseStr += `${sectionKey}\t${repetition}\t${section.pseudoword}\t${userInput}\n`
    })
  })

  _.map(sections, ({keystrokes}) => {
    return {
      keystrokes: keystrokes.pseudoKeystrokes
    }
  })

  const mTrials = _.values(sections).length
  const avgIKI = calculateMAvgIKI(_.map(sections, ({keystrokes}) => {
    return {
      keystrokes: keystrokes.pseudoKeystrokes
    }
  }))

  return {
    mTrials,
    avgIKI,
    toWrite: {
      sectionsStr,
      practicePhaseKeystrokeStr,
      pseudoPhaseKeystrokeStr,
      pseudoPhaseStr
    }
  }
}

const parseAResults = ({ sections }, user) => {
  let sectionsStr = 'section_id\tstimulus\tuser_input\n'
  let keystrokeStr = 'section_id\tkeystroke_id\tpress_time\trelease_time\tletter\n'
  let distractionStr = 'section_id\tvisual_stimulus_id\tstimulus_shown\treaction\n'

  _.forEach(sections, ({ section, keystrokes, distractions }, sectionId) => {
    sectionsStr += `${sectionId}\t${section.sentence}\t${section.userInput}\n`

    _.forEach(keystrokes, ({ key, keydown, keyup }, keystrokeId) => {
      keystrokeStr += `${sectionId}\t${keystrokeId}\t${keydown}\t${keyup}\t${key}\n`
    })

    _.forEach(distractions, ({ reaction, distractionShown }, distractionId) => {
      distractionStr += `${sectionId}\t${distractionId}\t${distractionShown}\t${reaction}\n`
    })
  })

  const wpm = calculateWPM(sections)
  const aErrorRate = calculateError(sections)
  const avgReactionTime = calculateAvgReactionTime(sections)

  return {
    wpm,
    aErrorRate,
    avgReactionTime,
    toWrite: {
      sectionsStr,
      keystrokeStr,
      distractionStr
    }
  }
}

const parseTResults = ({ sections }, user) => {
  let sectionsStr = 'section_id\tstimulus\tuser_input\n'
  let keystrokeStr = 'section_id\tkeystroke_id\tpress_time\trelease_time\tletter\n'

  _.forEach(sections, ({ section, keystrokes, distractions }, sectionId) => {
    sectionsStr += `${sectionId}\t${section.sentence}\t${section.userInput}\n`

    _.forEach(keystrokes, ({ key, keydown, keyup }, keystrokeId) => {
      keystrokeStr += `${sectionId}\t${keystrokeId}\t${keydown}\t${keyup}\t${key}\n`
    })
  })

  const wpm = calculateWPM(sections)
  const tErrorRate = calculateError(sections)

  return {
    wpm,
    tErrorRate,
    toWrite: {
      sectionsStr,
      keystrokeStr
    }
  }
}

const parseVResults = ({ sections }, user) => {
  let clickStr = ''
  let mouseStr = ''
  clickStr += 'section_id\tbigram\tcue\tcue_position\tcue_shown_time\tcue_clicked_time\ttarget_clicked_time\tclick_x\tclick_y\tclicked_key\n'
  mouseStr += 'section_id\ttimestamp\tx\ty\n'
  _.forEach(sections, ({ section }, sectionKey) => {
    const { bigram, cue, cuePosition, cueShown, cueClick, kbdClick, mouseMoves } = section;
    clickStr += `${sectionKey}\t${bigram}\t${cue}\t${cuePosition}\t${cueShown}\t${cueClick.time}\t${kbdClick.time}\t${kbdClick.x}\t${kbdClick.y}\t${kbdClick.key}\n`
    _.forEach(mouseMoves, ({ time, x, y }, key) => {
      mouseStr += `${sectionKey}\t${time}\t${x}\t${y}\n`
    })
  })

  const sectionsArray = _.values(sections)
  vErrorRate = calculateVError(sectionsArray)
  avgSearchTime = calculateAvgSearchTime(sectionsArray)
  vTrials = sectionsArray.length

  return {
    vTrials,
    vErrorRate,
    avgSearchTime,
    toWrite: {
      clickStr,
      mouseStr
    }
  }
}

module.exports = {
  saveResults: async (results, email) => {
    try {
      const user = await models.User.findOne({ email })

      logger.trace('results:')
      logger.trace(results)
      const parsedResults = await Promise.all(_(results)
        .map(async (interventionResults, key) => {
          switch (interventionResults.type) {
          case 'M':
            const mResults = parseMResults(interventionResults)
            await writeMResults(mResults.toWrite, user)
            return _.omitBy(mResults, (value, key) => { return isNaN(value) || key === 'toWrite' })
          case 'A':
            const aResults = parseAResults(interventionResults)
            await writeAResults(aResults.toWrite, user)
            return _.omitBy(aResults, (value, key) => { return isNaN(value) || key === 'toWrite' })
          case 'V':
            const vResults = parseVResults(interventionResults)
            await writeVResults(vResults.toWrite, user)
            return _.omitBy(vResults, (value, key) => { return isNaN(value) || key === 'toWrite' })
          case 'T':
            const tResults = parseTResults(interventionResults)
            await writeTResults(tResults.toWrite, user)
            return _.omitBy(tResults, (value, key) => { return isNaN(value) || key === 'toWrite' })
          }
        })
        .value())

      const result = _.reduce(parsedResults, (o, values) => {
          return _.merge(o,values) 
        }, {})

      logger.trace('result:')
      logger.trace(result)

      const session = {
        sessionNum: user.sessions.length + 1,
        date: Date.now(),
        hasAppliedSkills: false,
        results: result
      }

      user.sessions.push(session)
      user.save()

    } catch (err) {
      logger.error(`Could not find corresponding user while saving results: ${err}`)
      throw err
    }
  }
}