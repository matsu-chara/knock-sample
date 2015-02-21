# knock-sample

[![Build Status](https://travis-ci.org/matsu-chara/knock-sample.svg)](https://travis-ci.org/matsu-chara/knock-sample)

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
    * [brfs](https://www.npmjs.com/package/brfs)
    * [espowerify](https://www.npmjs.com/package/espowerify)
* gulp-uglify
* gulp-rename
* gulp-plumber
* gulp-watch
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

### componentについて

#### やり方

1. componentにしたい部分（一つのViewModelとか）をガッと切り取って、ペッと.htmlにする。
1. html中でdata-bind:foreachを使っていて、その中に$rootがあったら$componentに置き換える。
1. src/index.coffeeみたいな感じにする。(fs.readFileSyncの部分はbrowserifyするときにbrfsによって対象ファイルの文字列に置き換えられる。)

#### 感想

ちょっとつまったけど、そこそこ気軽にできそう。

つまったのはコードを何処に置くかの構成で考えたのと、$rootが使えなかった二点。

component templateを使ってる時は$rootを$componentにしないといけないらしい。

[functions in knockout components (knockoutjs 3.2+)](http://stackoverflow.com/questions/25524216/functions-in-knockout-components-knockoutjs-3-2)によると、
$rootはko.applyBindingsに渡したのになるから$parentにしろとのことだけど、
[Binding context](http://knockoutjs.com/documentation/binding-context.html)には、
$rootは$parents[$parents.length - 1]と等しくて、
$parents[0]は$parentと同じだよって書いてあるから、
結局同じじゃないのかって気がする。

うーんと思ってたけど、 [Binding context](http://knockoutjs.com/documentation/binding-context.html)のところにちょうど$componentってのがあって、component template使ってる時のViewModelはこれやでって書いてあったから、これで良いらしい。

なんでかはもうちょっとknockoutのcontextについて調べないといけなさそう。

### textInput binding

標準のvalueでdata-bindすると、エンターを押した時にしかアップデートがかからないので、残り文字数をリアルタイムに更新したい！ってのはできない。

data-bind="value: hogehoge, valueUpdate: afterkeydown"とかやるとキー入力ごとにアップデートがかかるようになるらしくて、それを使おうとしてたけど、最近はdata-bind="textInput: hoge"でいい感じになるらしい。便利だ。

### knockout.mapping

mappingプラグインを使ってjsonとviewmodelを紐付けようとしたんだけどrequireが上手く行かなかった。
たぶんscript src=〜〜〜とかで読み込むのを前提に作ってあるんだと思う。

あんまり興味もなかったので今回はいいやってことにした。

### knockoutでjsonをやりとり

knockout自体は何も面倒を見てくれなかったけど、jqueryでぽちぽちするだけだからこれといって面倒なことはなかった。

## テスト

karma + mocha + power-assertみたいなおしゃれ構成にしたかったけど、
karmaの設定ではまったのと、そもそも現段階でkarmaの役割がわかんなかったので、
gulp + mocha + power-assertの構成にした。
power-assertをchaiにするのはそんなに大変じゃなさそう。

power-assertを使うためには別途gulp-espowerが必要。
gulp-mochaも必要。

[0からはじめるpower-assert](http://lealog.hateblo.jp/entry/2014/12/01/121031)

* mocha
* power-assert
* gulp-espower
* gulp-mocha
* sinon

### テストでもbowerをrequireできるように

上の構成で
hello的なテストは通ったけど、require 'Todo'すると
module momentが見つからないと言われた。

browserifyする必要がありそうだったので、gulpfileを書き換え。
使っていたespower-coffeeはcoffeeify→debowerifyの流れを崩すのでやめにして（元から
ベータだった不安もあり）、gulp-espowerに変更した。

### ajaxのテスト

viewmodelの初期化に通信が必要になっているせいで、
テスト全体がうまく行かなくなってしまった。
jquery.ajaxはundefinedだしrequest, brwoser-requestもダメだった。

viewmodelとmodelを一緒に書いてたからなのか・・・、
そもそもの設計のせいもありそう。
（newするだけで外部と通信するオブジェクトは行儀が悪いだろうし）

結局ロードはボタン押してやってもらう感じにグレードダウンした。

影響範囲を抑えられればstubにして抑えられそうだけど、
browserifyしてrequireしてるせいで$がグローバルじゃないからテストからstubに
差し替えられないんだよなー。そもそもアクセス権がないし・・・。

$.ajaxとかをDIするんだと思うんだけど、
viewmodelとmodelが分離してないから渡せないし、
componentにしてるからindex.coffeeからも渡せないんだよなー。

componentじゃなければnew viewmodel(jquery)とか、new viewmodel(dummy)とか
して、いい感じに出来そうなんだけども・・・。

あとブラウザ上でテストすれば$.ajaxも聞くから普通にテストできそうってのも
あって色々めんどくさい。

## ToDo

* valueUpdateを使って残り文字数をリアルタイムに更新
* 日付validationの結果もすぐ分かるように
