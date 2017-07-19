const _ = require('lodash')
const logger = require('../config/logger').logger

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

  logger.debug('\n' + sectionsStr)
  logger.debug('\n' + practicePhaseKeystrokeStr)
  logger.debug('\n' + pseudoPhaseKeystrokeStr)
  logger.debug('\n' + pseudoPhaseStr)
}

const parseAResults = ({ sections }) => {
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

  logger.debug('\n' + sectionsStr)
  logger.debug('\n' + keystrokeStr)
  logger.debug('\n' + distractionStr)
}

const parseVResults = ({ sections }) => {
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
  logger.debug('\n' + clickStr)
  logger.debug('\n' + mouseStr)
}

module.exports = {
  saveResults: (results) => {
    _.forEach(results, (interventionResults, key) => {
      switch (interventionResults.type) {
      case 'M':
        parseMResults(interventionResults)
        break
      case 'A':
        parseAResults(interventionResults)
        break
      case 'V':
        parseVResults(interventionResults)
        break
      }
    })
  }
}