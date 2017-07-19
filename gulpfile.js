const gulp = require('gulp')
const nodemon = require('gulp-nodemon')

gulp.task('nodemon', () => {
    nodemon({
        script: 'app.js',
        nodeArgs: ['--harmony']
    }).on('restart')
})

gulp.task('default', ['nodemon'])