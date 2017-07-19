const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  group: {
    type: String,
    required: true
  },
  sessions: [{
    sessionNum: Number,
    date: {
      type: Date,
      default: Date.now()
    },
    hasAppliedSkills: Boolean,
    results: {
      wpm: Number,
      aErrorRate: Number,
      tErrorRate: Number,
      vErrorRate: Number,
      avgReactionTime: Number,
      avgIKI: Number,
      mTrials: Number,
      vTrials: Number,
      avgSearchTime: Number,
    }
  }]
})

module.exports = mongoose.model('User', user)