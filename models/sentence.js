const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sentence = new Schema({
  sentence: {
    type: String,
    required: true
  },
  intervention: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Sentence', sentence)