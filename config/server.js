module.exports = app => {
    if (process.env.NODE_ENV === 'test') {
        return app.listen(4000)
    } else if (process.env.NODE_ENV === 'production') {
        return app.listen(3001)
    } else {
        return app.listen(3001)
    }
}