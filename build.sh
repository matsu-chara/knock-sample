#!/usr/bin/bash

browserify -t debowerify  -o public/bundle.js src/index.js
# browserify -t debowerify -t coffeeify --extension=".coffee" -o public/bundle.js src/index.coffee
