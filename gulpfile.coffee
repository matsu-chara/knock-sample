gulp       = require 'gulp'
transform  = require 'vinyl-transform'
browserify = require 'browserify'
uglify     = require 'gulp-uglify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'
mocha      = require 'gulp-mocha'
espower    = require 'gulp-espower'

browserifyIt = (filename) ->
  browserify
    entries: [filename]
    extensions: ['.coffee']
  .transform 'coffeeify'
  .transform 'debowerify'
  .transform 'brfs'
  .bundle()

gulp.task 'build', ->
  gulp
    .src(['src/index.coffee'])
    .pipe plumber()
    .pipe transform(browserifyIt)
    # .pipe uglify(mangle: false)
    .pipe rename('bundle.js')
    .pipe gulp.dest('public')

gulp.task 'test', ->
  gulp
    .src(['test/**/*.coffee'])
    .pipe plumber()
    .pipe transform(browserifyIt)
    .pipe espower()
    .pipe rename(extname: ".js")
    .pipe gulp.dest('test/espowered/')
    .pipe mocha()

gulp.task 'watch', ->
  gulp.watch(['src/**/*.coffee', 'src/**/*.html'], ['build'])

gulp.task 'watch.test', ->
  gulp.watch(['test/**/*.coffee'], ['test'])

gulp.task 'default', ['build']
