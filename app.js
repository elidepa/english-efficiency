const app = require('./config/app')

require('./config/db')(app)

require('./routes')(app)

const server = require('./config/server')(app)

module.exports = server