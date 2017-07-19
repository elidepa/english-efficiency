const mongoose = require('mongoose')
const models = require('../models')

module.exports = async app => {
    mongoose.Promise = require('bluebird')
    mongoose.connect('mongodb://localhost/test')
}