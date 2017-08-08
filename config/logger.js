const log4js = require('log4js')

log4js.configure({
  appenders: {
    stdout: { type: 'stdout', layout: { type: 'colored' } },
    app: { type: 'file', filename: './logs/application.log' },
    request: { type: 'file', filename: './logs/request.log' }
  },
  categories: {
    default: { appenders: ['stdout','app'], level: 'info'},
    devel: { appenders: ['stdout'], level: 'trace'},
    request: { appenders: ['request','stdout'], level: 'info' }
  }
})

module.exports = {
  logger: process.env.NODE_ENV === 'production' ? log4js.getLogger() : log4js.getLogger('devel'),
  requestLogger: log4js.getLogger('request')
}