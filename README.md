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

### 使ってるプラグイン

* [browserify](http://browserify.org/)
    * [coffeeify](https://www.npmjs.com/package/coffeeify)
    * [debowerify](https://www.npmjs.com/package/debowerify)
* [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
* [gulp-concat](https://www.npmjs.com/package/gulp-concat)
* [vinyl-tranform](https://www.npmjs.com/package/vinyl-transform)


vinyl-ナンチャラにかんしては[gulp と browserify と vinyl の話](http://umai-bow.hateblo.jp/entry/2014/10/08/002235)を参照

### 監視

[gulpでbrowserify使ってcoffee-scriptの監視とコンパイル](http://qiita.com/mizchi/items/10a8e2b3e6c2c3235e61)を参考。

## knockout.js

### 日付validationについて。

ユーザー入力文字列をパースして日付を生成するのはつらいので、Date.parse()をisNanで見てOKだったら通す感じにした。
moment推奨の方法っぽい（結局変なふうにパースされたら終わりだけど・・）

Entity(=ToDo)のconstructorでvalidationしてダメだったらnullを返そうとしたけど、JSでは無理らしい。
代わりにstatic methodでvaliadtionメソッドを追加してviewModelで判定してもらうようにした。

ついでにEntityのconstructorでもvalidationを読んでダメだったらconsole.warnを出すようにしたから、
呼び忘れに関してはまあ気づく範囲内かな。

ToDoのテストでvalidationもテストできるし。

static methodを呼ぶときはクラス名を直書きしなくても@constructorで良いらしい。便利だ。

### ファイル分割について

module.exports = クラス名、としてあれば、
クラス名 = require 'クラス名'、でOK。

ある程度書いてからコピペで分割してもまったく問題なかったから
ちゃんと分割できて書けてるぽい。

## テスト

* karma
* mocha
* chai
* Shinon.js

## ToDo

* valueUpdateを使って残り文字数をリアルタイムに更新
* 日付validationの結果もすぐ分かるように
* jsonをgetしてモデルの初期値を設定
* jsonをpostして記録
