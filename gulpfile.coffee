gulp       = require 'gulp'
transform  = require 'vinyl-transform'
browserify = require 'browserify'
uglify     = require 'gulp-uglify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'
mocha      = require 'gulp-mocha'

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
      .transform 'brfs'
      .bundle()
    )
    # .pipe uglify(mangle: false)
    .pipe rename('bundle.js')
    .pipe gulp.dest('public')

gulp.task 'test', ->
  require 'espower-coffee/guess'
  gulp
    .src(['test/**/*.coffee'])
    .pipe mocha()

gulp.task 'watch', ->
  gulp.watch(['src/**/*.coffee', 'src/**/*.html'], ['build'])

gulp.task 'default', ['build']
