# knock-sample

knockout.jsの練習用

練習用なのでいろいろつめこむ

## wzrd

リクエストを返すときにbrowserifyしなおしてくれるサーバーを立てる。

[wzrd - もっとも簡単なフロントエンドの為のbrowserifyサーバー](http://qiita.com/mizchi/items/bc3dd566091a7c0d3346)

[mizchi-sandbox/minskl](https://github.com/mizchi-sandbox/minskl/blob/master/package.json)みたいなかんじで、
npm run serverとかで起動できるようにしたけど結局gulpに移行した。

移行理由はminifyとかしたかったからだけど、割りと色々なことがbrowserifyでできるらしい。
css周りとかでどうせgulpに巻き込まれるから、下手に頑張らずにgulpにした。

## gulp

* [browserify](http://browserify.org/)
    * [coffeeify](https://www.npmjs.com/package/coffeeify)
    * [debowerify](https://www.npmjs.com/package/debowerify)
* [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
* [gulp-concat](https://www.npmjs.com/package/gulp-concat)
* [vinyl-tranform](https://www.npmjs.com/package/vinyl-transform)


vinyl-ナンチャラにかんしては[gulp と browserify と vinyl の話](http://umai-bow.hateblo.jp/entry/2014/10/08/002235)を参照

## knockout.js

## テスト

* karma
* mocha
* chai
* Shinon.js
