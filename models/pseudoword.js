const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pseudoword = new Schema({
  bigram: {
    type: String,
    required: true
  },
  pseudoword: {
    type: [String],
    required: true
  }
})

module.exports = mongoose.model('Pseudoword', pseudoword)