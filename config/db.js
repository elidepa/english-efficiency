const mongoose = require('mongoose')
const models = require('../models')

const connectionStr = process.env.NODE_ENV === 'production' ? 'mongodb://ee:x7gdSYfJyRsWhe4@localhost/english-efficiency' : 'mongodb://localhost/test'

module.exports = async app => {
    mongoose.Promise = require('bluebird')
    mongoose.connect(connectionStr)
}