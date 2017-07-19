const _ = require('lodash')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const mkdirp = require('mkdirp')
const logger = require('../config/logger').logger
const models = require('../models')

const writeMResults = async ({ sectionsStr,practicePhaseKeystrokeStr, pseudoPhaseKeystrokeStr, pseudoPhaseStr }, user) => {
  try {
    mkdirp(`results/${user.email}/${user.sessions.length + 1}`, async (err) => {
      if (err) {
        throw err
      }
      
      await Promise.all([
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/mc_sections.csv`, sectionsStr),
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/mc_pseudoword_sections.csv`, pseudoPhaseStr),
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/mc_keypress_phase_keypresses.csv`, practicePhaseKeystrokeStr),
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/mc_pseudoword_phase_keypresses.csv`, pseudoPhaseKeystrokeStr)
      ])
    })
  } catch (err) {
    logger.error(`Error while writing results to file: ${err}`)
  }
}

const writeAResults = ({ sectionsStr, keystrokeStr, distractionStr }, user) => {
  try {
    mkdirp(`results/${user.email}/${user.sessions.length + 1}`, async (err) => {
      if (err) {
        throw err
      }
      
      await Promise.all([
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/sa_sections.csv`, sectionsStr),
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/sa_keystrokes.csv`, keystrokeStr),
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/sa_visual_stimulus.csv`, distractionStr)
      ])
    })
  } catch (err) {
    logger.error(`Error while writing results to file: ${err}`)
  }
}

const writeVResults = ({ clickStr, mouseStr }, user) => {
  try {
    mkdirp(`results/${user.email}/${user.sessions.length + 1}`, async (err) => {
      if (err) {
        throw err
      }
      
      await Promise.all([
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/vs_clicks.csv`, clickStr),
        fs.writeFileAsync(`results/${user.email}/${user.sessions.length + 1}/vs_mouse.csv`, mouseStr)
      ])
    })
  } catch (err) {
    logger.error(`Error while writing results to file: ${err}`)
  }
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

  return {
    mTrials: 123,
    avgIKI: 222,
    toWrite: {
      sectionsStr,
      practicePhaseKeystrokeStr,
      pseudoPhaseKeystrokeStr,
      pseudoPhaseStr
    }
  }
}

const parseAResults = async ({ sections }, user) => {
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

  return {
    wpm: 123,
    aErrorRate: 0.0123,
    avgReactionTime: 321,
    toWrite: {
      sectionsStr,
      keystrokeStr,
      distractionStr
    }
  }
}

const parseVResults = async ({ sections }, user) => {
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

  return {
    vTrials: 123,
    vErrorRate: 0.123,
    avgSearchTime: 321,
    toWrite: {
      clickStr,
      mouseStr
    }
  }
}

module.exports = {
  saveResults: async (results, email) => {
    try {
      const user = (await models.User.find({ email }))[0]

      const parsedResults = _(results)
        .map(async (interventionResults, key) => {
          switch (interventionResults.type) {
          case 'M':
            const mResults = parseMResults(interventionResults)
            await writeMResults(mResults.toWrite, user)
            return _.omit(mResults, 'toWrite')
          case 'A':
            const aResults = await parseAResults(interventionResults)
            await writeAResults(aResults.toWrite, user)
            return _.omit(aResults, 'toWrite')
          case 'V':
            const vResults = await parseVResults(interventionResults)
            await writeVResults(vResults.toWrite, user)
            return _.omit(vResults, 'toWrite')
          }
        })
        .reduce((o, values) => { return _.merge(o,values) }, {})

      const session = {
        sessionNum: user.sessions.length + 1,
        date: Date.now(),
        hasAppliedSkills: false,
        results: parsedResults
      }

      user.sessions.push(session)
      user.save()

    } catch (err) {
      logger.error(`Could not find corresponding user while saving results: ${err}`)
      throw err
    }
  }
}