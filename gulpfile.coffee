glob       = require 'glob'
gulp       = require 'gulp'
source     = require 'vinyl-source-stream'
browserify = require 'browserify'
uglify     = require 'gulp-uglify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'
mocha      = require 'gulp-mocha'
espower    = require 'gulp-espower'

browserifyIt = (files) ->
  browserify
    entries: files
    extensions: ['.coffee']
  .transform 'coffeeify'
  .transform 'debowerify'
  .transform 'brfs'
  .bundle()
  .pipe source('bundle.js')

gulp.task 'build', ->
  browserifyIt ['./src/index.coffee']
  # .pipe uglify(mangle: false)
  .pipe rename('bundle.js')
  .pipe gulp.dest('public')

gulp.task 'test', ->
  browserifyIt glob.sync('./test/**/*.coffee')
  .pipe espower()
  .pipe rename(extname: ".js")
  .pipe gulp.dest('test/espowered/')
  .pipe mocha()

gulp.task 'build:watch', ->
  gulp.watch(['src/**/*.coffee', 'src/**/*.html'], ['build'])

gulp.task 'test:watch', ->
  gulp.watch(['test/**/*.coffee'], ['test'])

gulp.task 'default', ['build']
