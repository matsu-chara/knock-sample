gulp = require 'gulp'
transform = require 'vinyl-transform'
browserify = require 'browserify'
uglify = require 'gulp-uglify'
concat = require 'gulp-concat'

gulp.task 'build', ->
  gulp.src(['./src/index.coffee'])
  .pipe(transform (filename) ->
    browserify
      entries: [filename]
      extensions: ['.coffee']
    .transform 'coffeeify'
    .transform 'debowerify'
    .bundle()
  )
  .pipe concat('bundle.js')
  .pipe uglify(mangle: false)
  .pipe gulp.dest 'public'
