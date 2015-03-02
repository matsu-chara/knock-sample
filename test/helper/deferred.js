(function () {
    "use strict";
    var deferred = function (success, fail) {
        var resolve, reject;

        var p = new Promise(function (_resolve, _reject) {
            /*
             * 外からresolveさせたり、rejectさせるために
             * 外側の変数に_resolve, _rejectへの参照を渡す
             * (p.resolve()のように外から普通にresolveすることはできない。)
             */
            resolve = _resolve;
            reject = _reject;
        });

        // 通信成功時・失敗時の挙動を指定
        var promise = p.then(success, fail);

        // 外部からthen()、resolve(), reject()できるように公開
        return {
            promise: promise,
            resolve: resolve,
            reject: reject
        };
  };
  module.exports = deferred;
})();
