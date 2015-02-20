gulp       = require 'gulp'
transform  = require 'vinyl-transform'
browserify = require 'browserify'
uglify     = require 'gulp-uglify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'

gulp.task 'build', ->
  gulp
    .src(['src/index.coffee'])
    .pipe plumber()
    .pipe(transform (filename) ->
      browserify
        entries: [filename]
        extensions: ['.coffee']
      .transform 'coffeeify'
      .transform 'debowerify'
      .bundle()
    )
    # .pipe uglify(mangle: false)
    .pipe rename('bundle.js')
    .pipe gulp.dest('public')

gulp.task 'watch', ->
  gulp.watch('src/**/*.coffee', ['build'])

gulp.task 'default', ['build']
