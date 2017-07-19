const logger = require('./logger').logger

logger.info(`Starting app with '${process.env.NODE_ENV}' environment.`)

module.exports = app => {
    try {
        if (process.env.NODE_ENV === 'test') {
            const server = app.listen(4000)
            logger.info(`Listening on port 4000.`)
            return server
        } else if (process.env.NODE_ENV === 'production') {
            const server = app.listen(3001)
            logger.info(`Listening on port 3001.`)        
            return server
        } else {
            const server = app.listen(3001)
            logger.info(`Listening on port 3001.`)        
            return server
        }
    } catch (err) {
        logger.fatal(`Aborting! Couldn't start server: ${err}`)
        process.abort()
    }
}