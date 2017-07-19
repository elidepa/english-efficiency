module.exports = app => {
    if (process.env.NODE_ENV === 'test') {
        return app.listen(4000)
    } else {
        return app.listen(3000)
    }
}