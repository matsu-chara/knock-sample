(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == 'function' && require;
                if (!u && a)
                    return a(o, !0);
                if (i)
                    return i(o, !0);
                var f = new Error('Cannot find module \'' + o + '\'');
                throw f.code = 'MODULE_NOT_FOUND', f;
            }
            var l = n[o] = { exports: {} };
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == 'function' && require;
    for (var o = 0; o < r.length; o++)
        s(r[o]);
    return s;
}({
    1: [
        function (require, module, exports) {
            var util = require('util/');
            var pSlice = Array.prototype.slice;
            var hasOwn = Object.prototype.hasOwnProperty;
            var assert = module.exports = ok;
            assert.AssertionError = function AssertionError(options) {
                this.name = 'AssertionError';
                this.actual = options.actual;
                this.expected = options.expected;
                this.operator = options.operator;
                if (options.message) {
                    this.message = options.message;
                    this.generatedMessage = false;
                } else {
                    this.message = getMessage(this);
                    this.generatedMessage = true;
                }
                var stackStartFunction = options.stackStartFunction || fail;
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, stackStartFunction);
                } else {
                    var err = new Error();
                    if (err.stack) {
                        var out = err.stack;
                        var fn_name = stackStartFunction.name;
                        var idx = out.indexOf('\n' + fn_name);
                        if (idx >= 0) {
                            var next_line = out.indexOf('\n', idx + 1);
                            out = out.substring(next_line + 1);
                        }
                        this.stack = out;
                    }
                }
            };
            util.inherits(assert.AssertionError, Error);
            function replacer(key, value) {
                if (util.isUndefined(value)) {
                    return '' + value;
                }
                if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
                    return value.toString();
                }
                if (util.isFunction(value) || util.isRegExp(value)) {
                    return value.toString();
                }
                return value;
            }
            function truncate(s, n) {
                if (util.isString(s)) {
                    return s.length < n ? s : s.slice(0, n);
                } else {
                    return s;
                }
            }
            function getMessage(self) {
                return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' + self.operator + ' ' + truncate(JSON.stringify(self.expected, replacer), 128);
            }
            function fail(actual, expected, message, operator, stackStartFunction) {
                throw new assert.AssertionError({
                    message: message,
                    actual: actual,
                    expected: expected,
                    operator: operator,
                    stackStartFunction: stackStartFunction
                });
            }
            assert.fail = fail;
            function ok(value, message) {
                if (!value)
                    fail(value, true, message, '==', assert.ok);
            }
            assert.ok = ok;
            assert.equal = function equal(actual, expected, message) {
                if (actual != expected)
                    fail(actual, expected, message, '==', assert.equal);
            };
            assert.notEqual = function notEqual(actual, expected, message) {
                if (actual == expected) {
                    fail(actual, expected, message, '!=', assert.notEqual);
                }
            };
            assert.deepEqual = function deepEqual(actual, expected, message) {
                if (!_deepEqual(actual, expected)) {
                    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
                }
            };
            function _deepEqual(actual, expected) {
                if (actual === expected) {
                    return true;
                } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
                    if (actual.length != expected.length)
                        return false;
                    for (var i = 0; i < actual.length; i++) {
                        if (actual[i] !== expected[i])
                            return false;
                    }
                    return true;
                } else if (util.isDate(actual) && util.isDate(expected)) {
                    return actual.getTime() === expected.getTime();
                } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
                    return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;
                } else if (!util.isObject(actual) && !util.isObject(expected)) {
                    return actual == expected;
                } else {
                    return objEquiv(actual, expected);
                }
            }
            function isArguments(object) {
                return Object.prototype.toString.call(object) == '[object Arguments]';
            }
            function objEquiv(a, b) {
                if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
                    return false;
                if (a.prototype !== b.prototype)
                    return false;
                if (isArguments(a)) {
                    if (!isArguments(b)) {
                        return false;
                    }
                    a = pSlice.call(a);
                    b = pSlice.call(b);
                    return _deepEqual(a, b);
                }
                try {
                    var ka = objectKeys(a), kb = objectKeys(b), key, i;
                } catch (e) {
                    return false;
                }
                if (ka.length != kb.length)
                    return false;
                ka.sort();
                kb.sort();
                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] != kb[i])
                        return false;
                }
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!_deepEqual(a[key], b[key]))
                        return false;
                }
                return true;
            }
            assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
                if (_deepEqual(actual, expected)) {
                    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
                }
            };
            assert.strictEqual = function strictEqual(actual, expected, message) {
                if (actual !== expected) {
                    fail(actual, expected, message, '===', assert.strictEqual);
                }
            };
            assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
                if (actual === expected) {
                    fail(actual, expected, message, '!==', assert.notStrictEqual);
                }
            };
            function expectedException(actual, expected) {
                if (!actual || !expected) {
                    return false;
                }
                if (Object.prototype.toString.call(expected) == '[object RegExp]') {
                    return expected.test(actual);
                } else if (actual instanceof expected) {
                    return true;
                } else if (expected.call({}, actual) === true) {
                    return true;
                }
                return false;
            }
            function _throws(shouldThrow, block, expected, message) {
                var actual;
                if (util.isString(expected)) {
                    message = expected;
                    expected = null;
                }
                try {
                    block();
                } catch (e) {
                    actual = e;
                }
                message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');
                if (shouldThrow && !actual) {
                    fail(actual, expected, 'Missing expected exception' + message);
                }
                if (!shouldThrow && expectedException(actual, expected)) {
                    fail(actual, expected, 'Got unwanted exception' + message);
                }
                if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
                    throw actual;
                }
            }
            assert.throws = function (block, error, message) {
                _throws.apply(this, [true].concat(pSlice.call(arguments)));
            };
            assert.doesNotThrow = function (block, message) {
                _throws.apply(this, [false].concat(pSlice.call(arguments)));
            };
            assert.ifError = function (err) {
                if (err) {
                    throw err;
                }
            };
            var objectKeys = Object.keys || function (obj) {
                var keys = [];
                for (var key in obj) {
                    if (hasOwn.call(obj, key))
                        keys.push(key);
                }
                return keys;
            };
        },
        { 'util/': 6 }
    ],
    2: [
        function (require, module, exports) {
            function EventEmitter() {
                this._events = this._events || {};
                this._maxListeners = this._maxListeners || undefined;
            }
            module.exports = EventEmitter;
            EventEmitter.EventEmitter = EventEmitter;
            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._maxListeners = undefined;
            EventEmitter.defaultMaxListeners = 10;
            EventEmitter.prototype.setMaxListeners = function (n) {
                if (!isNumber(n) || n < 0 || isNaN(n))
                    throw TypeError('n must be a positive number');
                this._maxListeners = n;
                return this;
            };
            EventEmitter.prototype.emit = function (type) {
                var er, handler, len, args, i, listeners;
                if (!this._events)
                    this._events = {};
                if (type === 'error') {
                    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
                        er = arguments[1];
                        if (er instanceof Error) {
                            throw er;
                        }
                        throw TypeError('Uncaught, unspecified "error" event.');
                    }
                }
                handler = this._events[type];
                if (isUndefined(handler))
                    return false;
                if (isFunction(handler)) {
                    switch (arguments.length) {
                    case 1:
                        handler.call(this);
                        break;
                    case 2:
                        handler.call(this, arguments[1]);
                        break;
                    case 3:
                        handler.call(this, arguments[1], arguments[2]);
                        break;
                    default:
                        len = arguments.length;
                        args = new Array(len - 1);
                        for (i = 1; i < len; i++)
                            args[i - 1] = arguments[i];
                        handler.apply(this, args);
                    }
                } else if (isObject(handler)) {
                    len = arguments.length;
                    args = new Array(len - 1);
                    for (i = 1; i < len; i++)
                        args[i - 1] = arguments[i];
                    listeners = handler.slice();
                    len = listeners.length;
                    for (i = 0; i < len; i++)
                        listeners[i].apply(this, args);
                }
                return true;
            };
            EventEmitter.prototype.addListener = function (type, listener) {
                var m;
                if (!isFunction(listener))
                    throw TypeError('listener must be a function');
                if (!this._events)
                    this._events = {};
                if (this._events.newListener)
                    this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
                if (!this._events[type])
                    this._events[type] = listener;
                else if (isObject(this._events[type]))
                    this._events[type].push(listener);
                else
                    this._events[type] = [
                        this._events[type],
                        listener
                    ];
                if (isObject(this._events[type]) && !this._events[type].warned) {
                    var m;
                    if (!isUndefined(this._maxListeners)) {
                        m = this._maxListeners;
                    } else {
                        m = EventEmitter.defaultMaxListeners;
                    }
                    if (m && m > 0 && this._events[type].length > m) {
                        this._events[type].warned = true;
                        console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
                        if (typeof console.trace === 'function') {
                            console.trace();
                        }
                    }
                }
                return this;
            };
            EventEmitter.prototype.on = EventEmitter.prototype.addListener;
            EventEmitter.prototype.once = function (type, listener) {
                if (!isFunction(listener))
                    throw TypeError('listener must be a function');
                var fired = false;
                function g() {
                    this.removeListener(type, g);
                    if (!fired) {
                        fired = true;
                        listener.apply(this, arguments);
                    }
                }
                g.listener = listener;
                this.on(type, g);
                return this;
            };
            EventEmitter.prototype.removeListener = function (type, listener) {
                var list, position, length, i;
                if (!isFunction(listener))
                    throw TypeError('listener must be a function');
                if (!this._events || !this._events[type])
                    return this;
                list = this._events[type];
                length = list.length;
                position = -1;
                if (list === listener || isFunction(list.listener) && list.listener === listener) {
                    delete this._events[type];
                    if (this._events.removeListener)
                        this.emit('removeListener', type, listener);
                } else if (isObject(list)) {
                    for (i = length; i-- > 0;) {
                        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                            position = i;
                            break;
                        }
                    }
                    if (position < 0)
                        return this;
                    if (list.length === 1) {
                        list.length = 0;
                        delete this._events[type];
                    } else {
                        list.splice(position, 1);
                    }
                    if (this._events.removeListener)
                        this.emit('removeListener', type, listener);
                }
                return this;
            };
            EventEmitter.prototype.removeAllListeners = function (type) {
                var key, listeners;
                if (!this._events)
                    return this;
                if (!this._events.removeListener) {
                    if (arguments.length === 0)
                        this._events = {};
                    else if (this._events[type])
                        delete this._events[type];
                    return this;
                }
                if (arguments.length === 0) {
                    for (key in this._events) {
                        if (key === 'removeListener')
                            continue;
                        this.removeAllListeners(key);
                    }
                    this.removeAllListeners('removeListener');
                    this._events = {};
                    return this;
                }
                listeners = this._events[type];
                if (isFunction(listeners)) {
                    this.removeListener(type, listeners);
                } else {
                    while (listeners.length)
                        this.removeListener(type, listeners[listeners.length - 1]);
                }
                delete this._events[type];
                return this;
            };
            EventEmitter.prototype.listeners = function (type) {
                var ret;
                if (!this._events || !this._events[type])
                    ret = [];
                else if (isFunction(this._events[type]))
                    ret = [this._events[type]];
                else
                    ret = this._events[type].slice();
                return ret;
            };
            EventEmitter.listenerCount = function (emitter, type) {
                var ret;
                if (!emitter._events || !emitter._events[type])
                    ret = 0;
                else if (isFunction(emitter._events[type]))
                    ret = 1;
                else
                    ret = emitter._events[type].length;
                return ret;
            };
            function isFunction(arg) {
                return typeof arg === 'function';
            }
            function isNumber(arg) {
                return typeof arg === 'number';
            }
            function isObject(arg) {
                return typeof arg === 'object' && arg !== null;
            }
            function isUndefined(arg) {
                return arg === void 0;
            }
        },
        {}
    ],
    3: [
        function (require, module, exports) {
            if (typeof Object.create === 'function') {
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                };
            } else {
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function () {
                    };
                    TempCtor.prototype = superCtor.prototype;
                    ctor.prototype = new TempCtor();
                    ctor.prototype.constructor = ctor;
                };
            }
        },
        {}
    ],
    4: [
        function (require, module, exports) {
            var process = module.exports = {};
            process.nextTick = function () {
                var canSetImmediate = typeof window !== 'undefined' && window.setImmediate;
                var canMutationObserver = typeof window !== 'undefined' && window.MutationObserver;
                var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;
                if (canSetImmediate) {
                    return function (f) {
                        return window.setImmediate(f);
                    };
                }
                var queue = [];
                if (canMutationObserver) {
                    var hiddenDiv = document.createElement('div');
                    var observer = new MutationObserver(function () {
                        var queueList = queue.slice();
                        queue.length = 0;
                        queueList.forEach(function (fn) {
                            fn();
                        });
                    });
                    observer.observe(hiddenDiv, { attributes: true });
                    return function nextTick(fn) {
                        if (!queue.length) {
                            hiddenDiv.setAttribute('yes', 'no');
                        }
                        queue.push(fn);
                    };
                }
                if (canPost) {
                    window.addEventListener('message', function (ev) {
                        var source = ev.source;
                        if ((source === window || source === null) && ev.data === 'process-tick') {
                            ev.stopPropagation();
                            if (queue.length > 0) {
                                var fn = queue.shift();
                                fn();
                            }
                        }
                    }, true);
                    return function nextTick(fn) {
                        queue.push(fn);
                        window.postMessage('process-tick', '*');
                    };
                }
                return function nextTick(fn) {
                    setTimeout(fn, 0);
                };
            }();
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            function noop() {
            }
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.binding = function (name) {
                throw new Error('process.binding is not supported');
            };
            process.cwd = function () {
                return '/';
            };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
        },
        {}
    ],
    5: [
        function (require, module, exports) {
            module.exports = function isBuffer(arg) {
                return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
            };
        },
        {}
    ],
    6: [
        function (require, module, exports) {
            (function (process, global) {
                var formatRegExp = /%[sdj%]/g;
                exports.format = function (f) {
                    if (!isString(f)) {
                        var objects = [];
                        for (var i = 0; i < arguments.length; i++) {
                            objects.push(inspect(arguments[i]));
                        }
                        return objects.join(' ');
                    }
                    var i = 1;
                    var args = arguments;
                    var len = args.length;
                    var str = String(f).replace(formatRegExp, function (x) {
                        if (x === '%%')
                            return '%';
                        if (i >= len)
                            return x;
                        switch (x) {
                        case '%s':
                            return String(args[i++]);
                        case '%d':
                            return Number(args[i++]);
                        case '%j':
                            try {
                                return JSON.stringify(args[i++]);
                            } catch (_) {
                                return '[Circular]';
                            }
                        default:
                            return x;
                        }
                    });
                    for (var x = args[i]; i < len; x = args[++i]) {
                        if (isNull(x) || !isObject(x)) {
                            str += ' ' + x;
                        } else {
                            str += ' ' + inspect(x);
                        }
                    }
                    return str;
                };
                exports.deprecate = function (fn, msg) {
                    if (isUndefined(global.process)) {
                        return function () {
                            return exports.deprecate(fn, msg).apply(this, arguments);
                        };
                    }
                    if (process.noDeprecation === true) {
                        return fn;
                    }
                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            if (process.throwDeprecation) {
                                throw new Error(msg);
                            } else if (process.traceDeprecation) {
                                console.trace(msg);
                            } else {
                                console.error(msg);
                            }
                            warned = true;
                        }
                        return fn.apply(this, arguments);
                    }
                    return deprecated;
                };
                var debugs = {};
                var debugEnviron;
                exports.debuglog = function (set) {
                    if (isUndefined(debugEnviron))
                        debugEnviron = process.env.NODE_DEBUG || '';
                    set = set.toUpperCase();
                    if (!debugs[set]) {
                        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                            var pid = process.pid;
                            debugs[set] = function () {
                                var msg = exports.format.apply(exports, arguments);
                                console.error('%s %d: %s', set, pid, msg);
                            };
                        } else {
                            debugs[set] = function () {
                            };
                        }
                    }
                    return debugs[set];
                };
                function inspect(obj, opts) {
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    if (arguments.length >= 3)
                        ctx.depth = arguments[2];
                    if (arguments.length >= 4)
                        ctx.colors = arguments[3];
                    if (isBoolean(opts)) {
                        ctx.showHidden = opts;
                    } else if (opts) {
                        exports._extend(ctx, opts);
                    }
                    if (isUndefined(ctx.showHidden))
                        ctx.showHidden = false;
                    if (isUndefined(ctx.depth))
                        ctx.depth = 2;
                    if (isUndefined(ctx.colors))
                        ctx.colors = false;
                    if (isUndefined(ctx.customInspect))
                        ctx.customInspect = true;
                    if (ctx.colors)
                        ctx.stylize = stylizeWithColor;
                    return formatValue(ctx, obj, ctx.depth);
                }
                exports.inspect = inspect;
                inspect.colors = {
                    'bold': [
                        1,
                        22
                    ],
                    'italic': [
                        3,
                        23
                    ],
                    'underline': [
                        4,
                        24
                    ],
                    'inverse': [
                        7,
                        27
                    ],
                    'white': [
                        37,
                        39
                    ],
                    'grey': [
                        90,
                        39
                    ],
                    'black': [
                        30,
                        39
                    ],
                    'blue': [
                        34,
                        39
                    ],
                    'cyan': [
                        36,
                        39
                    ],
                    'green': [
                        32,
                        39
                    ],
                    'magenta': [
                        35,
                        39
                    ],
                    'red': [
                        31,
                        39
                    ],
                    'yellow': [
                        33,
                        39
                    ]
                };
                inspect.styles = {
                    'special': 'cyan',
                    'number': 'yellow',
                    'boolean': 'yellow',
                    'undefined': 'grey',
                    'null': 'bold',
                    'string': 'green',
                    'date': 'magenta',
                    'regexp': 'red'
                };
                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];
                    if (style) {
                        return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
                    } else {
                        return str;
                    }
                }
                function stylizeNoColor(str, styleType) {
                    return str;
                }
                function arrayToHash(array) {
                    var hash = {};
                    array.forEach(function (val, idx) {
                        hash[val] = true;
                    });
                    return hash;
                }
                function formatValue(ctx, value, recurseTimes) {
                    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        if (!isString(ret)) {
                            ret = formatValue(ctx, ret, recurseTimes);
                        }
                        return ret;
                    }
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) {
                        return primitive;
                    }
                    var keys = Object.keys(value);
                    var visibleKeys = arrayToHash(keys);
                    if (ctx.showHidden) {
                        keys = Object.getOwnPropertyNames(value);
                    }
                    if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
                        return formatError(value);
                    }
                    if (keys.length === 0) {
                        if (isFunction(value)) {
                            var name = value.name ? ': ' + value.name : '';
                            return ctx.stylize('[Function' + name + ']', 'special');
                        }
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        }
                        if (isDate(value)) {
                            return ctx.stylize(Date.prototype.toString.call(value), 'date');
                        }
                        if (isError(value)) {
                            return formatError(value);
                        }
                    }
                    var base = '', array = false, braces = [
                            '{',
                            '}'
                        ];
                    if (isArray(value)) {
                        array = true;
                        braces = [
                            '[',
                            ']'
                        ];
                    }
                    if (isFunction(value)) {
                        var n = value.name ? ': ' + value.name : '';
                        base = ' [Function' + n + ']';
                    }
                    if (isRegExp(value)) {
                        base = ' ' + RegExp.prototype.toString.call(value);
                    }
                    if (isDate(value)) {
                        base = ' ' + Date.prototype.toUTCString.call(value);
                    }
                    if (isError(value)) {
                        base = ' ' + formatError(value);
                    }
                    if (keys.length === 0 && (!array || value.length == 0)) {
                        return braces[0] + base + braces[1];
                    }
                    if (recurseTimes < 0) {
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        } else {
                            return ctx.stylize('[Object]', 'special');
                        }
                    }
                    ctx.seen.push(value);
                    var output;
                    if (array) {
                        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                    } else {
                        output = keys.map(function (key) {
                            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                        });
                    }
                    ctx.seen.pop();
                    return reduceToSingleString(output, base, braces);
                }
                function formatPrimitive(ctx, value) {
                    if (isUndefined(value))
                        return ctx.stylize('undefined', 'undefined');
                    if (isString(value)) {
                        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, '\\\'').replace(/\\"/g, '"') + '\'';
                        return ctx.stylize(simple, 'string');
                    }
                    if (isNumber(value))
                        return ctx.stylize('' + value, 'number');
                    if (isBoolean(value))
                        return ctx.stylize('' + value, 'boolean');
                    if (isNull(value))
                        return ctx.stylize('null', 'null');
                }
                function formatError(value) {
                    return '[' + Error.prototype.toString.call(value) + ']';
                }
                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    var output = [];
                    for (var i = 0, l = value.length; i < l; ++i) {
                        if (hasOwnProperty(value, String(i))) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
                        } else {
                            output.push('');
                        }
                    }
                    keys.forEach(function (key) {
                        if (!key.match(/^\d+$/)) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
                        }
                    });
                    return output;
                }
                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
                    if (desc.get) {
                        if (desc.set) {
                            str = ctx.stylize('[Getter/Setter]', 'special');
                        } else {
                            str = ctx.stylize('[Getter]', 'special');
                        }
                    } else {
                        if (desc.set) {
                            str = ctx.stylize('[Setter]', 'special');
                        }
                    }
                    if (!hasOwnProperty(visibleKeys, key)) {
                        name = '[' + key + ']';
                    }
                    if (!str) {
                        if (ctx.seen.indexOf(desc.value) < 0) {
                            if (isNull(recurseTimes)) {
                                str = formatValue(ctx, desc.value, null);
                            } else {
                                str = formatValue(ctx, desc.value, recurseTimes - 1);
                            }
                            if (str.indexOf('\n') > -1) {
                                if (array) {
                                    str = str.split('\n').map(function (line) {
                                        return '  ' + line;
                                    }).join('\n').substr(2);
                                } else {
                                    str = '\n' + str.split('\n').map(function (line) {
                                        return '   ' + line;
                                    }).join('\n');
                                }
                            }
                        } else {
                            str = ctx.stylize('[Circular]', 'special');
                        }
                    }
                    if (isUndefined(name)) {
                        if (array && key.match(/^\d+$/)) {
                            return str;
                        }
                        name = JSON.stringify('' + key);
                        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            name = name.substr(1, name.length - 2);
                            name = ctx.stylize(name, 'name');
                        } else {
                            name = name.replace(/'/g, '\\\'').replace(/\\"/g, '"').replace(/(^"|"$)/g, '\'');
                            name = ctx.stylize(name, 'string');
                        }
                    }
                    return name + ': ' + str;
                }
                function reduceToSingleString(output, base, braces) {
                    var numLinesEst = 0;
                    var length = output.reduce(function (prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf('\n') >= 0)
                            numLinesEst++;
                        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                    }, 0);
                    if (length > 60) {
                        return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
                    }
                    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                }
                function isArray(ar) {
                    return Array.isArray(ar);
                }
                exports.isArray = isArray;
                function isBoolean(arg) {
                    return typeof arg === 'boolean';
                }
                exports.isBoolean = isBoolean;
                function isNull(arg) {
                    return arg === null;
                }
                exports.isNull = isNull;
                function isNullOrUndefined(arg) {
                    return arg == null;
                }
                exports.isNullOrUndefined = isNullOrUndefined;
                function isNumber(arg) {
                    return typeof arg === 'number';
                }
                exports.isNumber = isNumber;
                function isString(arg) {
                    return typeof arg === 'string';
                }
                exports.isString = isString;
                function isSymbol(arg) {
                    return typeof arg === 'symbol';
                }
                exports.isSymbol = isSymbol;
                function isUndefined(arg) {
                    return arg === void 0;
                }
                exports.isUndefined = isUndefined;
                function isRegExp(re) {
                    return isObject(re) && objectToString(re) === '[object RegExp]';
                }
                exports.isRegExp = isRegExp;
                function isObject(arg) {
                    return typeof arg === 'object' && arg !== null;
                }
                exports.isObject = isObject;
                function isDate(d) {
                    return isObject(d) && objectToString(d) === '[object Date]';
                }
                exports.isDate = isDate;
                function isError(e) {
                    return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
                }
                exports.isError = isError;
                function isFunction(arg) {
                    return typeof arg === 'function';
                }
                exports.isFunction = isFunction;
                function isPrimitive(arg) {
                    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || typeof arg === 'undefined';
                }
                exports.isPrimitive = isPrimitive;
                exports.isBuffer = require('./support/isBuffer');
                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }
                function pad(n) {
                    return n < 10 ? '0' + n.toString(10) : n.toString(10);
                }
                var months = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                function timestamp() {
                    var d = new Date();
                    var time = [
                        pad(d.getHours()),
                        pad(d.getMinutes()),
                        pad(d.getSeconds())
                    ].join(':');
                    return [
                        d.getDate(),
                        months[d.getMonth()],
                        time
                    ].join(' ');
                }
                exports.log = function () {
                    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
                };
                exports.inherits = require('inherits');
                exports._extend = function (origin, add) {
                    if (!add || !isObject(add))
                        return origin;
                    var keys = Object.keys(add);
                    var i = keys.length;
                    while (i--) {
                        origin[keys[i]] = add[keys[i]];
                    }
                    return origin;
                };
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }
            }.call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            './support/isBuffer': 5,
            '_process': 4,
            'inherits': 3
        }
    ],
    7: [
        function (require, module, exports) {
            (function (global) {
                (function (undefined) {
                    var moment, VERSION = '2.9.0', globalScope = typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window) ? global : this, oldGlobalMoment, round = Math.round, hasOwnProperty = Object.prototype.hasOwnProperty, i, YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, locales = {}, momentProperties = [], hasModule = typeof module !== 'undefined' && module && module.exports, aspNetJsonRegex = /^\/?Date\((\-?\d+)/i, aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, parseTokenOneOrTwoDigits = /\d\d?/, parseTokenOneToThreeDigits = /\d{1,3}/, parseTokenOneToFourDigits = /\d{1,4}/, parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, parseTokenDigits = /\d+/, parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, parseTokenT = /T/i, parseTokenOffsetMs = /[\+\-]?\d+/, parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, parseTokenOneDigit = /\d/, parseTokenTwoDigits = /\d\d/, parseTokenThreeDigits = /\d{3}/, parseTokenFourDigits = /\d{4}/, parseTokenSixDigits = /[+-]?\d{6}/, parseTokenSignedNumber = /[+-]?\d+/, isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, isoFormat = 'YYYY-MM-DDTHH:mm:ssZ', isoDates = [
                            [
                                'YYYYYY-MM-DD',
                                /[+-]\d{6}-\d{2}-\d{2}/
                            ],
                            [
                                'YYYY-MM-DD',
                                /\d{4}-\d{2}-\d{2}/
                            ],
                            [
                                'GGGG-[W]WW-E',
                                /\d{4}-W\d{2}-\d/
                            ],
                            [
                                'GGGG-[W]WW',
                                /\d{4}-W\d{2}/
                            ],
                            [
                                'YYYY-DDD',
                                /\d{4}-\d{3}/
                            ]
                        ], isoTimes = [
                            [
                                'HH:mm:ss.SSSS',
                                /(T| )\d\d:\d\d:\d\d\.\d+/
                            ],
                            [
                                'HH:mm:ss',
                                /(T| )\d\d:\d\d:\d\d/
                            ],
                            [
                                'HH:mm',
                                /(T| )\d\d:\d\d/
                            ],
                            [
                                'HH',
                                /(T| )\d\d/
                            ]
                        ], parseTimezoneChunker = /([\+\-]|\d\d)/gi, proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'), unitMillisecondFactors = {
                            'Milliseconds': 1,
                            'Seconds': 1000,
                            'Minutes': 60000,
                            'Hours': 3600000,
                            'Days': 86400000,
                            'Months': 2592000000,
                            'Years': 31536000000
                        }, unitAliases = {
                            ms: 'millisecond',
                            s: 'second',
                            m: 'minute',
                            h: 'hour',
                            d: 'day',
                            D: 'date',
                            w: 'week',
                            W: 'isoWeek',
                            M: 'month',
                            Q: 'quarter',
                            y: 'year',
                            DDD: 'dayOfYear',
                            e: 'weekday',
                            E: 'isoWeekday',
                            gg: 'weekYear',
                            GG: 'isoWeekYear'
                        }, camelFunctions = {
                            dayofyear: 'dayOfYear',
                            isoweekday: 'isoWeekday',
                            isoweek: 'isoWeek',
                            weekyear: 'weekYear',
                            isoweekyear: 'isoWeekYear'
                        }, formatFunctions = {}, relativeTimeThresholds = {
                            s: 45,
                            m: 45,
                            h: 22,
                            d: 26,
                            M: 11
                        }, ordinalizeTokens = 'DDD w W M D d'.split(' '), paddedTokens = 'M D H h m s w W'.split(' '), formatTokenFunctions = {
                            M: function () {
                                return this.month() + 1;
                            },
                            MMM: function (format) {
                                return this.localeData().monthsShort(this, format);
                            },
                            MMMM: function (format) {
                                return this.localeData().months(this, format);
                            },
                            D: function () {
                                return this.date();
                            },
                            DDD: function () {
                                return this.dayOfYear();
                            },
                            d: function () {
                                return this.day();
                            },
                            dd: function (format) {
                                return this.localeData().weekdaysMin(this, format);
                            },
                            ddd: function (format) {
                                return this.localeData().weekdaysShort(this, format);
                            },
                            dddd: function (format) {
                                return this.localeData().weekdays(this, format);
                            },
                            w: function () {
                                return this.week();
                            },
                            W: function () {
                                return this.isoWeek();
                            },
                            YY: function () {
                                return leftZeroFill(this.year() % 100, 2);
                            },
                            YYYY: function () {
                                return leftZeroFill(this.year(), 4);
                            },
                            YYYYY: function () {
                                return leftZeroFill(this.year(), 5);
                            },
                            YYYYYY: function () {
                                var y = this.year(), sign = y >= 0 ? '+' : '-';
                                return sign + leftZeroFill(Math.abs(y), 6);
                            },
                            gg: function () {
                                return leftZeroFill(this.weekYear() % 100, 2);
                            },
                            gggg: function () {
                                return leftZeroFill(this.weekYear(), 4);
                            },
                            ggggg: function () {
                                return leftZeroFill(this.weekYear(), 5);
                            },
                            GG: function () {
                                return leftZeroFill(this.isoWeekYear() % 100, 2);
                            },
                            GGGG: function () {
                                return leftZeroFill(this.isoWeekYear(), 4);
                            },
                            GGGGG: function () {
                                return leftZeroFill(this.isoWeekYear(), 5);
                            },
                            e: function () {
                                return this.weekday();
                            },
                            E: function () {
                                return this.isoWeekday();
                            },
                            a: function () {
                                return this.localeData().meridiem(this.hours(), this.minutes(), true);
                            },
                            A: function () {
                                return this.localeData().meridiem(this.hours(), this.minutes(), false);
                            },
                            H: function () {
                                return this.hours();
                            },
                            h: function () {
                                return this.hours() % 12 || 12;
                            },
                            m: function () {
                                return this.minutes();
                            },
                            s: function () {
                                return this.seconds();
                            },
                            S: function () {
                                return toInt(this.milliseconds() / 100);
                            },
                            SS: function () {
                                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
                            },
                            SSS: function () {
                                return leftZeroFill(this.milliseconds(), 3);
                            },
                            SSSS: function () {
                                return leftZeroFill(this.milliseconds(), 3);
                            },
                            Z: function () {
                                var a = this.utcOffset(), b = '+';
                                if (a < 0) {
                                    a = -a;
                                    b = '-';
                                }
                                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
                            },
                            ZZ: function () {
                                var a = this.utcOffset(), b = '+';
                                if (a < 0) {
                                    a = -a;
                                    b = '-';
                                }
                                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
                            },
                            z: function () {
                                return this.zoneAbbr();
                            },
                            zz: function () {
                                return this.zoneName();
                            },
                            x: function () {
                                return this.valueOf();
                            },
                            X: function () {
                                return this.unix();
                            },
                            Q: function () {
                                return this.quarter();
                            }
                        }, deprecations = {}, lists = [
                            'months',
                            'monthsShort',
                            'weekdays',
                            'weekdaysShort',
                            'weekdaysMin'
                        ], updateInProgress = false;
                    function dfl(a, b, c) {
                        switch (arguments.length) {
                        case 2:
                            return a != null ? a : b;
                        case 3:
                            return a != null ? a : b != null ? b : c;
                        default:
                            throw new Error('Implement me');
                        }
                    }
                    function hasOwnProp(a, b) {
                        return hasOwnProperty.call(a, b);
                    }
                    function defaultParsingFlags() {
                        return {
                            empty: false,
                            unusedTokens: [],
                            unusedInput: [],
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false
                        };
                    }
                    function printMsg(msg) {
                        if (moment.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
                            console.warn('Deprecation warning: ' + msg);
                        }
                    }
                    function deprecate(msg, fn) {
                        var firstTime = true;
                        return extend(function () {
                            if (firstTime) {
                                printMsg(msg);
                                firstTime = false;
                            }
                            return fn.apply(this, arguments);
                        }, fn);
                    }
                    function deprecateSimple(name, msg) {
                        if (!deprecations[name]) {
                            printMsg(msg);
                            deprecations[name] = true;
                        }
                    }
                    function padToken(func, count) {
                        return function (a) {
                            return leftZeroFill(func.call(this, a), count);
                        };
                    }
                    function ordinalizeToken(func, period) {
                        return function (a) {
                            return this.localeData().ordinal(func.call(this, a), period);
                        };
                    }
                    function monthDiff(a, b) {
                        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, 'months'), anchor2, adjust;
                        if (b - anchor < 0) {
                            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
                            adjust = (b - anchor) / (anchor - anchor2);
                        } else {
                            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
                            adjust = (b - anchor) / (anchor2 - anchor);
                        }
                        return -(wholeMonthDiff + adjust);
                    }
                    while (ordinalizeTokens.length) {
                        i = ordinalizeTokens.pop();
                        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
                    }
                    while (paddedTokens.length) {
                        i = paddedTokens.pop();
                        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
                    }
                    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
                    function meridiemFixWrap(locale, hour, meridiem) {
                        var isPm;
                        if (meridiem == null) {
                            return hour;
                        }
                        if (locale.meridiemHour != null) {
                            return locale.meridiemHour(hour, meridiem);
                        } else if (locale.isPM != null) {
                            isPm = locale.isPM(meridiem);
                            if (isPm && hour < 12) {
                                hour += 12;
                            }
                            if (!isPm && hour === 12) {
                                hour = 0;
                            }
                            return hour;
                        } else {
                            return hour;
                        }
                    }
                    function Locale() {
                    }
                    function Moment(config, skipOverflow) {
                        if (skipOverflow !== false) {
                            checkOverflow(config);
                        }
                        copyConfig(this, config);
                        this._d = new Date(+config._d);
                        if (updateInProgress === false) {
                            updateInProgress = true;
                            moment.updateOffset(this);
                            updateInProgress = false;
                        }
                    }
                    function Duration(duration) {
                        var normalizedInput = normalizeObjectUnits(duration), years = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months = normalizedInput.month || 0, weeks = normalizedInput.week || 0, days = normalizedInput.day || 0, hours = normalizedInput.hour || 0, minutes = normalizedInput.minute || 0, seconds = normalizedInput.second || 0, milliseconds = normalizedInput.millisecond || 0;
                        this._milliseconds = +milliseconds + seconds * 1000 + minutes * 60000 + hours * 3600000;
                        this._days = +days + weeks * 7;
                        this._months = +months + quarters * 3 + years * 12;
                        this._data = {};
                        this._locale = moment.localeData();
                        this._bubble();
                    }
                    function extend(a, b) {
                        for (var i in b) {
                            if (hasOwnProp(b, i)) {
                                a[i] = b[i];
                            }
                        }
                        if (hasOwnProp(b, 'toString')) {
                            a.toString = b.toString;
                        }
                        if (hasOwnProp(b, 'valueOf')) {
                            a.valueOf = b.valueOf;
                        }
                        return a;
                    }
                    function copyConfig(to, from) {
                        var i, prop, val;
                        if (typeof from._isAMomentObject !== 'undefined') {
                            to._isAMomentObject = from._isAMomentObject;
                        }
                        if (typeof from._i !== 'undefined') {
                            to._i = from._i;
                        }
                        if (typeof from._f !== 'undefined') {
                            to._f = from._f;
                        }
                        if (typeof from._l !== 'undefined') {
                            to._l = from._l;
                        }
                        if (typeof from._strict !== 'undefined') {
                            to._strict = from._strict;
                        }
                        if (typeof from._tzm !== 'undefined') {
                            to._tzm = from._tzm;
                        }
                        if (typeof from._isUTC !== 'undefined') {
                            to._isUTC = from._isUTC;
                        }
                        if (typeof from._offset !== 'undefined') {
                            to._offset = from._offset;
                        }
                        if (typeof from._pf !== 'undefined') {
                            to._pf = from._pf;
                        }
                        if (typeof from._locale !== 'undefined') {
                            to._locale = from._locale;
                        }
                        if (momentProperties.length > 0) {
                            for (i in momentProperties) {
                                prop = momentProperties[i];
                                val = from[prop];
                                if (typeof val !== 'undefined') {
                                    to[prop] = val;
                                }
                            }
                        }
                        return to;
                    }
                    function absRound(number) {
                        if (number < 0) {
                            return Math.ceil(number);
                        } else {
                            return Math.floor(number);
                        }
                    }
                    function leftZeroFill(number, targetLength, forceSign) {
                        var output = '' + Math.abs(number), sign = number >= 0;
                        while (output.length < targetLength) {
                            output = '0' + output;
                        }
                        return (sign ? forceSign ? '+' : '' : '-') + output;
                    }
                    function positiveMomentsDifference(base, other) {
                        var res = {
                            milliseconds: 0,
                            months: 0
                        };
                        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
                        if (base.clone().add(res.months, 'M').isAfter(other)) {
                            --res.months;
                        }
                        res.milliseconds = +other - +base.clone().add(res.months, 'M');
                        return res;
                    }
                    function momentsDifference(base, other) {
                        var res;
                        other = makeAs(other, base);
                        if (base.isBefore(other)) {
                            res = positiveMomentsDifference(base, other);
                        } else {
                            res = positiveMomentsDifference(other, base);
                            res.milliseconds = -res.milliseconds;
                            res.months = -res.months;
                        }
                        return res;
                    }
                    function createAdder(direction, name) {
                        return function (val, period) {
                            var dur, tmp;
                            if (period !== null && !isNaN(+period)) {
                                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                                tmp = val;
                                val = period;
                                period = tmp;
                            }
                            val = typeof val === 'string' ? +val : val;
                            dur = moment.duration(val, period);
                            addOrSubtractDurationFromMoment(this, dur, direction);
                            return this;
                        };
                    }
                    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
                        var milliseconds = duration._milliseconds, days = duration._days, months = duration._months;
                        updateOffset = updateOffset == null ? true : updateOffset;
                        if (milliseconds) {
                            mom._d.setTime(+mom._d + milliseconds * isAdding);
                        }
                        if (days) {
                            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
                        }
                        if (months) {
                            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
                        }
                        if (updateOffset) {
                            moment.updateOffset(mom, days || months);
                        }
                    }
                    function isArray(input) {
                        return Object.prototype.toString.call(input) === '[object Array]';
                    }
                    function isDate(input) {
                        return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
                    }
                    function compareArrays(array1, array2, dontConvert) {
                        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
                        for (i = 0; i < len; i++) {
                            if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
                                diffs++;
                            }
                        }
                        return diffs + lengthDiff;
                    }
                    function normalizeUnits(units) {
                        if (units) {
                            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
                            units = unitAliases[units] || camelFunctions[lowered] || lowered;
                        }
                        return units;
                    }
                    function normalizeObjectUnits(inputObject) {
                        var normalizedInput = {}, normalizedProp, prop;
                        for (prop in inputObject) {
                            if (hasOwnProp(inputObject, prop)) {
                                normalizedProp = normalizeUnits(prop);
                                if (normalizedProp) {
                                    normalizedInput[normalizedProp] = inputObject[prop];
                                }
                            }
                        }
                        return normalizedInput;
                    }
                    function makeList(field) {
                        var count, setter;
                        if (field.indexOf('week') === 0) {
                            count = 7;
                            setter = 'day';
                        } else if (field.indexOf('month') === 0) {
                            count = 12;
                            setter = 'month';
                        } else {
                            return;
                        }
                        moment[field] = function (format, index) {
                            var i, getter, method = moment._locale[field], results = [];
                            if (typeof format === 'number') {
                                index = format;
                                format = undefined;
                            }
                            getter = function (i) {
                                var m = moment().utc().set(setter, i);
                                return method.call(moment._locale, m, format || '');
                            };
                            if (index != null) {
                                return getter(index);
                            } else {
                                for (i = 0; i < count; i++) {
                                    results.push(getter(i));
                                }
                                return results;
                            }
                        };
                    }
                    function toInt(argumentForCoercion) {
                        var coercedNumber = +argumentForCoercion, value = 0;
                        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
                            if (coercedNumber >= 0) {
                                value = Math.floor(coercedNumber);
                            } else {
                                value = Math.ceil(coercedNumber);
                            }
                        }
                        return value;
                    }
                    function daysInMonth(year, month) {
                        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
                    }
                    function weeksInYear(year, dow, doy) {
                        return weekOfYear(moment([
                            year,
                            11,
                            31 + dow - doy
                        ]), dow, doy).week;
                    }
                    function daysInYear(year) {
                        return isLeapYear(year) ? 366 : 365;
                    }
                    function isLeapYear(year) {
                        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
                    }
                    function checkOverflow(m) {
                        var overflow;
                        if (m._a && m._pf.overflow === -2) {
                            overflow = m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH : m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE : m._a[HOUR] < 0 || m._a[HOUR] > 24 || m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 || m._a[SECOND] !== 0 || m._a[MILLISECOND] !== 0) ? HOUR : m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE : m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND : m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND : -1;
                            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                                overflow = DATE;
                            }
                            m._pf.overflow = overflow;
                        }
                    }
                    function isValid(m) {
                        if (m._isValid == null) {
                            m._isValid = !isNaN(m._d.getTime()) && m._pf.overflow < 0 && !m._pf.empty && !m._pf.invalidMonth && !m._pf.nullInput && !m._pf.invalidFormat && !m._pf.userInvalidated;
                            if (m._strict) {
                                m._isValid = m._isValid && m._pf.charsLeftOver === 0 && m._pf.unusedTokens.length === 0 && m._pf.bigHour === undefined;
                            }
                        }
                        return m._isValid;
                    }
                    function normalizeLocale(key) {
                        return key ? key.toLowerCase().replace('_', '-') : key;
                    }
                    function chooseLocale(names) {
                        var i = 0, j, next, locale, split;
                        while (i < names.length) {
                            split = normalizeLocale(names[i]).split('-');
                            j = split.length;
                            next = normalizeLocale(names[i + 1]);
                            next = next ? next.split('-') : null;
                            while (j > 0) {
                                locale = loadLocale(split.slice(0, j).join('-'));
                                if (locale) {
                                    return locale;
                                }
                                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                                    break;
                                }
                                j--;
                            }
                            i++;
                        }
                        return null;
                    }
                    function loadLocale(name) {
                        var oldLocale = null;
                        if (!locales[name] && hasModule) {
                            try {
                                oldLocale = moment.locale();
                                require('./locale/' + name);
                                moment.locale(oldLocale);
                            } catch (e) {
                            }
                        }
                        return locales[name];
                    }
                    function makeAs(input, model) {
                        var res, diff;
                        if (model._isUTC) {
                            res = model.clone();
                            diff = (moment.isMoment(input) || isDate(input) ? +input : +moment(input)) - +res;
                            res._d.setTime(+res._d + diff);
                            moment.updateOffset(res, false);
                            return res;
                        } else {
                            return moment(input).local();
                        }
                    }
                    extend(Locale.prototype, {
                        set: function (config) {
                            var prop, i;
                            for (i in config) {
                                prop = config[i];
                                if (typeof prop === 'function') {
                                    this[i] = prop;
                                } else {
                                    this['_' + i] = prop;
                                }
                            }
                            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
                        },
                        _months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
                        months: function (m) {
                            return this._months[m.month()];
                        },
                        _monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
                        monthsShort: function (m) {
                            return this._monthsShort[m.month()];
                        },
                        monthsParse: function (monthName, format, strict) {
                            var i, mom, regex;
                            if (!this._monthsParse) {
                                this._monthsParse = [];
                                this._longMonthsParse = [];
                                this._shortMonthsParse = [];
                            }
                            for (i = 0; i < 12; i++) {
                                mom = moment.utc([
                                    2000,
                                    i
                                ]);
                                if (strict && !this._longMonthsParse[i]) {
                                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                                }
                                if (!strict && !this._monthsParse[i]) {
                                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                                }
                                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                                    return i;
                                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                                    return i;
                                } else if (!strict && this._monthsParse[i].test(monthName)) {
                                    return i;
                                }
                            }
                        },
                        _weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
                        weekdays: function (m) {
                            return this._weekdays[m.day()];
                        },
                        _weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
                        weekdaysShort: function (m) {
                            return this._weekdaysShort[m.day()];
                        },
                        _weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
                        weekdaysMin: function (m) {
                            return this._weekdaysMin[m.day()];
                        },
                        weekdaysParse: function (weekdayName) {
                            var i, mom, regex;
                            if (!this._weekdaysParse) {
                                this._weekdaysParse = [];
                            }
                            for (i = 0; i < 7; i++) {
                                if (!this._weekdaysParse[i]) {
                                    mom = moment([
                                        2000,
                                        1
                                    ]).day(i);
                                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                                }
                                if (this._weekdaysParse[i].test(weekdayName)) {
                                    return i;
                                }
                            }
                        },
                        _longDateFormat: {
                            LTS: 'h:mm:ss A',
                            LT: 'h:mm A',
                            L: 'MM/DD/YYYY',
                            LL: 'MMMM D, YYYY',
                            LLL: 'MMMM D, YYYY LT',
                            LLLL: 'dddd, MMMM D, YYYY LT'
                        },
                        longDateFormat: function (key) {
                            var output = this._longDateFormat[key];
                            if (!output && this._longDateFormat[key.toUpperCase()]) {
                                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                                    return val.slice(1);
                                });
                                this._longDateFormat[key] = output;
                            }
                            return output;
                        },
                        isPM: function (input) {
                            return (input + '').toLowerCase().charAt(0) === 'p';
                        },
                        _meridiemParse: /[ap]\.?m?\.?/i,
                        meridiem: function (hours, minutes, isLower) {
                            if (hours > 11) {
                                return isLower ? 'pm' : 'PM';
                            } else {
                                return isLower ? 'am' : 'AM';
                            }
                        },
                        _calendar: {
                            sameDay: '[Today at] LT',
                            nextDay: '[Tomorrow at] LT',
                            nextWeek: 'dddd [at] LT',
                            lastDay: '[Yesterday at] LT',
                            lastWeek: '[Last] dddd [at] LT',
                            sameElse: 'L'
                        },
                        calendar: function (key, mom, now) {
                            var output = this._calendar[key];
                            return typeof output === 'function' ? output.apply(mom, [now]) : output;
                        },
                        _relativeTime: {
                            future: 'in %s',
                            past: '%s ago',
                            s: 'a few seconds',
                            m: 'a minute',
                            mm: '%d minutes',
                            h: 'an hour',
                            hh: '%d hours',
                            d: 'a day',
                            dd: '%d days',
                            M: 'a month',
                            MM: '%d months',
                            y: 'a year',
                            yy: '%d years'
                        },
                        relativeTime: function (number, withoutSuffix, string, isFuture) {
                            var output = this._relativeTime[string];
                            return typeof output === 'function' ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
                        },
                        pastFuture: function (diff, output) {
                            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
                            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
                        },
                        ordinal: function (number) {
                            return this._ordinal.replace('%d', number);
                        },
                        _ordinal: '%d',
                        _ordinalParse: /\d{1,2}/,
                        preparse: function (string) {
                            return string;
                        },
                        postformat: function (string) {
                            return string;
                        },
                        week: function (mom) {
                            return weekOfYear(mom, this._week.dow, this._week.doy).week;
                        },
                        _week: {
                            dow: 0,
                            doy: 6
                        },
                        firstDayOfWeek: function () {
                            return this._week.dow;
                        },
                        firstDayOfYear: function () {
                            return this._week.doy;
                        },
                        _invalidDate: 'Invalid date',
                        invalidDate: function () {
                            return this._invalidDate;
                        }
                    });
                    function removeFormattingTokens(input) {
                        if (input.match(/\[[\s\S]/)) {
                            return input.replace(/^\[|\]$/g, '');
                        }
                        return input.replace(/\\/g, '');
                    }
                    function makeFormatFunction(format) {
                        var array = format.match(formattingTokens), i, length;
                        for (i = 0, length = array.length; i < length; i++) {
                            if (formatTokenFunctions[array[i]]) {
                                array[i] = formatTokenFunctions[array[i]];
                            } else {
                                array[i] = removeFormattingTokens(array[i]);
                            }
                        }
                        return function (mom) {
                            var output = '';
                            for (i = 0; i < length; i++) {
                                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
                            }
                            return output;
                        };
                    }
                    function formatMoment(m, format) {
                        if (!m.isValid()) {
                            return m.localeData().invalidDate();
                        }
                        format = expandFormat(format, m.localeData());
                        if (!formatFunctions[format]) {
                            formatFunctions[format] = makeFormatFunction(format);
                        }
                        return formatFunctions[format](m);
                    }
                    function expandFormat(format, locale) {
                        var i = 5;
                        function replaceLongDateFormatTokens(input) {
                            return locale.longDateFormat(input) || input;
                        }
                        localFormattingTokens.lastIndex = 0;
                        while (i >= 0 && localFormattingTokens.test(format)) {
                            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
                            localFormattingTokens.lastIndex = 0;
                            i -= 1;
                        }
                        return format;
                    }
                    function getParseRegexForToken(token, config) {
                        var a, strict = config._strict;
                        switch (token) {
                        case 'Q':
                            return parseTokenOneDigit;
                        case 'DDDD':
                            return parseTokenThreeDigits;
                        case 'YYYY':
                        case 'GGGG':
                        case 'gggg':
                            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
                        case 'Y':
                        case 'G':
                        case 'g':
                            return parseTokenSignedNumber;
                        case 'YYYYYY':
                        case 'YYYYY':
                        case 'GGGGG':
                        case 'ggggg':
                            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
                        case 'S':
                            if (strict) {
                                return parseTokenOneDigit;
                            }
                        case 'SS':
                            if (strict) {
                                return parseTokenTwoDigits;
                            }
                        case 'SSS':
                            if (strict) {
                                return parseTokenThreeDigits;
                            }
                        case 'DDD':
                            return parseTokenOneToThreeDigits;
                        case 'MMM':
                        case 'MMMM':
                        case 'dd':
                        case 'ddd':
                        case 'dddd':
                            return parseTokenWord;
                        case 'a':
                        case 'A':
                            return config._locale._meridiemParse;
                        case 'x':
                            return parseTokenOffsetMs;
                        case 'X':
                            return parseTokenTimestampMs;
                        case 'Z':
                        case 'ZZ':
                            return parseTokenTimezone;
                        case 'T':
                            return parseTokenT;
                        case 'SSSS':
                            return parseTokenDigits;
                        case 'MM':
                        case 'DD':
                        case 'YY':
                        case 'GG':
                        case 'gg':
                        case 'HH':
                        case 'hh':
                        case 'mm':
                        case 'ss':
                        case 'ww':
                        case 'WW':
                            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
                        case 'M':
                        case 'D':
                        case 'd':
                        case 'H':
                        case 'h':
                        case 'm':
                        case 's':
                        case 'w':
                        case 'W':
                        case 'e':
                        case 'E':
                            return parseTokenOneOrTwoDigits;
                        case 'Do':
                            return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
                        default:
                            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
                            return a;
                        }
                    }
                    function utcOffsetFromString(string) {
                        string = string || '';
                        var possibleTzMatches = string.match(parseTokenTimezone) || [], tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [], parts = (tzChunk + '').match(parseTimezoneChunker) || [
                                '-',
                                0,
                                0
                            ], minutes = +(parts[1] * 60) + toInt(parts[2]);
                        return parts[0] === '+' ? minutes : -minutes;
                    }
                    function addTimeToArrayFromToken(token, input, config) {
                        var a, datePartArray = config._a;
                        switch (token) {
                        case 'Q':
                            if (input != null) {
                                datePartArray[MONTH] = (toInt(input) - 1) * 3;
                            }
                            break;
                        case 'M':
                        case 'MM':
                            if (input != null) {
                                datePartArray[MONTH] = toInt(input) - 1;
                            }
                            break;
                        case 'MMM':
                        case 'MMMM':
                            a = config._locale.monthsParse(input, token, config._strict);
                            if (a != null) {
                                datePartArray[MONTH] = a;
                            } else {
                                config._pf.invalidMonth = input;
                            }
                            break;
                        case 'D':
                        case 'DD':
                            if (input != null) {
                                datePartArray[DATE] = toInt(input);
                            }
                            break;
                        case 'Do':
                            if (input != null) {
                                datePartArray[DATE] = toInt(parseInt(input.match(/\d{1,2}/)[0], 10));
                            }
                            break;
                        case 'DDD':
                        case 'DDDD':
                            if (input != null) {
                                config._dayOfYear = toInt(input);
                            }
                            break;
                        case 'YY':
                            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
                            break;
                        case 'YYYY':
                        case 'YYYYY':
                        case 'YYYYYY':
                            datePartArray[YEAR] = toInt(input);
                            break;
                        case 'a':
                        case 'A':
                            config._meridiem = input;
                            break;
                        case 'h':
                        case 'hh':
                            config._pf.bigHour = true;
                        case 'H':
                        case 'HH':
                            datePartArray[HOUR] = toInt(input);
                            break;
                        case 'm':
                        case 'mm':
                            datePartArray[MINUTE] = toInt(input);
                            break;
                        case 's':
                        case 'ss':
                            datePartArray[SECOND] = toInt(input);
                            break;
                        case 'S':
                        case 'SS':
                        case 'SSS':
                        case 'SSSS':
                            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
                            break;
                        case 'x':
                            config._d = new Date(toInt(input));
                            break;
                        case 'X':
                            config._d = new Date(parseFloat(input) * 1000);
                            break;
                        case 'Z':
                        case 'ZZ':
                            config._useUTC = true;
                            config._tzm = utcOffsetFromString(input);
                            break;
                        case 'dd':
                        case 'ddd':
                        case 'dddd':
                            a = config._locale.weekdaysParse(input);
                            if (a != null) {
                                config._w = config._w || {};
                                config._w['d'] = a;
                            } else {
                                config._pf.invalidWeekday = input;
                            }
                            break;
                        case 'w':
                        case 'ww':
                        case 'W':
                        case 'WW':
                        case 'd':
                        case 'e':
                        case 'E':
                            token = token.substr(0, 1);
                        case 'gggg':
                        case 'GGGG':
                        case 'GGGGG':
                            token = token.substr(0, 2);
                            if (input) {
                                config._w = config._w || {};
                                config._w[token] = toInt(input);
                            }
                            break;
                        case 'gg':
                        case 'GG':
                            config._w = config._w || {};
                            config._w[token] = moment.parseTwoDigitYear(input);
                        }
                    }
                    function dayOfYearFromWeekInfo(config) {
                        var w, weekYear, week, weekday, dow, doy, temp;
                        w = config._w;
                        if (w.GG != null || w.W != null || w.E != null) {
                            dow = 1;
                            doy = 4;
                            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
                            week = dfl(w.W, 1);
                            weekday = dfl(w.E, 1);
                        } else {
                            dow = config._locale._week.dow;
                            doy = config._locale._week.doy;
                            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
                            week = dfl(w.w, 1);
                            if (w.d != null) {
                                weekday = w.d;
                                if (weekday < dow) {
                                    ++week;
                                }
                            } else if (w.e != null) {
                                weekday = w.e + dow;
                            } else {
                                weekday = dow;
                            }
                        }
                        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);
                        config._a[YEAR] = temp.year;
                        config._dayOfYear = temp.dayOfYear;
                    }
                    function dateFromConfig(config) {
                        var i, date, input = [], currentDate, yearToUse;
                        if (config._d) {
                            return;
                        }
                        currentDate = currentDateArray(config);
                        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
                            dayOfYearFromWeekInfo(config);
                        }
                        if (config._dayOfYear) {
                            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);
                            if (config._dayOfYear > daysInYear(yearToUse)) {
                                config._pf._overflowDayOfYear = true;
                            }
                            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
                            config._a[MONTH] = date.getUTCMonth();
                            config._a[DATE] = date.getUTCDate();
                        }
                        for (i = 0; i < 3 && config._a[i] == null; ++i) {
                            config._a[i] = input[i] = currentDate[i];
                        }
                        for (; i < 7; i++) {
                            config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
                        }
                        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
                            config._nextDay = true;
                            config._a[HOUR] = 0;
                        }
                        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
                        if (config._tzm != null) {
                            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
                        }
                        if (config._nextDay) {
                            config._a[HOUR] = 24;
                        }
                    }
                    function dateFromObject(config) {
                        var normalizedInput;
                        if (config._d) {
                            return;
                        }
                        normalizedInput = normalizeObjectUnits(config._i);
                        config._a = [
                            normalizedInput.year,
                            normalizedInput.month,
                            normalizedInput.day || normalizedInput.date,
                            normalizedInput.hour,
                            normalizedInput.minute,
                            normalizedInput.second,
                            normalizedInput.millisecond
                        ];
                        dateFromConfig(config);
                    }
                    function currentDateArray(config) {
                        var now = new Date();
                        if (config._useUTC) {
                            return [
                                now.getUTCFullYear(),
                                now.getUTCMonth(),
                                now.getUTCDate()
                            ];
                        } else {
                            return [
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate()
                            ];
                        }
                    }
                    function makeDateFromStringAndFormat(config) {
                        if (config._f === moment.ISO_8601) {
                            parseISO(config);
                            return;
                        }
                        config._a = [];
                        config._pf.empty = true;
                        var string = '' + config._i, i, parsedInput, tokens, token, skipped, stringLength = string.length, totalParsedInputLength = 0;
                        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
                        for (i = 0; i < tokens.length; i++) {
                            token = tokens[i];
                            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
                            if (parsedInput) {
                                skipped = string.substr(0, string.indexOf(parsedInput));
                                if (skipped.length > 0) {
                                    config._pf.unusedInput.push(skipped);
                                }
                                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                                totalParsedInputLength += parsedInput.length;
                            }
                            if (formatTokenFunctions[token]) {
                                if (parsedInput) {
                                    config._pf.empty = false;
                                } else {
                                    config._pf.unusedTokens.push(token);
                                }
                                addTimeToArrayFromToken(token, parsedInput, config);
                            } else if (config._strict && !parsedInput) {
                                config._pf.unusedTokens.push(token);
                            }
                        }
                        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
                        if (string.length > 0) {
                            config._pf.unusedInput.push(string);
                        }
                        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
                            config._pf.bigHour = undefined;
                        }
                        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
                        dateFromConfig(config);
                        checkOverflow(config);
                    }
                    function unescapeFormat(s) {
                        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
                            return p1 || p2 || p3 || p4;
                        });
                    }
                    function regexpEscape(s) {
                        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    }
                    function makeDateFromStringAndArray(config) {
                        var tempConfig, bestMoment, scoreToBeat, i, currentScore;
                        if (config._f.length === 0) {
                            config._pf.invalidFormat = true;
                            config._d = new Date(NaN);
                            return;
                        }
                        for (i = 0; i < config._f.length; i++) {
                            currentScore = 0;
                            tempConfig = copyConfig({}, config);
                            if (config._useUTC != null) {
                                tempConfig._useUTC = config._useUTC;
                            }
                            tempConfig._pf = defaultParsingFlags();
                            tempConfig._f = config._f[i];
                            makeDateFromStringAndFormat(tempConfig);
                            if (!isValid(tempConfig)) {
                                continue;
                            }
                            currentScore += tempConfig._pf.charsLeftOver;
                            currentScore += tempConfig._pf.unusedTokens.length * 10;
                            tempConfig._pf.score = currentScore;
                            if (scoreToBeat == null || currentScore < scoreToBeat) {
                                scoreToBeat = currentScore;
                                bestMoment = tempConfig;
                            }
                        }
                        extend(config, bestMoment || tempConfig);
                    }
                    function parseISO(config) {
                        var i, l, string = config._i, match = isoRegex.exec(string);
                        if (match) {
                            config._pf.iso = true;
                            for (i = 0, l = isoDates.length; i < l; i++) {
                                if (isoDates[i][1].exec(string)) {
                                    config._f = isoDates[i][0] + (match[6] || ' ');
                                    break;
                                }
                            }
                            for (i = 0, l = isoTimes.length; i < l; i++) {
                                if (isoTimes[i][1].exec(string)) {
                                    config._f += isoTimes[i][0];
                                    break;
                                }
                            }
                            if (string.match(parseTokenTimezone)) {
                                config._f += 'Z';
                            }
                            makeDateFromStringAndFormat(config);
                        } else {
                            config._isValid = false;
                        }
                    }
                    function makeDateFromString(config) {
                        parseISO(config);
                        if (config._isValid === false) {
                            delete config._isValid;
                            moment.createFromInputFallback(config);
                        }
                    }
                    function map(arr, fn) {
                        var res = [], i;
                        for (i = 0; i < arr.length; ++i) {
                            res.push(fn(arr[i], i));
                        }
                        return res;
                    }
                    function makeDateFromInput(config) {
                        var input = config._i, matched;
                        if (input === undefined) {
                            config._d = new Date();
                        } else if (isDate(input)) {
                            config._d = new Date(+input);
                        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
                            config._d = new Date(+matched[1]);
                        } else if (typeof input === 'string') {
                            makeDateFromString(config);
                        } else if (isArray(input)) {
                            config._a = map(input.slice(0), function (obj) {
                                return parseInt(obj, 10);
                            });
                            dateFromConfig(config);
                        } else if (typeof input === 'object') {
                            dateFromObject(config);
                        } else if (typeof input === 'number') {
                            config._d = new Date(input);
                        } else {
                            moment.createFromInputFallback(config);
                        }
                    }
                    function makeDate(y, m, d, h, M, s, ms) {
                        var date = new Date(y, m, d, h, M, s, ms);
                        if (y < 1970) {
                            date.setFullYear(y);
                        }
                        return date;
                    }
                    function makeUTCDate(y) {
                        var date = new Date(Date.UTC.apply(null, arguments));
                        if (y < 1970) {
                            date.setUTCFullYear(y);
                        }
                        return date;
                    }
                    function parseWeekday(input, locale) {
                        if (typeof input === 'string') {
                            if (!isNaN(input)) {
                                input = parseInt(input, 10);
                            } else {
                                input = locale.weekdaysParse(input);
                                if (typeof input !== 'number') {
                                    return null;
                                }
                            }
                        }
                        return input;
                    }
                    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
                        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
                    }
                    function relativeTime(posNegDuration, withoutSuffix, locale) {
                        var duration = moment.duration(posNegDuration).abs(), seconds = round(duration.as('s')), minutes = round(duration.as('m')), hours = round(duration.as('h')), days = round(duration.as('d')), months = round(duration.as('M')), years = round(duration.as('y')), args = seconds < relativeTimeThresholds.s && [
                                's',
                                seconds
                            ] || minutes === 1 && ['m'] || minutes < relativeTimeThresholds.m && [
                                'mm',
                                minutes
                            ] || hours === 1 && ['h'] || hours < relativeTimeThresholds.h && [
                                'hh',
                                hours
                            ] || days === 1 && ['d'] || days < relativeTimeThresholds.d && [
                                'dd',
                                days
                            ] || months === 1 && ['M'] || months < relativeTimeThresholds.M && [
                                'MM',
                                months
                            ] || years === 1 && ['y'] || [
                                'yy',
                                years
                            ];
                        args[2] = withoutSuffix;
                        args[3] = +posNegDuration > 0;
                        args[4] = locale;
                        return substituteTimeAgo.apply({}, args);
                    }
                    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
                        var end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(), adjustedMoment;
                        if (daysToDayOfWeek > end) {
                            daysToDayOfWeek -= 7;
                        }
                        if (daysToDayOfWeek < end - 7) {
                            daysToDayOfWeek += 7;
                        }
                        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
                        return {
                            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
                            year: adjustedMoment.year()
                        };
                    }
                    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
                        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;
                        d = d === 0 ? 7 : d;
                        weekday = weekday != null ? weekday : firstDayOfWeek;
                        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
                        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;
                        return {
                            year: dayOfYear > 0 ? year : year - 1,
                            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
                        };
                    }
                    function makeMoment(config) {
                        var input = config._i, format = config._f, res;
                        config._locale = config._locale || moment.localeData(config._l);
                        if (input === null || format === undefined && input === '') {
                            return moment.invalid({ nullInput: true });
                        }
                        if (typeof input === 'string') {
                            config._i = input = config._locale.preparse(input);
                        }
                        if (moment.isMoment(input)) {
                            return new Moment(input, true);
                        } else if (format) {
                            if (isArray(format)) {
                                makeDateFromStringAndArray(config);
                            } else {
                                makeDateFromStringAndFormat(config);
                            }
                        } else {
                            makeDateFromInput(config);
                        }
                        res = new Moment(config);
                        if (res._nextDay) {
                            res.add(1, 'd');
                            res._nextDay = undefined;
                        }
                        return res;
                    }
                    moment = function (input, format, locale, strict) {
                        var c;
                        if (typeof locale === 'boolean') {
                            strict = locale;
                            locale = undefined;
                        }
                        c = {};
                        c._isAMomentObject = true;
                        c._i = input;
                        c._f = format;
                        c._l = locale;
                        c._strict = strict;
                        c._isUTC = false;
                        c._pf = defaultParsingFlags();
                        return makeMoment(c);
                    };
                    moment.suppressDeprecationWarnings = false;
                    moment.createFromInputFallback = deprecate('moment construction falls back to js Date. This is ' + 'discouraged and will be removed in upcoming major ' + 'release. Please refer to ' + 'https://github.com/moment/moment/issues/1407 for more info.', function (config) {
                        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
                    });
                    function pickBy(fn, moments) {
                        var res, i;
                        if (moments.length === 1 && isArray(moments[0])) {
                            moments = moments[0];
                        }
                        if (!moments.length) {
                            return moment();
                        }
                        res = moments[0];
                        for (i = 1; i < moments.length; ++i) {
                            if (moments[i][fn](res)) {
                                res = moments[i];
                            }
                        }
                        return res;
                    }
                    moment.min = function () {
                        var args = [].slice.call(arguments, 0);
                        return pickBy('isBefore', args);
                    };
                    moment.max = function () {
                        var args = [].slice.call(arguments, 0);
                        return pickBy('isAfter', args);
                    };
                    moment.utc = function (input, format, locale, strict) {
                        var c;
                        if (typeof locale === 'boolean') {
                            strict = locale;
                            locale = undefined;
                        }
                        c = {};
                        c._isAMomentObject = true;
                        c._useUTC = true;
                        c._isUTC = true;
                        c._l = locale;
                        c._i = input;
                        c._f = format;
                        c._strict = strict;
                        c._pf = defaultParsingFlags();
                        return makeMoment(c).utc();
                    };
                    moment.unix = function (input) {
                        return moment(input * 1000);
                    };
                    moment.duration = function (input, key) {
                        var duration = input, match = null, sign, ret, parseIso, diffRes;
                        if (moment.isDuration(input)) {
                            duration = {
                                ms: input._milliseconds,
                                d: input._days,
                                M: input._months
                            };
                        } else if (typeof input === 'number') {
                            duration = {};
                            if (key) {
                                duration[key] = input;
                            } else {
                                duration.milliseconds = input;
                            }
                        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
                            sign = match[1] === '-' ? -1 : 1;
                            duration = {
                                y: 0,
                                d: toInt(match[DATE]) * sign,
                                h: toInt(match[HOUR]) * sign,
                                m: toInt(match[MINUTE]) * sign,
                                s: toInt(match[SECOND]) * sign,
                                ms: toInt(match[MILLISECOND]) * sign
                            };
                        } else if (!!(match = isoDurationRegex.exec(input))) {
                            sign = match[1] === '-' ? -1 : 1;
                            parseIso = function (inp) {
                                var res = inp && parseFloat(inp.replace(',', '.'));
                                return (isNaN(res) ? 0 : res) * sign;
                            };
                            duration = {
                                y: parseIso(match[2]),
                                M: parseIso(match[3]),
                                d: parseIso(match[4]),
                                h: parseIso(match[5]),
                                m: parseIso(match[6]),
                                s: parseIso(match[7]),
                                w: parseIso(match[8])
                            };
                        } else if (duration == null) {
                            duration = {};
                        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
                            diffRes = momentsDifference(moment(duration.from), moment(duration.to));
                            duration = {};
                            duration.ms = diffRes.milliseconds;
                            duration.M = diffRes.months;
                        }
                        ret = new Duration(duration);
                        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
                            ret._locale = input._locale;
                        }
                        return ret;
                    };
                    moment.version = VERSION;
                    moment.defaultFormat = isoFormat;
                    moment.ISO_8601 = function () {
                    };
                    moment.momentProperties = momentProperties;
                    moment.updateOffset = function () {
                    };
                    moment.relativeTimeThreshold = function (threshold, limit) {
                        if (relativeTimeThresholds[threshold] === undefined) {
                            return false;
                        }
                        if (limit === undefined) {
                            return relativeTimeThresholds[threshold];
                        }
                        relativeTimeThresholds[threshold] = limit;
                        return true;
                    };
                    moment.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', function (key, value) {
                        return moment.locale(key, value);
                    });
                    moment.locale = function (key, values) {
                        var data;
                        if (key) {
                            if (typeof values !== 'undefined') {
                                data = moment.defineLocale(key, values);
                            } else {
                                data = moment.localeData(key);
                            }
                            if (data) {
                                moment.duration._locale = moment._locale = data;
                            }
                        }
                        return moment._locale._abbr;
                    };
                    moment.defineLocale = function (name, values) {
                        if (values !== null) {
                            values.abbr = name;
                            if (!locales[name]) {
                                locales[name] = new Locale();
                            }
                            locales[name].set(values);
                            moment.locale(name);
                            return locales[name];
                        } else {
                            delete locales[name];
                            return null;
                        }
                    };
                    moment.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', function (key) {
                        return moment.localeData(key);
                    });
                    moment.localeData = function (key) {
                        var locale;
                        if (key && key._locale && key._locale._abbr) {
                            key = key._locale._abbr;
                        }
                        if (!key) {
                            return moment._locale;
                        }
                        if (!isArray(key)) {
                            locale = loadLocale(key);
                            if (locale) {
                                return locale;
                            }
                            key = [key];
                        }
                        return chooseLocale(key);
                    };
                    moment.isMoment = function (obj) {
                        return obj instanceof Moment || obj != null && hasOwnProp(obj, '_isAMomentObject');
                    };
                    moment.isDuration = function (obj) {
                        return obj instanceof Duration;
                    };
                    for (i = lists.length - 1; i >= 0; --i) {
                        makeList(lists[i]);
                    }
                    moment.normalizeUnits = function (units) {
                        return normalizeUnits(units);
                    };
                    moment.invalid = function (flags) {
                        var m = moment.utc(NaN);
                        if (flags != null) {
                            extend(m._pf, flags);
                        } else {
                            m._pf.userInvalidated = true;
                        }
                        return m;
                    };
                    moment.parseZone = function () {
                        return moment.apply(null, arguments).parseZone();
                    };
                    moment.parseTwoDigitYear = function (input) {
                        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
                    };
                    moment.isDate = isDate;
                    extend(moment.fn = Moment.prototype, {
                        clone: function () {
                            return moment(this);
                        },
                        valueOf: function () {
                            return +this._d - (this._offset || 0) * 60000;
                        },
                        unix: function () {
                            return Math.floor(+this / 1000);
                        },
                        toString: function () {
                            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
                        },
                        toDate: function () {
                            return this._offset ? new Date(+this) : this._d;
                        },
                        toISOString: function () {
                            var m = moment(this).utc();
                            if (0 < m.year() && m.year() <= 9999) {
                                if ('function' === typeof Date.prototype.toISOString) {
                                    return this.toDate().toISOString();
                                } else {
                                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                                }
                            } else {
                                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                            }
                        },
                        toArray: function () {
                            var m = this;
                            return [
                                m.year(),
                                m.month(),
                                m.date(),
                                m.hours(),
                                m.minutes(),
                                m.seconds(),
                                m.milliseconds()
                            ];
                        },
                        isValid: function () {
                            return isValid(this);
                        },
                        isDSTShifted: function () {
                            if (this._a) {
                                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
                            }
                            return false;
                        },
                        parsingFlags: function () {
                            return extend({}, this._pf);
                        },
                        invalidAt: function () {
                            return this._pf.overflow;
                        },
                        utc: function (keepLocalTime) {
                            return this.utcOffset(0, keepLocalTime);
                        },
                        local: function (keepLocalTime) {
                            if (this._isUTC) {
                                this.utcOffset(0, keepLocalTime);
                                this._isUTC = false;
                                if (keepLocalTime) {
                                    this.subtract(this._dateUtcOffset(), 'm');
                                }
                            }
                            return this;
                        },
                        format: function (inputString) {
                            var output = formatMoment(this, inputString || moment.defaultFormat);
                            return this.localeData().postformat(output);
                        },
                        add: createAdder(1, 'add'),
                        subtract: createAdder(-1, 'subtract'),
                        diff: function (input, units, asFloat) {
                            var that = makeAs(input, this), zoneDiff = (that.utcOffset() - this.utcOffset()) * 60000, anchor, diff, output, daysAdjust;
                            units = normalizeUnits(units);
                            if (units === 'year' || units === 'month' || units === 'quarter') {
                                output = monthDiff(this, that);
                                if (units === 'quarter') {
                                    output = output / 3;
                                } else if (units === 'year') {
                                    output = output / 12;
                                }
                            } else {
                                diff = this - that;
                                output = units === 'second' ? diff / 1000 : units === 'minute' ? diff / 60000 : units === 'hour' ? diff / 3600000 : units === 'day' ? (diff - zoneDiff) / 86400000 : units === 'week' ? (diff - zoneDiff) / 604800000 : diff;
                            }
                            return asFloat ? output : absRound(output);
                        },
                        from: function (time, withoutSuffix) {
                            return moment.duration({
                                to: this,
                                from: time
                            }).locale(this.locale()).humanize(!withoutSuffix);
                        },
                        fromNow: function (withoutSuffix) {
                            return this.from(moment(), withoutSuffix);
                        },
                        calendar: function (time) {
                            var now = time || moment(), sod = makeAs(now, this).startOf('day'), diff = this.diff(sod, 'days', true), format = diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
                            return this.format(this.localeData().calendar(format, this, moment(now)));
                        },
                        isLeapYear: function () {
                            return isLeapYear(this.year());
                        },
                        isDST: function () {
                            return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
                        },
                        day: function (input) {
                            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                            if (input != null) {
                                input = parseWeekday(input, this.localeData());
                                return this.add(input - day, 'd');
                            } else {
                                return day;
                            }
                        },
                        month: makeAccessor('Month', true),
                        startOf: function (units) {
                            units = normalizeUnits(units);
                            switch (units) {
                            case 'year':
                                this.month(0);
                            case 'quarter':
                            case 'month':
                                this.date(1);
                            case 'week':
                            case 'isoWeek':
                            case 'day':
                                this.hours(0);
                            case 'hour':
                                this.minutes(0);
                            case 'minute':
                                this.seconds(0);
                            case 'second':
                                this.milliseconds(0);
                            }
                            if (units === 'week') {
                                this.weekday(0);
                            } else if (units === 'isoWeek') {
                                this.isoWeekday(1);
                            }
                            if (units === 'quarter') {
                                this.month(Math.floor(this.month() / 3) * 3);
                            }
                            return this;
                        },
                        endOf: function (units) {
                            units = normalizeUnits(units);
                            if (units === undefined || units === 'millisecond') {
                                return this;
                            }
                            return this.startOf(units).add(1, units === 'isoWeek' ? 'week' : units).subtract(1, 'ms');
                        },
                        isAfter: function (input, units) {
                            var inputMs;
                            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
                            if (units === 'millisecond') {
                                input = moment.isMoment(input) ? input : moment(input);
                                return +this > +input;
                            } else {
                                inputMs = moment.isMoment(input) ? +input : +moment(input);
                                return inputMs < +this.clone().startOf(units);
                            }
                        },
                        isBefore: function (input, units) {
                            var inputMs;
                            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
                            if (units === 'millisecond') {
                                input = moment.isMoment(input) ? input : moment(input);
                                return +this < +input;
                            } else {
                                inputMs = moment.isMoment(input) ? +input : +moment(input);
                                return +this.clone().endOf(units) < inputMs;
                            }
                        },
                        isBetween: function (from, to, units) {
                            return this.isAfter(from, units) && this.isBefore(to, units);
                        },
                        isSame: function (input, units) {
                            var inputMs;
                            units = normalizeUnits(units || 'millisecond');
                            if (units === 'millisecond') {
                                input = moment.isMoment(input) ? input : moment(input);
                                return +this === +input;
                            } else {
                                inputMs = +moment(input);
                                return +this.clone().startOf(units) <= inputMs && inputMs <= +this.clone().endOf(units);
                            }
                        },
                        min: deprecate('moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548', function (other) {
                            other = moment.apply(null, arguments);
                            return other < this ? this : other;
                        }),
                        max: deprecate('moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548', function (other) {
                            other = moment.apply(null, arguments);
                            return other > this ? this : other;
                        }),
                        zone: deprecate('moment().zone is deprecated, use moment().utcOffset instead. ' + 'https://github.com/moment/moment/issues/1779', function (input, keepLocalTime) {
                            if (input != null) {
                                if (typeof input !== 'string') {
                                    input = -input;
                                }
                                this.utcOffset(input, keepLocalTime);
                                return this;
                            } else {
                                return -this.utcOffset();
                            }
                        }),
                        utcOffset: function (input, keepLocalTime) {
                            var offset = this._offset || 0, localAdjust;
                            if (input != null) {
                                if (typeof input === 'string') {
                                    input = utcOffsetFromString(input);
                                }
                                if (Math.abs(input) < 16) {
                                    input = input * 60;
                                }
                                if (!this._isUTC && keepLocalTime) {
                                    localAdjust = this._dateUtcOffset();
                                }
                                this._offset = input;
                                this._isUTC = true;
                                if (localAdjust != null) {
                                    this.add(localAdjust, 'm');
                                }
                                if (offset !== input) {
                                    if (!keepLocalTime || this._changeInProgress) {
                                        addOrSubtractDurationFromMoment(this, moment.duration(input - offset, 'm'), 1, false);
                                    } else if (!this._changeInProgress) {
                                        this._changeInProgress = true;
                                        moment.updateOffset(this, true);
                                        this._changeInProgress = null;
                                    }
                                }
                                return this;
                            } else {
                                return this._isUTC ? offset : this._dateUtcOffset();
                            }
                        },
                        isLocal: function () {
                            return !this._isUTC;
                        },
                        isUtcOffset: function () {
                            return this._isUTC;
                        },
                        isUtc: function () {
                            return this._isUTC && this._offset === 0;
                        },
                        zoneAbbr: function () {
                            return this._isUTC ? 'UTC' : '';
                        },
                        zoneName: function () {
                            return this._isUTC ? 'Coordinated Universal Time' : '';
                        },
                        parseZone: function () {
                            if (this._tzm) {
                                this.utcOffset(this._tzm);
                            } else if (typeof this._i === 'string') {
                                this.utcOffset(utcOffsetFromString(this._i));
                            }
                            return this;
                        },
                        hasAlignedHourOffset: function (input) {
                            if (!input) {
                                input = 0;
                            } else {
                                input = moment(input).utcOffset();
                            }
                            return (this.utcOffset() - input) % 60 === 0;
                        },
                        daysInMonth: function () {
                            return daysInMonth(this.year(), this.month());
                        },
                        dayOfYear: function (input) {
                            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 86400000) + 1;
                            return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
                        },
                        quarter: function (input) {
                            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
                        },
                        weekYear: function (input) {
                            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
                            return input == null ? year : this.add(input - year, 'y');
                        },
                        isoWeekYear: function (input) {
                            var year = weekOfYear(this, 1, 4).year;
                            return input == null ? year : this.add(input - year, 'y');
                        },
                        week: function (input) {
                            var week = this.localeData().week(this);
                            return input == null ? week : this.add((input - week) * 7, 'd');
                        },
                        isoWeek: function (input) {
                            var week = weekOfYear(this, 1, 4).week;
                            return input == null ? week : this.add((input - week) * 7, 'd');
                        },
                        weekday: function (input) {
                            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
                            return input == null ? weekday : this.add(input - weekday, 'd');
                        },
                        isoWeekday: function (input) {
                            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
                        },
                        isoWeeksInYear: function () {
                            return weeksInYear(this.year(), 1, 4);
                        },
                        weeksInYear: function () {
                            var weekInfo = this.localeData()._week;
                            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
                        },
                        get: function (units) {
                            units = normalizeUnits(units);
                            return this[units]();
                        },
                        set: function (units, value) {
                            var unit;
                            if (typeof units === 'object') {
                                for (unit in units) {
                                    this.set(unit, units[unit]);
                                }
                            } else {
                                units = normalizeUnits(units);
                                if (typeof this[units] === 'function') {
                                    this[units](value);
                                }
                            }
                            return this;
                        },
                        locale: function (key) {
                            var newLocaleData;
                            if (key === undefined) {
                                return this._locale._abbr;
                            } else {
                                newLocaleData = moment.localeData(key);
                                if (newLocaleData != null) {
                                    this._locale = newLocaleData;
                                }
                                return this;
                            }
                        },
                        lang: deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
                            if (key === undefined) {
                                return this.localeData();
                            } else {
                                return this.locale(key);
                            }
                        }),
                        localeData: function () {
                            return this._locale;
                        },
                        _dateUtcOffset: function () {
                            return -Math.round(this._d.getTimezoneOffset() / 15) * 15;
                        }
                    });
                    function rawMonthSetter(mom, value) {
                        var dayOfMonth;
                        if (typeof value === 'string') {
                            value = mom.localeData().monthsParse(value);
                            if (typeof value !== 'number') {
                                return mom;
                            }
                        }
                        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
                        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
                        return mom;
                    }
                    function rawGetter(mom, unit) {
                        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
                    }
                    function rawSetter(mom, unit, value) {
                        if (unit === 'Month') {
                            return rawMonthSetter(mom, value);
                        } else {
                            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
                        }
                    }
                    function makeAccessor(unit, keepTime) {
                        return function (value) {
                            if (value != null) {
                                rawSetter(this, unit, value);
                                moment.updateOffset(this, keepTime);
                                return this;
                            } else {
                                return rawGetter(this, unit);
                            }
                        };
                    }
                    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
                    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
                    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
                    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
                    moment.fn.date = makeAccessor('Date', true);
                    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
                    moment.fn.year = makeAccessor('FullYear', true);
                    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));
                    moment.fn.days = moment.fn.day;
                    moment.fn.months = moment.fn.month;
                    moment.fn.weeks = moment.fn.week;
                    moment.fn.isoWeeks = moment.fn.isoWeek;
                    moment.fn.quarters = moment.fn.quarter;
                    moment.fn.toJSON = moment.fn.toISOString;
                    moment.fn.isUTC = moment.fn.isUtc;
                    function daysToYears(days) {
                        return days * 400 / 146097;
                    }
                    function yearsToDays(years) {
                        return years * 146097 / 400;
                    }
                    extend(moment.duration.fn = Duration.prototype, {
                        _bubble: function () {
                            var milliseconds = this._milliseconds, days = this._days, months = this._months, data = this._data, seconds, minutes, hours, years = 0;
                            data.milliseconds = milliseconds % 1000;
                            seconds = absRound(milliseconds / 1000);
                            data.seconds = seconds % 60;
                            minutes = absRound(seconds / 60);
                            data.minutes = minutes % 60;
                            hours = absRound(minutes / 60);
                            data.hours = hours % 24;
                            days += absRound(hours / 24);
                            years = absRound(daysToYears(days));
                            days -= absRound(yearsToDays(years));
                            months += absRound(days / 30);
                            days %= 30;
                            years += absRound(months / 12);
                            months %= 12;
                            data.days = days;
                            data.months = months;
                            data.years = years;
                        },
                        abs: function () {
                            this._milliseconds = Math.abs(this._milliseconds);
                            this._days = Math.abs(this._days);
                            this._months = Math.abs(this._months);
                            this._data.milliseconds = Math.abs(this._data.milliseconds);
                            this._data.seconds = Math.abs(this._data.seconds);
                            this._data.minutes = Math.abs(this._data.minutes);
                            this._data.hours = Math.abs(this._data.hours);
                            this._data.months = Math.abs(this._data.months);
                            this._data.years = Math.abs(this._data.years);
                            return this;
                        },
                        weeks: function () {
                            return absRound(this.days() / 7);
                        },
                        valueOf: function () {
                            return this._milliseconds + this._days * 86400000 + this._months % 12 * 2592000000 + toInt(this._months / 12) * 31536000000;
                        },
                        humanize: function (withSuffix) {
                            var output = relativeTime(this, !withSuffix, this.localeData());
                            if (withSuffix) {
                                output = this.localeData().pastFuture(+this, output);
                            }
                            return this.localeData().postformat(output);
                        },
                        add: function (input, val) {
                            var dur = moment.duration(input, val);
                            this._milliseconds += dur._milliseconds;
                            this._days += dur._days;
                            this._months += dur._months;
                            this._bubble();
                            return this;
                        },
                        subtract: function (input, val) {
                            var dur = moment.duration(input, val);
                            this._milliseconds -= dur._milliseconds;
                            this._days -= dur._days;
                            this._months -= dur._months;
                            this._bubble();
                            return this;
                        },
                        get: function (units) {
                            units = normalizeUnits(units);
                            return this[units.toLowerCase() + 's']();
                        },
                        as: function (units) {
                            var days, months;
                            units = normalizeUnits(units);
                            if (units === 'month' || units === 'year') {
                                days = this._days + this._milliseconds / 86400000;
                                months = this._months + daysToYears(days) * 12;
                                return units === 'month' ? months : months / 12;
                            } else {
                                days = this._days + Math.round(yearsToDays(this._months / 12));
                                switch (units) {
                                case 'week':
                                    return days / 7 + this._milliseconds / 604800000;
                                case 'day':
                                    return days + this._milliseconds / 86400000;
                                case 'hour':
                                    return days * 24 + this._milliseconds / 3600000;
                                case 'minute':
                                    return days * 24 * 60 + this._milliseconds / 60000;
                                case 'second':
                                    return days * 24 * 60 * 60 + this._milliseconds / 1000;
                                case 'millisecond':
                                    return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                                default:
                                    throw new Error('Unknown unit ' + units);
                                }
                            }
                        },
                        lang: moment.fn.lang,
                        locale: moment.fn.locale,
                        toIsoString: deprecate('toIsoString() is deprecated. Please use toISOString() instead ' + '(notice the capitals)', function () {
                            return this.toISOString();
                        }),
                        toISOString: function () {
                            var years = Math.abs(this.years()), months = Math.abs(this.months()), days = Math.abs(this.days()), hours = Math.abs(this.hours()), minutes = Math.abs(this.minutes()), seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);
                            if (!this.asSeconds()) {
                                return 'P0D';
                            }
                            return (this.asSeconds() < 0 ? '-' : '') + 'P' + (years ? years + 'Y' : '') + (months ? months + 'M' : '') + (days ? days + 'D' : '') + (hours || minutes || seconds ? 'T' : '') + (hours ? hours + 'H' : '') + (minutes ? minutes + 'M' : '') + (seconds ? seconds + 'S' : '');
                        },
                        localeData: function () {
                            return this._locale;
                        },
                        toJSON: function () {
                            return this.toISOString();
                        }
                    });
                    moment.duration.fn.toString = moment.duration.fn.toISOString;
                    function makeDurationGetter(name) {
                        moment.duration.fn[name] = function () {
                            return this._data[name];
                        };
                    }
                    for (i in unitMillisecondFactors) {
                        if (hasOwnProp(unitMillisecondFactors, i)) {
                            makeDurationGetter(i.toLowerCase());
                        }
                    }
                    moment.duration.fn.asMilliseconds = function () {
                        return this.as('ms');
                    };
                    moment.duration.fn.asSeconds = function () {
                        return this.as('s');
                    };
                    moment.duration.fn.asMinutes = function () {
                        return this.as('m');
                    };
                    moment.duration.fn.asHours = function () {
                        return this.as('h');
                    };
                    moment.duration.fn.asDays = function () {
                        return this.as('d');
                    };
                    moment.duration.fn.asWeeks = function () {
                        return this.as('weeks');
                    };
                    moment.duration.fn.asMonths = function () {
                        return this.as('M');
                    };
                    moment.duration.fn.asYears = function () {
                        return this.as('y');
                    };
                    moment.locale('en', {
                        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
                        ordinal: function (number) {
                            var b = number % 10, output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
                            return number + output;
                        }
                    });
                    function makeGlobal(shouldDeprecate) {
                        if (typeof ender !== 'undefined') {
                            return;
                        }
                        oldGlobalMoment = globalScope.moment;
                        if (shouldDeprecate) {
                            globalScope.moment = deprecate('Accessing Moment through the global scope is ' + 'deprecated, and will be removed in an upcoming ' + 'release.', moment);
                        } else {
                            globalScope.moment = moment;
                        }
                    }
                    if (hasModule) {
                        module.exports = moment;
                    } else if (typeof define === 'function' && define.amd) {
                        define(function (require, exports, module) {
                            if (module.config && module.config() && module.config().noGlobal === true) {
                                globalScope.moment = oldGlobalMoment;
                            }
                            return moment;
                        });
                        makeGlobal(true);
                    } else {
                        makeGlobal();
                    }
                }.call(this));
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {}
    ],
    8: [
        function (require, module, exports) {
            'use strict';
            var baseAssert = require('assert'), empower = require('empower'), formatter = require('power-assert-formatter'), extend = require('xtend'), empowerOptions = {
                    modifyMessageOnRethrow: true,
                    saveContextOnRethrow: true
                };
            function customize(customOptions) {
                var options = customOptions || {};
                var poweredAssert = empower(baseAssert, formatter(options.output), extend(empowerOptions, options.assertion));
                poweredAssert.customize = customize;
                return poweredAssert;
            }
            module.exports = customize();
        },
        {
            'assert': 1,
            'empower': 9,
            'power-assert-formatter': 24,
            'xtend': 48
        }
    ],
    9: [
        function (require, module, exports) {
            var defaultOptions = require('./lib/default-options'), Decorator = require('./lib/decorator'), slice = Array.prototype.slice, extend = require('xtend/mutable');
            function empower(assert, formatter, options) {
                var typeOfAssert = typeof assert, config;
                if (typeOfAssert !== 'object' && typeOfAssert !== 'function' || assert === null) {
                    throw new TypeError('empower argument should be a function or object.');
                }
                if (isEmpowered(assert)) {
                    return assert;
                }
                config = extend(defaultOptions(), options);
                switch (typeOfAssert) {
                case 'function':
                    return empowerAssertFunction(assert, formatter, config);
                case 'object':
                    return empowerAssertObject(assert, formatter, config);
                default:
                    throw new Error('Cannot be here');
                }
            }
            function empowerAssertObject(assertObject, formatter, config) {
                var target = config.destructive ? assertObject : Object.create(assertObject);
                var decorator = new Decorator(target, formatter, config);
                return extend(target, decorator.enhancement());
            }
            function empowerAssertFunction(assertFunction, formatter, config) {
                if (config.destructive) {
                    throw new Error('cannot use destructive:true to function.');
                }
                var decorator = new Decorator(assertFunction, formatter, config);
                var enhancement = decorator.enhancement();
                var powerAssert;
                if (typeof enhancement === 'function') {
                    powerAssert = function powerAssert() {
                        return enhancement.apply(null, slice.apply(arguments));
                    };
                } else {
                    powerAssert = function powerAssert() {
                        return assertFunction.apply(null, slice.apply(arguments));
                    };
                }
                extend(powerAssert, assertFunction);
                return extend(powerAssert, enhancement);
            }
            function isEmpowered(assertObjectOrFunction) {
                return typeof assertObjectOrFunction._capt === 'function' && typeof assertObjectOrFunction._expr === 'function';
            }
            empower.defaultOptions = defaultOptions;
            module.exports = empower;
        },
        {
            './lib/decorator': 12,
            './lib/default-options': 13,
            'xtend/mutable': 49
        }
    ],
    10: [
        function (require, module, exports) {
            'use strict';
            module.exports = function capturable() {
                var events = [];
                function _capt(value, espath) {
                    events.push({
                        value: value,
                        espath: espath
                    });
                    return value;
                }
                function _expr(value, args) {
                    var captured = events;
                    events = [];
                    return {
                        powerAssertContext: {
                            value: value,
                            events: captured
                        },
                        source: {
                            content: args.content,
                            filepath: args.filepath,
                            line: args.line
                        }
                    };
                }
                return {
                    _capt: _capt,
                    _expr: _expr
                };
            };
        },
        {}
    ],
    11: [
        function (require, module, exports) {
            'use strict';
            var slice = Array.prototype.slice;
            function decorate(callSpec, decorator) {
                var func = callSpec.func, thisObj = callSpec.thisObj, numArgsToCapture = callSpec.numArgsToCapture;
                return function decoratedAssert() {
                    var context, message, args = slice.apply(arguments);
                    if (args.every(isNotCaptured)) {
                        return func.apply(thisObj, args);
                    }
                    var values = args.slice(0, numArgsToCapture).map(function (arg) {
                        if (isNotCaptured(arg)) {
                            return arg;
                        }
                        if (!context) {
                            context = {
                                source: arg.source,
                                args: []
                            };
                        }
                        context.args.push({
                            value: arg.powerAssertContext.value,
                            events: arg.powerAssertContext.events
                        });
                        return arg.powerAssertContext.value;
                    });
                    if (numArgsToCapture === args.length - 1) {
                        message = args[args.length - 1];
                    }
                    var invocation = {
                        thisObj: thisObj,
                        func: func,
                        values: values,
                        message: message
                    };
                    return decorator.concreteAssert(invocation, context);
                };
            }
            function isNotCaptured(value) {
                return !isCaptured(value);
            }
            function isCaptured(value) {
                return typeof value === 'object' && value !== null && typeof value.powerAssertContext !== 'undefined';
            }
            module.exports = decorate;
        },
        {}
    ],
    12: [
        function (require, module, exports) {
            'use strict';
            var escallmatch = require('escallmatch'), extend = require('xtend/mutable'), capturable = require('./capturable'), decorate = require('./decorate');
            function Decorator(receiver, formatter, config) {
                this.receiver = receiver;
                this.formatter = formatter;
                this.config = config;
                this.matchers = config.patterns.map(escallmatch);
                this.eagerEvaluation = !(config.modifyMessageOnRethrow || config.saveContextOnRethrow);
            }
            Decorator.prototype.enhancement = function () {
                var that = this;
                var container = this.container();
                this.matchers.filter(methodCall).forEach(function (matcher) {
                    var methodName = detectMethodName(matcher.calleeAst());
                    if (typeof that.receiver[methodName] === 'function') {
                        var callSpec = {
                            thisObj: that.receiver,
                            func: that.receiver[methodName],
                            numArgsToCapture: numberOfArgumentsToCapture(matcher)
                        };
                        container[methodName] = decorate(callSpec, that);
                    }
                });
                extend(container, capturable());
                return container;
            };
            Decorator.prototype.container = function () {
                var basement = {};
                if (typeof this.receiver === 'function') {
                    var candidates = this.matchers.filter(functionCall);
                    if (candidates.length === 1) {
                        var callSpec = {
                            thisObj: null,
                            func: this.receiver,
                            numArgsToCapture: numberOfArgumentsToCapture(candidates[0])
                        };
                        basement = decorate(callSpec, this);
                    }
                }
                return basement;
            };
            Decorator.prototype.concreteAssert = function (invocation, context) {
                var func = invocation.func, thisObj = invocation.thisObj, args = invocation.values, message = invocation.message;
                if (this.eagerEvaluation) {
                    var poweredMessage = this.buildPowerAssertText(message, context);
                    return func.apply(thisObj, args.concat(poweredMessage));
                }
                try {
                    return func.apply(thisObj, args.concat(message));
                } catch (e) {
                    throw this.errorToRethrow(e, message, context);
                }
            };
            Decorator.prototype.errorToRethrow = function (e, originalMessage, context) {
                if (e.name !== 'AssertionError') {
                    return e;
                }
                if (typeof this.receiver.AssertionError !== 'function') {
                    return e;
                }
                var f = new this.receiver.AssertionError({
                    actual: e.actual,
                    expected: e.expected,
                    operator: e.operator,
                    message: this.config.modifyMessageOnRethrow ? this.buildPowerAssertText(originalMessage, context) : e.message,
                    stackStartFunction: Decorator.prototype.concreteAssert
                });
                if (this.config.saveContextOnRethrow) {
                    f.powerAssertContext = context;
                }
                return f;
            };
            Decorator.prototype.buildPowerAssertText = function (message, context) {
                var powerAssertText = this.formatter(context);
                return message ? message + ' ' + powerAssertText : powerAssertText;
            };
            function numberOfArgumentsToCapture(matcher) {
                var argSpecs = matcher.argumentSignatures(), len = argSpecs.length, lastArg;
                if (0 < len) {
                    lastArg = argSpecs[len - 1];
                    if (lastArg.name === 'message' && lastArg.kind === 'optional') {
                        len -= 1;
                    }
                }
                return len;
            }
            function detectMethodName(node) {
                if (node.type === 'MemberExpression') {
                    return node.property.name;
                }
                return null;
            }
            function functionCall(matcher) {
                return matcher.calleeAst().type === 'Identifier';
            }
            function methodCall(matcher) {
                return matcher.calleeAst().type === 'MemberExpression';
            }
            module.exports = Decorator;
        },
        {
            './capturable': 10,
            './decorate': 11,
            'escallmatch': 14,
            'xtend/mutable': 49
        }
    ],
    13: [
        function (require, module, exports) {
            'use strict';
            module.exports = function defaultOptions() {
                return {
                    destructive: false,
                    modifyMessageOnRethrow: false,
                    saveContextOnRethrow: false,
                    patterns: [
                        'assert(value, [message])',
                        'assert.ok(value, [message])',
                        'assert.equal(actual, expected, [message])',
                        'assert.notEqual(actual, expected, [message])',
                        'assert.strictEqual(actual, expected, [message])',
                        'assert.notStrictEqual(actual, expected, [message])',
                        'assert.deepEqual(actual, expected, [message])',
                        'assert.notDeepEqual(actual, expected, [message])'
                    ]
                };
            };
        },
        {}
    ],
    14: [
        function (require, module, exports) {
            'use strict';
            var esprima = require('esprima'), estraverse = require('estraverse'), espurify = require('espurify'), syntax = estraverse.Syntax, hasOwn = Object.prototype.hasOwnProperty, deepEqual = require('deep-equal'), notCallExprMessage = 'Argument should be in the form of CallExpression', duplicatedArgMessage = 'Duplicate argument name: ', invalidFormMessage = 'Argument should be in the form of `name` or `[name]`';
            function createMatcher(signatureStr) {
                var ast = extractExpressionFrom(esprima.parse(signatureStr));
                return new Matcher(ast);
            }
            function Matcher(signatureAst) {
                this.signatureAst = signatureAst;
                this.signatureCalleeDepth = astDepth(signatureAst.callee);
                this.numMaxArgs = this.signatureAst.arguments.length;
                this.numMinArgs = this.signatureAst.arguments.filter(identifiers).length;
            }
            Matcher.prototype.test = function (currentNode) {
                var calleeMatched = isCalleeMatched(this.signatureAst, this.signatureCalleeDepth, currentNode), numArgs;
                if (calleeMatched) {
                    numArgs = currentNode.arguments.length;
                    return this.numMinArgs <= numArgs && numArgs <= this.numMaxArgs;
                }
                return false;
            };
            Matcher.prototype.matchArgument = function (currentNode, parentNode) {
                if (isCalleeOfParent(currentNode, parentNode)) {
                    return null;
                }
                if (this.test(parentNode)) {
                    var indexOfCurrentArg = parentNode.arguments.indexOf(currentNode);
                    var numOptional = parentNode.arguments.length - this.numMinArgs;
                    var matchedSignatures = this.argumentSignatures().reduce(function (accum, argSig) {
                        if (argSig.kind === 'mandatory') {
                            accum.push(argSig);
                        }
                        if (argSig.kind === 'optional' && 0 < numOptional) {
                            numOptional -= 1;
                            accum.push(argSig);
                        }
                        return accum;
                    }, []);
                    return matchedSignatures[indexOfCurrentArg];
                }
                return null;
            };
            Matcher.prototype.calleeAst = function () {
                return espurify(this.signatureAst.callee);
            };
            Matcher.prototype.argumentSignatures = function () {
                return this.signatureAst.arguments.map(toArgumentSignature);
            };
            function toArgumentSignature(argSignatureNode) {
                switch (argSignatureNode.type) {
                case syntax.Identifier:
                    return {
                        name: argSignatureNode.name,
                        kind: 'mandatory'
                    };
                case syntax.ArrayExpression:
                    return {
                        name: argSignatureNode.elements[0].name,
                        kind: 'optional'
                    };
                default:
                    return null;
                }
            }
            function isCalleeMatched(callSignature, signatureCalleeDepth, node) {
                if (!isCallExpression(node)) {
                    return false;
                }
                if (!isSameAstDepth(node.callee, signatureCalleeDepth)) {
                    return false;
                }
                return deepEqual(espurify(callSignature.callee), espurify(node.callee));
            }
            function isSameAstDepth(ast, depth) {
                var currentDepth = 0;
                estraverse.traverse(ast, {
                    enter: function (currentNode, parentNode) {
                        var path = this.path(), pathDepth = path ? path.length : 0;
                        if (currentDepth < pathDepth) {
                            currentDepth = pathDepth;
                        }
                        if (depth < currentDepth) {
                            this['break']();
                        }
                    }
                });
                return depth === currentDepth;
            }
            function astDepth(ast) {
                var maxDepth = 0;
                estraverse.traverse(ast, {
                    enter: function (currentNode, parentNode) {
                        var path = this.path(), pathDepth = path ? path.length : 0;
                        if (maxDepth < pathDepth) {
                            maxDepth = pathDepth;
                        }
                    }
                });
                return maxDepth;
            }
            function isCallExpression(node) {
                return node && node.type === syntax.CallExpression;
            }
            function isCalleeOfParent(currentNode, parentNode) {
                return parentNode && currentNode && parentNode.type === syntax.CallExpression && parentNode.callee === currentNode;
            }
            function identifiers(node) {
                return node.type === syntax.Identifier;
            }
            function validateApiExpression(callExpression) {
                if (callExpression.type !== syntax.CallExpression) {
                    throw new Error(notCallExprMessage);
                }
                var names = {};
                callExpression.arguments.forEach(function (arg) {
                    var name = validateArg(arg);
                    if (hasOwn.call(names, name)) {
                        throw new Error(duplicatedArgMessage + name);
                    } else {
                        names[name] = name;
                    }
                });
            }
            function validateArg(arg) {
                var inner;
                switch (arg.type) {
                case syntax.Identifier:
                    return arg.name;
                case syntax.ArrayExpression:
                    if (arg.elements.length !== 1) {
                        throw new Error(invalidFormMessage);
                    }
                    inner = arg.elements[0];
                    if (inner.type !== syntax.Identifier) {
                        throw new Error(invalidFormMessage);
                    }
                    return inner.name;
                default:
                    throw new Error(invalidFormMessage);
                }
            }
            function extractExpressionFrom(tree) {
                var statement, expression;
                statement = tree.body[0];
                if (statement.type !== syntax.ExpressionStatement) {
                    throw new Error(notCallExprMessage);
                }
                expression = statement.expression;
                validateApiExpression(expression);
                return expression;
            }
            module.exports = createMatcher;
        },
        {
            'deep-equal': 15,
            'esprima': 18,
            'espurify': 19,
            'estraverse': 23
        }
    ],
    15: [
        function (require, module, exports) {
            var pSlice = Array.prototype.slice;
            var objectKeys = require('./lib/keys.js');
            var isArguments = require('./lib/is_arguments.js');
            var deepEqual = module.exports = function (actual, expected, opts) {
                if (!opts)
                    opts = {};
                if (actual === expected) {
                    return true;
                } else if (actual instanceof Date && expected instanceof Date) {
                    return actual.getTime() === expected.getTime();
                } else if (typeof actual != 'object' && typeof expected != 'object') {
                    return opts.strict ? actual === expected : actual == expected;
                } else {
                    return objEquiv(actual, expected, opts);
                }
            };
            function isUndefinedOrNull(value) {
                return value === null || value === undefined;
            }
            function isBuffer(x) {
                if (!x || typeof x !== 'object' || typeof x.length !== 'number')
                    return false;
                if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
                    return false;
                }
                if (x.length > 0 && typeof x[0] !== 'number')
                    return false;
                return true;
            }
            function objEquiv(a, b, opts) {
                var i, key;
                if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
                    return false;
                if (a.prototype !== b.prototype)
                    return false;
                if (isArguments(a)) {
                    if (!isArguments(b)) {
                        return false;
                    }
                    a = pSlice.call(a);
                    b = pSlice.call(b);
                    return deepEqual(a, b, opts);
                }
                if (isBuffer(a)) {
                    if (!isBuffer(b)) {
                        return false;
                    }
                    if (a.length !== b.length)
                        return false;
                    for (i = 0; i < a.length; i++) {
                        if (a[i] !== b[i])
                            return false;
                    }
                    return true;
                }
                try {
                    var ka = objectKeys(a), kb = objectKeys(b);
                } catch (e) {
                    return false;
                }
                if (ka.length != kb.length)
                    return false;
                ka.sort();
                kb.sort();
                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] != kb[i])
                        return false;
                }
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!deepEqual(a[key], b[key], opts))
                        return false;
                }
                return typeof a === typeof b;
            }
        },
        {
            './lib/is_arguments.js': 16,
            './lib/keys.js': 17
        }
    ],
    16: [
        function (require, module, exports) {
            var supportsArgumentsClass = function () {
                return Object.prototype.toString.call(arguments);
            }() == '[object Arguments]';
            exports = module.exports = supportsArgumentsClass ? supported : unsupported;
            exports.supported = supported;
            function supported(object) {
                return Object.prototype.toString.call(object) == '[object Arguments]';
            }
            ;
            exports.unsupported = unsupported;
            function unsupported(object) {
                return object && typeof object == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
            }
            ;
        },
        {}
    ],
    17: [
        function (require, module, exports) {
            exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;
            exports.shim = shim;
            function shim(obj) {
                var keys = [];
                for (var key in obj)
                    keys.push(key);
                return keys;
            }
        },
        {}
    ],
    18: [
        function (require, module, exports) {
            (function (root, factory) {
                'use strict';
                if (typeof define === 'function' && define.amd) {
                    define(['exports'], factory);
                } else if (typeof exports !== 'undefined') {
                    factory(exports);
                } else {
                    factory(root.esprima = {});
                }
            }(this, function (exports) {
                'use strict';
                var Token, TokenName, FnExprTokens, Syntax, PropertyKind, Messages, Regex, SyntaxTreeDelegate, source, strict, index, lineNumber, lineStart, length, delegate, lookahead, state, extra;
                Token = {
                    BooleanLiteral: 1,
                    EOF: 2,
                    Identifier: 3,
                    Keyword: 4,
                    NullLiteral: 5,
                    NumericLiteral: 6,
                    Punctuator: 7,
                    StringLiteral: 8,
                    RegularExpression: 9
                };
                TokenName = {};
                TokenName[Token.BooleanLiteral] = 'Boolean';
                TokenName[Token.EOF] = '<end>';
                TokenName[Token.Identifier] = 'Identifier';
                TokenName[Token.Keyword] = 'Keyword';
                TokenName[Token.NullLiteral] = 'Null';
                TokenName[Token.NumericLiteral] = 'Numeric';
                TokenName[Token.Punctuator] = 'Punctuator';
                TokenName[Token.StringLiteral] = 'String';
                TokenName[Token.RegularExpression] = 'RegularExpression';
                FnExprTokens = [
                    '(',
                    '{',
                    '[',
                    'in',
                    'typeof',
                    'instanceof',
                    'new',
                    'return',
                    'case',
                    'delete',
                    'throw',
                    'void',
                    '=',
                    '+=',
                    '-=',
                    '*=',
                    '/=',
                    '%=',
                    '<<=',
                    '>>=',
                    '>>>=',
                    '&=',
                    '|=',
                    '^=',
                    ',',
                    '+',
                    '-',
                    '*',
                    '/',
                    '%',
                    '++',
                    '--',
                    '<<',
                    '>>',
                    '>>>',
                    '&',
                    '|',
                    '^',
                    '!',
                    '~',
                    '&&',
                    '||',
                    '?',
                    ':',
                    '===',
                    '==',
                    '>=',
                    '<=',
                    '<',
                    '>',
                    '!=',
                    '!=='
                ];
                Syntax = {
                    AssignmentExpression: 'AssignmentExpression',
                    ArrayExpression: 'ArrayExpression',
                    BlockStatement: 'BlockStatement',
                    BinaryExpression: 'BinaryExpression',
                    BreakStatement: 'BreakStatement',
                    CallExpression: 'CallExpression',
                    CatchClause: 'CatchClause',
                    ConditionalExpression: 'ConditionalExpression',
                    ContinueStatement: 'ContinueStatement',
                    DoWhileStatement: 'DoWhileStatement',
                    DebuggerStatement: 'DebuggerStatement',
                    EmptyStatement: 'EmptyStatement',
                    ExpressionStatement: 'ExpressionStatement',
                    ForStatement: 'ForStatement',
                    ForInStatement: 'ForInStatement',
                    FunctionDeclaration: 'FunctionDeclaration',
                    FunctionExpression: 'FunctionExpression',
                    Identifier: 'Identifier',
                    IfStatement: 'IfStatement',
                    Literal: 'Literal',
                    LabeledStatement: 'LabeledStatement',
                    LogicalExpression: 'LogicalExpression',
                    MemberExpression: 'MemberExpression',
                    NewExpression: 'NewExpression',
                    ObjectExpression: 'ObjectExpression',
                    Program: 'Program',
                    Property: 'Property',
                    ReturnStatement: 'ReturnStatement',
                    SequenceExpression: 'SequenceExpression',
                    SwitchStatement: 'SwitchStatement',
                    SwitchCase: 'SwitchCase',
                    ThisExpression: 'ThisExpression',
                    ThrowStatement: 'ThrowStatement',
                    TryStatement: 'TryStatement',
                    UnaryExpression: 'UnaryExpression',
                    UpdateExpression: 'UpdateExpression',
                    VariableDeclaration: 'VariableDeclaration',
                    VariableDeclarator: 'VariableDeclarator',
                    WhileStatement: 'WhileStatement',
                    WithStatement: 'WithStatement'
                };
                PropertyKind = {
                    Data: 1,
                    Get: 2,
                    Set: 4
                };
                Messages = {
                    UnexpectedToken: 'Unexpected token %0',
                    UnexpectedNumber: 'Unexpected number',
                    UnexpectedString: 'Unexpected string',
                    UnexpectedIdentifier: 'Unexpected identifier',
                    UnexpectedReserved: 'Unexpected reserved word',
                    UnexpectedEOS: 'Unexpected end of input',
                    NewlineAfterThrow: 'Illegal newline after throw',
                    InvalidRegExp: 'Invalid regular expression',
                    UnterminatedRegExp: 'Invalid regular expression: missing /',
                    InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
                    InvalidLHSInForIn: 'Invalid left-hand side in for-in',
                    MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
                    NoCatchOrFinally: 'Missing catch or finally after try',
                    UnknownLabel: 'Undefined label \'%0\'',
                    Redeclaration: '%0 \'%1\' has already been declared',
                    IllegalContinue: 'Illegal continue statement',
                    IllegalBreak: 'Illegal break statement',
                    IllegalReturn: 'Illegal return statement',
                    StrictModeWith: 'Strict mode code may not include a with statement',
                    StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
                    StrictVarName: 'Variable name may not be eval or arguments in strict mode',
                    StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
                    StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
                    StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
                    StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
                    StrictDelete: 'Delete of an unqualified identifier in strict mode.',
                    StrictDuplicateProperty: 'Duplicate data property in object literal not allowed in strict mode',
                    AccessorDataProperty: 'Object literal may not have data and accessor property with the same name',
                    AccessorGetSet: 'Object literal may not have multiple get/set accessors with the same name',
                    StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
                    StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
                    StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
                    StrictReservedWord: 'Use of future reserved word in strict mode'
                };
                Regex = {
                    NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
                    NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
                };
                function assert(condition, message) {
                    if (!condition) {
                        throw new Error('ASSERT: ' + message);
                    }
                }
                function isDecimalDigit(ch) {
                    return ch >= 48 && ch <= 57;
                }
                function isHexDigit(ch) {
                    return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
                }
                function isOctalDigit(ch) {
                    return '01234567'.indexOf(ch) >= 0;
                }
                function isWhiteSpace(ch) {
                    return ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch >= 5760 && [
                        5760,
                        6158,
                        8192,
                        8193,
                        8194,
                        8195,
                        8196,
                        8197,
                        8198,
                        8199,
                        8200,
                        8201,
                        8202,
                        8239,
                        8287,
                        12288,
                        65279
                    ].indexOf(ch) >= 0;
                }
                function isLineTerminator(ch) {
                    return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
                }
                function isIdentifierStart(ch) {
                    return ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch));
                }
                function isIdentifierPart(ch) {
                    return ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch >= 48 && ch <= 57 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch));
                }
                function isFutureReservedWord(id) {
                    switch (id) {
                    case 'class':
                    case 'enum':
                    case 'export':
                    case 'extends':
                    case 'import':
                    case 'super':
                        return true;
                    default:
                        return false;
                    }
                }
                function isStrictModeReservedWord(id) {
                    switch (id) {
                    case 'implements':
                    case 'interface':
                    case 'package':
                    case 'private':
                    case 'protected':
                    case 'public':
                    case 'static':
                    case 'yield':
                    case 'let':
                        return true;
                    default:
                        return false;
                    }
                }
                function isRestrictedWord(id) {
                    return id === 'eval' || id === 'arguments';
                }
                function isKeyword(id) {
                    if (strict && isStrictModeReservedWord(id)) {
                        return true;
                    }
                    switch (id.length) {
                    case 2:
                        return id === 'if' || id === 'in' || id === 'do';
                    case 3:
                        return id === 'var' || id === 'for' || id === 'new' || id === 'try' || id === 'let';
                    case 4:
                        return id === 'this' || id === 'else' || id === 'case' || id === 'void' || id === 'with' || id === 'enum';
                    case 5:
                        return id === 'while' || id === 'break' || id === 'catch' || id === 'throw' || id === 'const' || id === 'yield' || id === 'class' || id === 'super';
                    case 6:
                        return id === 'return' || id === 'typeof' || id === 'delete' || id === 'switch' || id === 'export' || id === 'import';
                    case 7:
                        return id === 'default' || id === 'finally' || id === 'extends';
                    case 8:
                        return id === 'function' || id === 'continue' || id === 'debugger';
                    case 10:
                        return id === 'instanceof';
                    default:
                        return false;
                    }
                }
                function addComment(type, value, start, end, loc) {
                    var comment, attacher;
                    assert(assert._expr(assert._capt(assert._capt(typeof start, 'arguments/0/left') === 'number', 'arguments/0'), {
                        content: 'assert(typeof start === \'number\', \'Comment must have valid position\')',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 5438
                    }), 'Comment must have valid position');
                    if (state.lastCommentStart >= start) {
                        return;
                    }
                    state.lastCommentStart = start;
                    comment = {
                        type: type,
                        value: value
                    };
                    if (extra.range) {
                        comment.range = [
                            start,
                            end
                        ];
                    }
                    if (extra.loc) {
                        comment.loc = loc;
                    }
                    extra.comments.push(comment);
                    if (extra.attachComment) {
                        extra.leadingComments.push(comment);
                        extra.trailingComments.push(comment);
                    }
                }
                function skipSingleLineComment(offset) {
                    var start, loc, ch, comment;
                    start = index - offset;
                    loc = {
                        start: {
                            line: lineNumber,
                            column: index - lineStart - offset
                        }
                    };
                    while (index < length) {
                        ch = source.charCodeAt(index);
                        ++index;
                        if (isLineTerminator(ch)) {
                            if (extra.comments) {
                                comment = source.slice(start + offset, index - 1);
                                loc.end = {
                                    line: lineNumber,
                                    column: index - lineStart - 1
                                };
                                addComment('Line', comment, start, index - 1, loc);
                            }
                            if (ch === 13 && source.charCodeAt(index) === 10) {
                                ++index;
                            }
                            ++lineNumber;
                            lineStart = index;
                            return;
                        }
                    }
                    if (extra.comments) {
                        comment = source.slice(start + offset, index);
                        loc.end = {
                            line: lineNumber,
                            column: index - lineStart
                        };
                        addComment('Line', comment, start, index, loc);
                    }
                }
                function skipMultiLineComment() {
                    var start, loc, ch, comment;
                    if (extra.comments) {
                        start = index - 2;
                        loc = {
                            start: {
                                line: lineNumber,
                                column: index - lineStart - 2
                            }
                        };
                    }
                    while (index < length) {
                        ch = source.charCodeAt(index);
                        if (isLineTerminator(ch)) {
                            if (ch === 13 && source.charCodeAt(index + 1) === 10) {
                                ++index;
                            }
                            ++lineNumber;
                            ++index;
                            lineStart = index;
                            if (index >= length) {
                                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                            }
                        } else if (ch === 42) {
                            if (source.charCodeAt(index + 1) === 47) {
                                ++index;
                                ++index;
                                if (extra.comments) {
                                    comment = source.slice(start + 2, index - 2);
                                    loc.end = {
                                        line: lineNumber,
                                        column: index - lineStart
                                    };
                                    addComment('Block', comment, start, index, loc);
                                }
                                return;
                            }
                            ++index;
                        } else {
                            ++index;
                        }
                    }
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
                function skipComment() {
                    var ch, start;
                    start = index === 0;
                    while (index < length) {
                        ch = source.charCodeAt(index);
                        if (isWhiteSpace(ch)) {
                            ++index;
                        } else if (isLineTerminator(ch)) {
                            ++index;
                            if (ch === 13 && source.charCodeAt(index) === 10) {
                                ++index;
                            }
                            ++lineNumber;
                            lineStart = index;
                            start = true;
                        } else if (ch === 47) {
                            ch = source.charCodeAt(index + 1);
                            if (ch === 47) {
                                ++index;
                                ++index;
                                skipSingleLineComment(2);
                                start = true;
                            } else if (ch === 42) {
                                ++index;
                                ++index;
                                skipMultiLineComment();
                            } else {
                                break;
                            }
                        } else if (start && ch === 45) {
                            if (source.charCodeAt(index + 1) === 45 && source.charCodeAt(index + 2) === 62) {
                                index += 3;
                                skipSingleLineComment(3);
                            } else {
                                break;
                            }
                        } else if (ch === 60) {
                            if (source.slice(index + 1, index + 4) === '!--') {
                                ++index;
                                ++index;
                                ++index;
                                ++index;
                                skipSingleLineComment(4);
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                function scanHexEscape(prefix) {
                    var i, len, ch, code = 0;
                    len = prefix === 'u' ? 4 : 2;
                    for (i = 0; i < len; ++i) {
                        if (index < length && isHexDigit(source[index])) {
                            ch = source[index++];
                            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
                        } else {
                            return '';
                        }
                    }
                    return String.fromCharCode(code);
                }
                function getEscapedIdentifier() {
                    var ch, id;
                    ch = source.charCodeAt(index++);
                    id = String.fromCharCode(ch);
                    if (ch === 92) {
                        if (source.charCodeAt(index) !== 117) {
                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                        }
                        ++index;
                        ch = scanHexEscape('u');
                        if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                        }
                        id = ch;
                    }
                    while (index < length) {
                        ch = source.charCodeAt(index);
                        if (!isIdentifierPart(ch)) {
                            break;
                        }
                        ++index;
                        id += String.fromCharCode(ch);
                        if (ch === 92) {
                            id = id.substr(0, id.length - 1);
                            if (source.charCodeAt(index) !== 117) {
                                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                            }
                            ++index;
                            ch = scanHexEscape('u');
                            if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
                                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                            }
                            id += ch;
                        }
                    }
                    return id;
                }
                function getIdentifier() {
                    var start, ch;
                    start = index++;
                    while (index < length) {
                        ch = source.charCodeAt(index);
                        if (ch === 92) {
                            index = start;
                            return getEscapedIdentifier();
                        }
                        if (isIdentifierPart(ch)) {
                            ++index;
                        } else {
                            break;
                        }
                    }
                    return source.slice(start, index);
                }
                function scanIdentifier() {
                    var start, id, type;
                    start = index;
                    id = source.charCodeAt(index) === 92 ? getEscapedIdentifier() : getIdentifier();
                    if (id.length === 1) {
                        type = Token.Identifier;
                    } else if (isKeyword(id)) {
                        type = Token.Keyword;
                    } else if (id === 'null') {
                        type = Token.NullLiteral;
                    } else if (id === 'true' || id === 'false') {
                        type = Token.BooleanLiteral;
                    } else {
                        type = Token.Identifier;
                    }
                    return {
                        type: type,
                        value: id,
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };
                }
                function scanPunctuator() {
                    var start = index, code = source.charCodeAt(index), code2, ch1 = source[index], ch2, ch3, ch4;
                    switch (code) {
                    case 46:
                    case 40:
                    case 41:
                    case 59:
                    case 44:
                    case 123:
                    case 125:
                    case 91:
                    case 93:
                    case 58:
                    case 63:
                    case 126:
                        ++index;
                        if (extra.tokenize) {
                            if (code === 40) {
                                extra.openParenToken = extra.tokens.length;
                            } else if (code === 123) {
                                extra.openCurlyToken = extra.tokens.length;
                            }
                        }
                        return {
                            type: Token.Punctuator,
                            value: String.fromCharCode(code),
                            lineNumber: lineNumber,
                            lineStart: lineStart,
                            start: start,
                            end: index
                        };
                    default:
                        code2 = source.charCodeAt(index + 1);
                        if (code2 === 61) {
                            switch (code) {
                            case 43:
                            case 45:
                            case 47:
                            case 60:
                            case 62:
                            case 94:
                            case 124:
                            case 37:
                            case 38:
                            case 42:
                                index += 2;
                                return {
                                    type: Token.Punctuator,
                                    value: String.fromCharCode(code) + String.fromCharCode(code2),
                                    lineNumber: lineNumber,
                                    lineStart: lineStart,
                                    start: start,
                                    end: index
                                };
                            case 33:
                            case 61:
                                index += 2;
                                if (source.charCodeAt(index) === 61) {
                                    ++index;
                                }
                                return {
                                    type: Token.Punctuator,
                                    value: source.slice(start, index),
                                    lineNumber: lineNumber,
                                    lineStart: lineStart,
                                    start: start,
                                    end: index
                                };
                            }
                        }
                    }
                    ch4 = source.substr(index, 4);
                    if (ch4 === '>>>=') {
                        index += 4;
                        return {
                            type: Token.Punctuator,
                            value: ch4,
                            lineNumber: lineNumber,
                            lineStart: lineStart,
                            start: start,
                            end: index
                        };
                    }
                    ch3 = ch4.substr(0, 3);
                    if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
                        index += 3;
                        return {
                            type: Token.Punctuator,
                            value: ch3,
                            lineNumber: lineNumber,
                            lineStart: lineStart,
                            start: start,
                            end: index
                        };
                    }
                    ch2 = ch3.substr(0, 2);
                    if (ch1 === ch2[1] && '+-<>&|'.indexOf(ch1) >= 0 || ch2 === '=>') {
                        index += 2;
                        return {
                            type: Token.Punctuator,
                            value: ch2,
                            lineNumber: lineNumber,
                            lineStart: lineStart,
                            start: start,
                            end: index
                        };
                    }
                    if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
                        ++index;
                        return {
                            type: Token.Punctuator,
                            value: ch1,
                            lineNumber: lineNumber,
                            lineStart: lineStart,
                            start: start,
                            end: index
                        };
                    }
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
                function scanHexLiteral(start) {
                    var number = '';
                    while (index < length) {
                        if (!isHexDigit(source[index])) {
                            break;
                        }
                        number += source[index++];
                    }
                    if (number.length === 0) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                    if (isIdentifierStart(source.charCodeAt(index))) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                    return {
                        type: Token.NumericLiteral,
                        value: parseInt('0x' + number, 16),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };
                }
                function scanOctalLiteral(start) {
                    var number = '0' + source[index++];
                    while (index < length) {
                        if (!isOctalDigit(source[index])) {
                            break;
                        }
                        number += source[index++];
                    }
                    if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                    return {
                        type: Token.NumericLiteral,
                        value: parseInt(number, 8),
                        octal: true,
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };
                }
                function scanNumericLiteral() {
                    var number, start, ch;
                    ch = source[index];
                    assert(assert._expr(assert._capt(assert._capt(isDecimalDigit(assert._capt(assert._capt(ch, 'arguments/0/left/arguments/0/callee/object').charCodeAt(0), 'arguments/0/left/arguments/0')), 'arguments/0/left') || assert._capt(assert._capt(ch, 'arguments/0/right/left') === '.', 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(isDecimalDigit(ch.charCodeAt(0)) || ch === \'.\', \'Numeric literal must start with a decimal digit or a decimal point\')',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 5937
                    }), 'Numeric literal must start with a decimal digit or a decimal point');
                    start = index;
                    number = '';
                    if (ch !== '.') {
                        number = source[index++];
                        ch = source[index];
                        if (number === '0') {
                            if (ch === 'x' || ch === 'X') {
                                ++index;
                                return scanHexLiteral(start);
                            }
                            if (isOctalDigit(ch)) {
                                return scanOctalLiteral(start);
                            }
                            if (ch && isDecimalDigit(ch.charCodeAt(0))) {
                                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                            }
                        }
                        while (isDecimalDigit(source.charCodeAt(index))) {
                            number += source[index++];
                        }
                        ch = source[index];
                    }
                    if (ch === '.') {
                        number += source[index++];
                        while (isDecimalDigit(source.charCodeAt(index))) {
                            number += source[index++];
                        }
                        ch = source[index];
                    }
                    if (ch === 'e' || ch === 'E') {
                        number += source[index++];
                        ch = source[index];
                        if (ch === '+' || ch === '-') {
                            number += source[index++];
                        }
                        if (isDecimalDigit(source.charCodeAt(index))) {
                            while (isDecimalDigit(source.charCodeAt(index))) {
                                number += source[index++];
                            }
                        } else {
                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                        }
                    }
                    if (isIdentifierStart(source.charCodeAt(index))) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                    return {
                        type: Token.NumericLiteral,
                        value: parseFloat(number),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };
                }
                function scanStringLiteral() {
                    var str = '', quote, start, ch, code, unescaped, restore, octal = false, startLineNumber, startLineStart;
                    startLineNumber = lineNumber;
                    startLineStart = lineStart;
                    quote = source[index];
                    assert(assert._expr(assert._capt(assert._capt(assert._capt(quote, 'arguments/0/left/left') === '\'', 'arguments/0/left') || assert._capt(assert._capt(quote, 'arguments/0/right/left') === '"', 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(quote === \'\\\'\' || quote === \'"\', \'String literal must starts with a quote\')',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 6015
                    }), 'String literal must starts with a quote');
                    start = index;
                    ++index;
                    while (index < length) {
                        ch = source[index++];
                        if (ch === quote) {
                            quote = '';
                            break;
                        } else if (ch === '\\') {
                            ch = source[index++];
                            if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                                switch (ch) {
                                case 'u':
                                case 'x':
                                    restore = index;
                                    unescaped = scanHexEscape(ch);
                                    if (unescaped) {
                                        str += unescaped;
                                    } else {
                                        index = restore;
                                        str += ch;
                                    }
                                    break;
                                case 'n':
                                    str += '\n';
                                    break;
                                case 'r':
                                    str += '\r';
                                    break;
                                case 't':
                                    str += '\t';
                                    break;
                                case 'b':
                                    str += '\b';
                                    break;
                                case 'f':
                                    str += '\f';
                                    break;
                                case 'v':
                                    str += '\x0B';
                                    break;
                                default:
                                    if (isOctalDigit(ch)) {
                                        code = '01234567'.indexOf(ch);
                                        if (code !== 0) {
                                            octal = true;
                                        }
                                        if (index < length && isOctalDigit(source[index])) {
                                            octal = true;
                                            code = code * 8 + '01234567'.indexOf(source[index++]);
                                            if ('0123'.indexOf(ch) >= 0 && index < length && isOctalDigit(source[index])) {
                                                code = code * 8 + '01234567'.indexOf(source[index++]);
                                            }
                                        }
                                        str += String.fromCharCode(code);
                                    } else {
                                        str += ch;
                                    }
                                    break;
                                }
                            } else {
                                ++lineNumber;
                                if (ch === '\r' && source[index] === '\n') {
                                    ++index;
                                }
                                lineStart = index;
                            }
                        } else if (isLineTerminator(ch.charCodeAt(0))) {
                            break;
                        } else {
                            str += ch;
                        }
                    }
                    if (quote !== '') {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                    return {
                        type: Token.StringLiteral,
                        value: str,
                        octal: octal,
                        startLineNumber: startLineNumber,
                        startLineStart: startLineStart,
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        start: start,
                        end: index
                    };
                }
                function testRegExp(pattern, flags) {
                    var value;
                    try {
                        value = new RegExp(pattern, flags);
                    } catch (e) {
                        throwError({}, Messages.InvalidRegExp);
                    }
                    return value;
                }
                function scanRegExpBody() {
                    var ch, str, classMarker, terminated, body;
                    ch = source[index];
                    assert(assert._expr(assert._capt(assert._capt(ch, 'arguments/0/left') === '/', 'arguments/0'), {
                        content: 'assert(ch === \'/\', \'Regular expression literal must start with a slash\')',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 6133
                    }), 'Regular expression literal must start with a slash');
                    str = source[index++];
                    classMarker = false;
                    terminated = false;
                    while (index < length) {
                        ch = source[index++];
                        str += ch;
                        if (ch === '\\') {
                            ch = source[index++];
                            if (isLineTerminator(ch.charCodeAt(0))) {
                                throwError({}, Messages.UnterminatedRegExp);
                            }
                            str += ch;
                        } else if (isLineTerminator(ch.charCodeAt(0))) {
                            throwError({}, Messages.UnterminatedRegExp);
                        } else if (classMarker) {
                            if (ch === ']') {
                                classMarker = false;
                            }
                        } else {
                            if (ch === '/') {
                                terminated = true;
                                break;
                            } else if (ch === '[') {
                                classMarker = true;
                            }
                        }
                    }
                    if (!terminated) {
                        throwError({}, Messages.UnterminatedRegExp);
                    }
                    body = str.substr(1, str.length - 2);
                    return {
                        value: body,
                        literal: str
                    };
                }
                function scanRegExpFlags() {
                    var ch, str, flags, restore;
                    str = '';
                    flags = '';
                    while (index < length) {
                        ch = source[index];
                        if (!isIdentifierPart(ch.charCodeAt(0))) {
                            break;
                        }
                        ++index;
                        if (ch === '\\' && index < length) {
                            ch = source[index];
                            if (ch === 'u') {
                                ++index;
                                restore = index;
                                ch = scanHexEscape('u');
                                if (ch) {
                                    flags += ch;
                                    for (str += '\\u'; restore < index; ++restore) {
                                        str += source[restore];
                                    }
                                } else {
                                    index = restore;
                                    flags += 'u';
                                    str += '\\u';
                                }
                                throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
                            } else {
                                str += '\\';
                                throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
                            }
                        } else {
                            flags += ch;
                            str += ch;
                        }
                    }
                    return {
                        value: flags,
                        literal: str
                    };
                }
                function scanRegExp() {
                    var start, body, flags, pattern, value;
                    lookahead = null;
                    skipComment();
                    start = index;
                    body = scanRegExpBody();
                    flags = scanRegExpFlags();
                    value = testRegExp(body.value, flags.value);
                    if (extra.tokenize) {
                        return {
                            type: Token.RegularExpression,
                            value: value,
                            lineNumber: lineNumber,
                            lineStart: lineStart,
                            start: start,
                            end: index
                        };
                    }
                    return {
                        literal: body.literal + flags.literal,
                        value: value,
                        start: start,
                        end: index
                    };
                }
                function collectRegex() {
                    var pos, loc, regex, token;
                    skipComment();
                    pos = index;
                    loc = {
                        start: {
                            line: lineNumber,
                            column: index - lineStart
                        }
                    };
                    regex = scanRegExp();
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart
                    };
                    if (!extra.tokenize) {
                        if (extra.tokens.length > 0) {
                            token = extra.tokens[extra.tokens.length - 1];
                            if (token.range[0] === pos && token.type === 'Punctuator') {
                                if (token.value === '/' || token.value === '/=') {
                                    extra.tokens.pop();
                                }
                            }
                        }
                        extra.tokens.push({
                            type: 'RegularExpression',
                            value: regex.literal,
                            range: [
                                pos,
                                index
                            ],
                            loc: loc
                        });
                    }
                    return regex;
                }
                function isIdentifierName(token) {
                    return token.type === Token.Identifier || token.type === Token.Keyword || token.type === Token.BooleanLiteral || token.type === Token.NullLiteral;
                }
                function advanceSlash() {
                    var prevToken, checkToken;
                    prevToken = extra.tokens[extra.tokens.length - 1];
                    if (!prevToken) {
                        return collectRegex();
                    }
                    if (prevToken.type === 'Punctuator') {
                        if (prevToken.value === ']') {
                            return scanPunctuator();
                        }
                        if (prevToken.value === ')') {
                            checkToken = extra.tokens[extra.openParenToken - 1];
                            if (checkToken && checkToken.type === 'Keyword' && (checkToken.value === 'if' || checkToken.value === 'while' || checkToken.value === 'for' || checkToken.value === 'with')) {
                                return collectRegex();
                            }
                            return scanPunctuator();
                        }
                        if (prevToken.value === '}') {
                            if (extra.tokens[extra.openCurlyToken - 3] && extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
                                checkToken = extra.tokens[extra.openCurlyToken - 4];
                                if (!checkToken) {
                                    return scanPunctuator();
                                }
                            } else if (extra.tokens[extra.openCurlyToken - 4] && extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
                                checkToken = extra.tokens[extra.openCurlyToken - 5];
                                if (!checkToken) {
                                    return collectRegex();
                                }
                            } else {
                                return scanPunctuator();
                            }
                            if (FnExprTokens.indexOf(checkToken.value) >= 0) {
                                return scanPunctuator();
                            }
                            return collectRegex();
                        }
                        return collectRegex();
                    }
                    if (prevToken.type === 'Keyword' && prevToken.value !== 'this') {
                        return collectRegex();
                    }
                    return scanPunctuator();
                }
                function advance() {
                    var ch;
                    skipComment();
                    if (index >= length) {
                        return {
                            type: Token.EOF,
                            lineNumber: lineNumber,
                            lineStart: lineStart,
                            start: index,
                            end: index
                        };
                    }
                    ch = source.charCodeAt(index);
                    if (isIdentifierStart(ch)) {
                        return scanIdentifier();
                    }
                    if (ch === 40 || ch === 41 || ch === 59) {
                        return scanPunctuator();
                    }
                    if (ch === 39 || ch === 34) {
                        return scanStringLiteral();
                    }
                    if (ch === 46) {
                        if (isDecimalDigit(source.charCodeAt(index + 1))) {
                            return scanNumericLiteral();
                        }
                        return scanPunctuator();
                    }
                    if (isDecimalDigit(ch)) {
                        return scanNumericLiteral();
                    }
                    if (extra.tokenize && ch === 47) {
                        return advanceSlash();
                    }
                    return scanPunctuator();
                }
                function collectToken() {
                    var loc, token, range, value;
                    skipComment();
                    loc = {
                        start: {
                            line: lineNumber,
                            column: index - lineStart
                        }
                    };
                    token = advance();
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart
                    };
                    if (token.type !== Token.EOF) {
                        value = source.slice(token.start, token.end);
                        extra.tokens.push({
                            type: TokenName[token.type],
                            value: value,
                            range: [
                                token.start,
                                token.end
                            ],
                            loc: loc
                        });
                    }
                    return token;
                }
                function lex() {
                    var token;
                    token = lookahead;
                    index = token.end;
                    lineNumber = token.lineNumber;
                    lineStart = token.lineStart;
                    lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
                    index = token.end;
                    lineNumber = token.lineNumber;
                    lineStart = token.lineStart;
                    return token;
                }
                function peek() {
                    var pos, line, start;
                    pos = index;
                    line = lineNumber;
                    start = lineStart;
                    lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
                    index = pos;
                    lineNumber = line;
                    lineStart = start;
                }
                function Position(line, column) {
                    this.line = line;
                    this.column = column;
                }
                function SourceLocation(startLine, startColumn, line, column) {
                    this.start = new Position(startLine, startColumn);
                    this.end = new Position(line, column);
                }
                SyntaxTreeDelegate = {
                    name: 'SyntaxTree',
                    processComment: function (node) {
                        var lastChild, trailingComments;
                        if (node.type === Syntax.Program) {
                            if (node.body.length > 0) {
                                return;
                            }
                        }
                        if (extra.trailingComments.length > 0) {
                            if (extra.trailingComments[0].range[0] >= node.range[1]) {
                                trailingComments = extra.trailingComments;
                                extra.trailingComments = [];
                            } else {
                                extra.trailingComments.length = 0;
                            }
                        } else {
                            if (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments && extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments[0].range[0] >= node.range[1]) {
                                trailingComments = extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
                                delete extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
                            }
                        }
                        while (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].range[0] >= node.range[0]) {
                            lastChild = extra.bottomRightStack.pop();
                        }
                        if (lastChild) {
                            if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
                                node.leadingComments = lastChild.leadingComments;
                                delete lastChild.leadingComments;
                            }
                        } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
                            node.leadingComments = extra.leadingComments;
                            extra.leadingComments = [];
                        }
                        if (trailingComments) {
                            node.trailingComments = trailingComments;
                        }
                        extra.bottomRightStack.push(node);
                    },
                    markEnd: function (node, startToken) {
                        if (extra.range) {
                            node.range = [
                                startToken.start,
                                index
                            ];
                        }
                        if (extra.loc) {
                            node.loc = new SourceLocation(startToken.startLineNumber === undefined ? startToken.lineNumber : startToken.startLineNumber, startToken.start - (startToken.startLineStart === undefined ? startToken.lineStart : startToken.startLineStart), lineNumber, index - lineStart);
                            this.postProcess(node);
                        }
                        if (extra.attachComment) {
                            this.processComment(node);
                        }
                        return node;
                    },
                    postProcess: function (node) {
                        if (extra.source) {
                            node.loc.source = extra.source;
                        }
                        return node;
                    },
                    createArrayExpression: function (elements) {
                        return {
                            type: Syntax.ArrayExpression,
                            elements: elements
                        };
                    },
                    createAssignmentExpression: function (operator, left, right) {
                        return {
                            type: Syntax.AssignmentExpression,
                            operator: operator,
                            left: left,
                            right: right
                        };
                    },
                    createBinaryExpression: function (operator, left, right) {
                        var type = operator === '||' || operator === '&&' ? Syntax.LogicalExpression : Syntax.BinaryExpression;
                        return {
                            type: type,
                            operator: operator,
                            left: left,
                            right: right
                        };
                    },
                    createBlockStatement: function (body) {
                        return {
                            type: Syntax.BlockStatement,
                            body: body
                        };
                    },
                    createBreakStatement: function (label) {
                        return {
                            type: Syntax.BreakStatement,
                            label: label
                        };
                    },
                    createCallExpression: function (callee, args) {
                        return {
                            type: Syntax.CallExpression,
                            callee: callee,
                            'arguments': args
                        };
                    },
                    createCatchClause: function (param, body) {
                        return {
                            type: Syntax.CatchClause,
                            param: param,
                            body: body
                        };
                    },
                    createConditionalExpression: function (test, consequent, alternate) {
                        return {
                            type: Syntax.ConditionalExpression,
                            test: test,
                            consequent: consequent,
                            alternate: alternate
                        };
                    },
                    createContinueStatement: function (label) {
                        return {
                            type: Syntax.ContinueStatement,
                            label: label
                        };
                    },
                    createDebuggerStatement: function () {
                        return { type: Syntax.DebuggerStatement };
                    },
                    createDoWhileStatement: function (body, test) {
                        return {
                            type: Syntax.DoWhileStatement,
                            body: body,
                            test: test
                        };
                    },
                    createEmptyStatement: function () {
                        return { type: Syntax.EmptyStatement };
                    },
                    createExpressionStatement: function (expression) {
                        return {
                            type: Syntax.ExpressionStatement,
                            expression: expression
                        };
                    },
                    createForStatement: function (init, test, update, body) {
                        return {
                            type: Syntax.ForStatement,
                            init: init,
                            test: test,
                            update: update,
                            body: body
                        };
                    },
                    createForInStatement: function (left, right, body) {
                        return {
                            type: Syntax.ForInStatement,
                            left: left,
                            right: right,
                            body: body,
                            each: false
                        };
                    },
                    createFunctionDeclaration: function (id, params, defaults, body) {
                        return {
                            type: Syntax.FunctionDeclaration,
                            id: id,
                            params: params,
                            defaults: defaults,
                            body: body,
                            rest: null,
                            generator: false,
                            expression: false
                        };
                    },
                    createFunctionExpression: function (id, params, defaults, body) {
                        return {
                            type: Syntax.FunctionExpression,
                            id: id,
                            params: params,
                            defaults: defaults,
                            body: body,
                            rest: null,
                            generator: false,
                            expression: false
                        };
                    },
                    createIdentifier: function (name) {
                        return {
                            type: Syntax.Identifier,
                            name: name
                        };
                    },
                    createIfStatement: function (test, consequent, alternate) {
                        return {
                            type: Syntax.IfStatement,
                            test: test,
                            consequent: consequent,
                            alternate: alternate
                        };
                    },
                    createLabeledStatement: function (label, body) {
                        return {
                            type: Syntax.LabeledStatement,
                            label: label,
                            body: body
                        };
                    },
                    createLiteral: function (token) {
                        return {
                            type: Syntax.Literal,
                            value: token.value,
                            raw: source.slice(token.start, token.end)
                        };
                    },
                    createMemberExpression: function (accessor, object, property) {
                        return {
                            type: Syntax.MemberExpression,
                            computed: accessor === '[',
                            object: object,
                            property: property
                        };
                    },
                    createNewExpression: function (callee, args) {
                        return {
                            type: Syntax.NewExpression,
                            callee: callee,
                            'arguments': args
                        };
                    },
                    createObjectExpression: function (properties) {
                        return {
                            type: Syntax.ObjectExpression,
                            properties: properties
                        };
                    },
                    createPostfixExpression: function (operator, argument) {
                        return {
                            type: Syntax.UpdateExpression,
                            operator: operator,
                            argument: argument,
                            prefix: false
                        };
                    },
                    createProgram: function (body) {
                        return {
                            type: Syntax.Program,
                            body: body
                        };
                    },
                    createProperty: function (kind, key, value) {
                        return {
                            type: Syntax.Property,
                            key: key,
                            value: value,
                            kind: kind
                        };
                    },
                    createReturnStatement: function (argument) {
                        return {
                            type: Syntax.ReturnStatement,
                            argument: argument
                        };
                    },
                    createSequenceExpression: function (expressions) {
                        return {
                            type: Syntax.SequenceExpression,
                            expressions: expressions
                        };
                    },
                    createSwitchCase: function (test, consequent) {
                        return {
                            type: Syntax.SwitchCase,
                            test: test,
                            consequent: consequent
                        };
                    },
                    createSwitchStatement: function (discriminant, cases) {
                        return {
                            type: Syntax.SwitchStatement,
                            discriminant: discriminant,
                            cases: cases
                        };
                    },
                    createThisExpression: function () {
                        return { type: Syntax.ThisExpression };
                    },
                    createThrowStatement: function (argument) {
                        return {
                            type: Syntax.ThrowStatement,
                            argument: argument
                        };
                    },
                    createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
                        return {
                            type: Syntax.TryStatement,
                            block: block,
                            guardedHandlers: guardedHandlers,
                            handlers: handlers,
                            finalizer: finalizer
                        };
                    },
                    createUnaryExpression: function (operator, argument) {
                        if (operator === '++' || operator === '--') {
                            return {
                                type: Syntax.UpdateExpression,
                                operator: operator,
                                argument: argument,
                                prefix: true
                            };
                        }
                        return {
                            type: Syntax.UnaryExpression,
                            operator: operator,
                            argument: argument,
                            prefix: true
                        };
                    },
                    createVariableDeclaration: function (declarations, kind) {
                        return {
                            type: Syntax.VariableDeclaration,
                            declarations: declarations,
                            kind: kind
                        };
                    },
                    createVariableDeclarator: function (id, init) {
                        return {
                            type: Syntax.VariableDeclarator,
                            id: id,
                            init: init
                        };
                    },
                    createWhileStatement: function (test, body) {
                        return {
                            type: Syntax.WhileStatement,
                            test: test,
                            body: body
                        };
                    },
                    createWithStatement: function (object, body) {
                        return {
                            type: Syntax.WithStatement,
                            object: object,
                            body: body
                        };
                    }
                };
                function peekLineTerminator() {
                    var pos, line, start, found;
                    pos = index;
                    line = lineNumber;
                    start = lineStart;
                    skipComment();
                    found = lineNumber !== line;
                    index = pos;
                    lineNumber = line;
                    lineStart = start;
                    return found;
                }
                function throwError(token, messageFormat) {
                    var error, args = Array.prototype.slice.call(arguments, 2), msg = messageFormat.replace(/%(\d)/g, function (whole, index) {
                            assert(assert._expr(assert._capt(assert._capt(index, 'arguments/0/left') < assert._capt(assert._capt(args, 'arguments/0/right/object').length, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(index < args.length, \'Message reference must be in range\')',
                                filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                                line: 6919
                            }), 'Message reference must be in range');
                            return args[index];
                        });
                    if (typeof token.lineNumber === 'number') {
                        error = new Error('Line ' + token.lineNumber + ': ' + msg);
                        error.index = token.start;
                        error.lineNumber = token.lineNumber;
                        error.column = token.start - lineStart + 1;
                    } else {
                        error = new Error('Line ' + lineNumber + ': ' + msg);
                        error.index = index;
                        error.lineNumber = lineNumber;
                        error.column = index - lineStart + 1;
                    }
                    error.description = msg;
                    throw error;
                }
                function throwErrorTolerant() {
                    try {
                        throwError.apply(null, arguments);
                    } catch (e) {
                        if (extra.errors) {
                            extra.errors.push(e);
                        } else {
                            throw e;
                        }
                    }
                }
                function throwUnexpected(token) {
                    if (token.type === Token.EOF) {
                        throwError(token, Messages.UnexpectedEOS);
                    }
                    if (token.type === Token.NumericLiteral) {
                        throwError(token, Messages.UnexpectedNumber);
                    }
                    if (token.type === Token.StringLiteral) {
                        throwError(token, Messages.UnexpectedString);
                    }
                    if (token.type === Token.Identifier) {
                        throwError(token, Messages.UnexpectedIdentifier);
                    }
                    if (token.type === Token.Keyword) {
                        if (isFutureReservedWord(token.value)) {
                            throwError(token, Messages.UnexpectedReserved);
                        } else if (strict && isStrictModeReservedWord(token.value)) {
                            throwErrorTolerant(token, Messages.StrictReservedWord);
                            return;
                        }
                        throwError(token, Messages.UnexpectedToken, token.value);
                    }
                    throwError(token, Messages.UnexpectedToken, token.value);
                }
                function expect(value) {
                    var token = lex();
                    if (token.type !== Token.Punctuator || token.value !== value) {
                        throwUnexpected(token);
                    }
                }
                function expectKeyword(keyword) {
                    var token = lex();
                    if (token.type !== Token.Keyword || token.value !== keyword) {
                        throwUnexpected(token);
                    }
                }
                function match(value) {
                    return lookahead.type === Token.Punctuator && lookahead.value === value;
                }
                function matchKeyword(keyword) {
                    return lookahead.type === Token.Keyword && lookahead.value === keyword;
                }
                function matchAssign() {
                    var op;
                    if (lookahead.type !== Token.Punctuator) {
                        return false;
                    }
                    op = lookahead.value;
                    return op === '=' || op === '*=' || op === '/=' || op === '%=' || op === '+=' || op === '-=' || op === '<<=' || op === '>>=' || op === '>>>=' || op === '&=' || op === '^=' || op === '|=';
                }
                function consumeSemicolon() {
                    var line, oldIndex = index, oldLineNumber = lineNumber, oldLineStart = lineStart, oldLookahead = lookahead;
                    if (source.charCodeAt(index) === 59 || match(';')) {
                        lex();
                        return;
                    }
                    line = lineNumber;
                    skipComment();
                    if (lineNumber !== line) {
                        index = oldIndex;
                        lineNumber = oldLineNumber;
                        lineStart = oldLineStart;
                        lookahead = oldLookahead;
                        return;
                    }
                    if (lookahead.type !== Token.EOF && !match('}')) {
                        throwUnexpected(lookahead);
                    }
                }
                function isLeftHandSide(expr) {
                    return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
                }
                function parseArrayInitialiser() {
                    var elements = [], startToken;
                    startToken = lookahead;
                    expect('[');
                    while (!match(']')) {
                        if (match(',')) {
                            lex();
                            elements.push(null);
                        } else {
                            elements.push(parseAssignmentExpression());
                            if (!match(']')) {
                                expect(',');
                            }
                        }
                    }
                    lex();
                    return delegate.markEnd(delegate.createArrayExpression(elements), startToken);
                }
                function parsePropertyFunction(param, first) {
                    var previousStrict, body, startToken;
                    previousStrict = strict;
                    startToken = lookahead;
                    body = parseFunctionSourceElements();
                    if (first && strict && isRestrictedWord(param[0].name)) {
                        throwErrorTolerant(first, Messages.StrictParamName);
                    }
                    strict = previousStrict;
                    return delegate.markEnd(delegate.createFunctionExpression(null, param, [], body), startToken);
                }
                function parseObjectPropertyKey() {
                    var token, startToken;
                    startToken = lookahead;
                    token = lex();
                    if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
                        if (strict && token.octal) {
                            throwErrorTolerant(token, Messages.StrictOctalLiteral);
                        }
                        return delegate.markEnd(delegate.createLiteral(token), startToken);
                    }
                    return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
                }
                function parseObjectProperty() {
                    var token, key, id, value, param, startToken;
                    token = lookahead;
                    startToken = lookahead;
                    if (token.type === Token.Identifier) {
                        id = parseObjectPropertyKey();
                        if (token.value === 'get' && !match(':')) {
                            key = parseObjectPropertyKey();
                            expect('(');
                            expect(')');
                            value = parsePropertyFunction([]);
                            return delegate.markEnd(delegate.createProperty('get', key, value), startToken);
                        }
                        if (token.value === 'set' && !match(':')) {
                            key = parseObjectPropertyKey();
                            expect('(');
                            token = lookahead;
                            if (token.type !== Token.Identifier) {
                                expect(')');
                                throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
                                value = parsePropertyFunction([]);
                            } else {
                                param = [parseVariableIdentifier()];
                                expect(')');
                                value = parsePropertyFunction(param, token);
                            }
                            return delegate.markEnd(delegate.createProperty('set', key, value), startToken);
                        }
                        expect(':');
                        value = parseAssignmentExpression();
                        return delegate.markEnd(delegate.createProperty('init', id, value), startToken);
                    }
                    if (token.type === Token.EOF || token.type === Token.Punctuator) {
                        throwUnexpected(token);
                    } else {
                        key = parseObjectPropertyKey();
                        expect(':');
                        value = parseAssignmentExpression();
                        return delegate.markEnd(delegate.createProperty('init', key, value), startToken);
                    }
                }
                function parseObjectInitialiser() {
                    var properties = [], property, name, key, kind, map = {}, toString = String, startToken;
                    startToken = lookahead;
                    expect('{');
                    while (!match('}')) {
                        property = parseObjectProperty();
                        if (property.key.type === Syntax.Identifier) {
                            name = property.key.name;
                        } else {
                            name = toString(property.key.value);
                        }
                        kind = property.kind === 'init' ? PropertyKind.Data : property.kind === 'get' ? PropertyKind.Get : PropertyKind.Set;
                        key = '$' + name;
                        if (Object.prototype.hasOwnProperty.call(map, key)) {
                            if (map[key] === PropertyKind.Data) {
                                if (strict && kind === PropertyKind.Data) {
                                    throwErrorTolerant({}, Messages.StrictDuplicateProperty);
                                } else if (kind !== PropertyKind.Data) {
                                    throwErrorTolerant({}, Messages.AccessorDataProperty);
                                }
                            } else {
                                if (kind === PropertyKind.Data) {
                                    throwErrorTolerant({}, Messages.AccessorDataProperty);
                                } else if (map[key] & kind) {
                                    throwErrorTolerant({}, Messages.AccessorGetSet);
                                }
                            }
                            map[key] |= kind;
                        } else {
                            map[key] = kind;
                        }
                        properties.push(property);
                        if (!match('}')) {
                            expect(',');
                        }
                    }
                    expect('}');
                    return delegate.markEnd(delegate.createObjectExpression(properties), startToken);
                }
                function parseGroupExpression() {
                    var expr;
                    expect('(');
                    expr = parseExpression();
                    expect(')');
                    return expr;
                }
                function parsePrimaryExpression() {
                    var type, token, expr, startToken;
                    if (match('(')) {
                        return parseGroupExpression();
                    }
                    if (match('[')) {
                        return parseArrayInitialiser();
                    }
                    if (match('{')) {
                        return parseObjectInitialiser();
                    }
                    type = lookahead.type;
                    startToken = lookahead;
                    if (type === Token.Identifier) {
                        expr = delegate.createIdentifier(lex().value);
                    } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
                        if (strict && lookahead.octal) {
                            throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
                        }
                        expr = delegate.createLiteral(lex());
                    } else if (type === Token.Keyword) {
                        if (matchKeyword('function')) {
                            return parseFunctionExpression();
                        }
                        if (matchKeyword('this')) {
                            lex();
                            expr = delegate.createThisExpression();
                        } else {
                            throwUnexpected(lex());
                        }
                    } else if (type === Token.BooleanLiteral) {
                        token = lex();
                        token.value = token.value === 'true';
                        expr = delegate.createLiteral(token);
                    } else if (type === Token.NullLiteral) {
                        token = lex();
                        token.value = null;
                        expr = delegate.createLiteral(token);
                    } else if (match('/') || match('/=')) {
                        if (typeof extra.tokens !== 'undefined') {
                            expr = delegate.createLiteral(collectRegex());
                        } else {
                            expr = delegate.createLiteral(scanRegExp());
                        }
                        peek();
                    } else {
                        throwUnexpected(lex());
                    }
                    return delegate.markEnd(expr, startToken);
                }
                function parseArguments() {
                    var args = [];
                    expect('(');
                    if (!match(')')) {
                        while (index < length) {
                            args.push(parseAssignmentExpression());
                            if (match(')')) {
                                break;
                            }
                            expect(',');
                        }
                    }
                    expect(')');
                    return args;
                }
                function parseNonComputedProperty() {
                    var token, startToken;
                    startToken = lookahead;
                    token = lex();
                    if (!isIdentifierName(token)) {
                        throwUnexpected(token);
                    }
                    return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
                }
                function parseNonComputedMember() {
                    expect('.');
                    return parseNonComputedProperty();
                }
                function parseComputedMember() {
                    var expr;
                    expect('[');
                    expr = parseExpression();
                    expect(']');
                    return expr;
                }
                function parseNewExpression() {
                    var callee, args, startToken;
                    startToken = lookahead;
                    expectKeyword('new');
                    callee = parseLeftHandSideExpression();
                    args = match('(') ? parseArguments() : [];
                    return delegate.markEnd(delegate.createNewExpression(callee, args), startToken);
                }
                function parseLeftHandSideExpressionAllowCall() {
                    var expr, args, property, startToken, previousAllowIn = state.allowIn;
                    startToken = lookahead;
                    state.allowIn = true;
                    expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
                    for (;;) {
                        if (match('.')) {
                            property = parseNonComputedMember();
                            expr = delegate.createMemberExpression('.', expr, property);
                        } else if (match('(')) {
                            args = parseArguments();
                            expr = delegate.createCallExpression(expr, args);
                        } else if (match('[')) {
                            property = parseComputedMember();
                            expr = delegate.createMemberExpression('[', expr, property);
                        } else {
                            break;
                        }
                        delegate.markEnd(expr, startToken);
                    }
                    state.allowIn = previousAllowIn;
                    return expr;
                }
                function parseLeftHandSideExpression() {
                    var expr, property, startToken;
                    assert(assert._expr(assert._capt(assert._capt(state, 'arguments/0/object').allowIn, 'arguments/0'), {
                        content: 'assert(state.allowIn, \'callee of new expression always allow in keyword.\')',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 7396
                    }), 'callee of new expression always allow in keyword.');
                    startToken = lookahead;
                    expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
                    while (match('.') || match('[')) {
                        if (match('[')) {
                            property = parseComputedMember();
                            expr = delegate.createMemberExpression('[', expr, property);
                        } else {
                            property = parseNonComputedMember();
                            expr = delegate.createMemberExpression('.', expr, property);
                        }
                        delegate.markEnd(expr, startToken);
                    }
                    return expr;
                }
                function parsePostfixExpression() {
                    var expr, token, startToken = lookahead;
                    expr = parseLeftHandSideExpressionAllowCall();
                    if (lookahead.type === Token.Punctuator) {
                        if ((match('++') || match('--')) && !peekLineTerminator()) {
                            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                                throwErrorTolerant({}, Messages.StrictLHSPostfix);
                            }
                            if (!isLeftHandSide(expr)) {
                                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
                            }
                            token = lex();
                            expr = delegate.markEnd(delegate.createPostfixExpression(token.value, expr), startToken);
                        }
                    }
                    return expr;
                }
                function parseUnaryExpression() {
                    var token, expr, startToken;
                    if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
                        expr = parsePostfixExpression();
                    } else if (match('++') || match('--')) {
                        startToken = lookahead;
                        token = lex();
                        expr = parseUnaryExpression();
                        if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                            throwErrorTolerant({}, Messages.StrictLHSPrefix);
                        }
                        if (!isLeftHandSide(expr)) {
                            throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
                        }
                        expr = delegate.createUnaryExpression(token.value, expr);
                        expr = delegate.markEnd(expr, startToken);
                    } else if (match('+') || match('-') || match('~') || match('!')) {
                        startToken = lookahead;
                        token = lex();
                        expr = parseUnaryExpression();
                        expr = delegate.createUnaryExpression(token.value, expr);
                        expr = delegate.markEnd(expr, startToken);
                    } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
                        startToken = lookahead;
                        token = lex();
                        expr = parseUnaryExpression();
                        expr = delegate.createUnaryExpression(token.value, expr);
                        expr = delegate.markEnd(expr, startToken);
                        if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                            throwErrorTolerant({}, Messages.StrictDelete);
                        }
                    } else {
                        expr = parsePostfixExpression();
                    }
                    return expr;
                }
                function binaryPrecedence(token, allowIn) {
                    var prec = 0;
                    if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
                        return 0;
                    }
                    switch (token.value) {
                    case '||':
                        prec = 1;
                        break;
                    case '&&':
                        prec = 2;
                        break;
                    case '|':
                        prec = 3;
                        break;
                    case '^':
                        prec = 4;
                        break;
                    case '&':
                        prec = 5;
                        break;
                    case '==':
                    case '!=':
                    case '===':
                    case '!==':
                        prec = 6;
                        break;
                    case '<':
                    case '>':
                    case '<=':
                    case '>=':
                    case 'instanceof':
                        prec = 7;
                        break;
                    case 'in':
                        prec = allowIn ? 7 : 0;
                        break;
                    case '<<':
                    case '>>':
                    case '>>>':
                        prec = 8;
                        break;
                    case '+':
                    case '-':
                        prec = 9;
                        break;
                    case '*':
                    case '/':
                    case '%':
                        prec = 11;
                        break;
                    default:
                        break;
                    }
                    return prec;
                }
                function parseBinaryExpression() {
                    var marker, markers, expr, token, prec, stack, right, operator, left, i;
                    marker = lookahead;
                    left = parseUnaryExpression();
                    token = lookahead;
                    prec = binaryPrecedence(token, state.allowIn);
                    if (prec === 0) {
                        return left;
                    }
                    token.prec = prec;
                    lex();
                    markers = [
                        marker,
                        lookahead
                    ];
                    right = parseUnaryExpression();
                    stack = [
                        left,
                        token,
                        right
                    ];
                    while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {
                        while (stack.length > 2 && prec <= stack[stack.length - 2].prec) {
                            right = stack.pop();
                            operator = stack.pop().value;
                            left = stack.pop();
                            expr = delegate.createBinaryExpression(operator, left, right);
                            markers.pop();
                            marker = markers[markers.length - 1];
                            delegate.markEnd(expr, marker);
                            stack.push(expr);
                        }
                        token = lex();
                        token.prec = prec;
                        stack.push(token);
                        markers.push(lookahead);
                        expr = parseUnaryExpression();
                        stack.push(expr);
                    }
                    i = stack.length - 1;
                    expr = stack[i];
                    markers.pop();
                    while (i > 1) {
                        expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
                        i -= 2;
                        marker = markers.pop();
                        delegate.markEnd(expr, marker);
                    }
                    return expr;
                }
                function parseConditionalExpression() {
                    var expr, previousAllowIn, consequent, alternate, startToken;
                    startToken = lookahead;
                    expr = parseBinaryExpression();
                    if (match('?')) {
                        lex();
                        previousAllowIn = state.allowIn;
                        state.allowIn = true;
                        consequent = parseAssignmentExpression();
                        state.allowIn = previousAllowIn;
                        expect(':');
                        alternate = parseAssignmentExpression();
                        expr = delegate.createConditionalExpression(expr, consequent, alternate);
                        delegate.markEnd(expr, startToken);
                    }
                    return expr;
                }
                function parseAssignmentExpression() {
                    var token, left, right, node, startToken;
                    token = lookahead;
                    startToken = lookahead;
                    node = left = parseConditionalExpression();
                    if (matchAssign()) {
                        if (!isLeftHandSide(left)) {
                            throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
                        }
                        if (strict && left.type === Syntax.Identifier && isRestrictedWord(left.name)) {
                            throwErrorTolerant(token, Messages.StrictLHSAssignment);
                        }
                        token = lex();
                        right = parseAssignmentExpression();
                        node = delegate.markEnd(delegate.createAssignmentExpression(token.value, left, right), startToken);
                    }
                    return node;
                }
                function parseExpression() {
                    var expr, startToken = lookahead;
                    expr = parseAssignmentExpression();
                    if (match(',')) {
                        expr = delegate.createSequenceExpression([expr]);
                        while (index < length) {
                            if (!match(',')) {
                                break;
                            }
                            lex();
                            expr.expressions.push(parseAssignmentExpression());
                        }
                        delegate.markEnd(expr, startToken);
                    }
                    return expr;
                }
                function parseStatementList() {
                    var list = [], statement;
                    while (index < length) {
                        if (match('}')) {
                            break;
                        }
                        statement = parseSourceElement();
                        if (typeof statement === 'undefined') {
                            break;
                        }
                        list.push(statement);
                    }
                    return list;
                }
                function parseBlock() {
                    var block, startToken;
                    startToken = lookahead;
                    expect('{');
                    block = parseStatementList();
                    expect('}');
                    return delegate.markEnd(delegate.createBlockStatement(block), startToken);
                }
                function parseVariableIdentifier() {
                    var token, startToken;
                    startToken = lookahead;
                    token = lex();
                    if (token.type !== Token.Identifier) {
                        throwUnexpected(token);
                    }
                    return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
                }
                function parseVariableDeclaration(kind) {
                    var init = null, id, startToken;
                    startToken = lookahead;
                    id = parseVariableIdentifier();
                    if (strict && isRestrictedWord(id.name)) {
                        throwErrorTolerant({}, Messages.StrictVarName);
                    }
                    if (kind === 'const') {
                        expect('=');
                        init = parseAssignmentExpression();
                    } else if (match('=')) {
                        lex();
                        init = parseAssignmentExpression();
                    }
                    return delegate.markEnd(delegate.createVariableDeclarator(id, init), startToken);
                }
                function parseVariableDeclarationList(kind) {
                    var list = [];
                    do {
                        list.push(parseVariableDeclaration(kind));
                        if (!match(',')) {
                            break;
                        }
                        lex();
                    } while (index < length);
                    return list;
                }
                function parseVariableStatement() {
                    var declarations;
                    expectKeyword('var');
                    declarations = parseVariableDeclarationList();
                    consumeSemicolon();
                    return delegate.createVariableDeclaration(declarations, 'var');
                }
                function parseConstLetDeclaration(kind) {
                    var declarations, startToken;
                    startToken = lookahead;
                    expectKeyword(kind);
                    declarations = parseVariableDeclarationList(kind);
                    consumeSemicolon();
                    return delegate.markEnd(delegate.createVariableDeclaration(declarations, kind), startToken);
                }
                function parseEmptyStatement() {
                    expect(';');
                    return delegate.createEmptyStatement();
                }
                function parseExpressionStatement() {
                    var expr = parseExpression();
                    consumeSemicolon();
                    return delegate.createExpressionStatement(expr);
                }
                function parseIfStatement() {
                    var test, consequent, alternate;
                    expectKeyword('if');
                    expect('(');
                    test = parseExpression();
                    expect(')');
                    consequent = parseStatement();
                    if (matchKeyword('else')) {
                        lex();
                        alternate = parseStatement();
                    } else {
                        alternate = null;
                    }
                    return delegate.createIfStatement(test, consequent, alternate);
                }
                function parseDoWhileStatement() {
                    var body, test, oldInIteration;
                    expectKeyword('do');
                    oldInIteration = state.inIteration;
                    state.inIteration = true;
                    body = parseStatement();
                    state.inIteration = oldInIteration;
                    expectKeyword('while');
                    expect('(');
                    test = parseExpression();
                    expect(')');
                    if (match(';')) {
                        lex();
                    }
                    return delegate.createDoWhileStatement(body, test);
                }
                function parseWhileStatement() {
                    var test, body, oldInIteration;
                    expectKeyword('while');
                    expect('(');
                    test = parseExpression();
                    expect(')');
                    oldInIteration = state.inIteration;
                    state.inIteration = true;
                    body = parseStatement();
                    state.inIteration = oldInIteration;
                    return delegate.createWhileStatement(test, body);
                }
                function parseForVariableDeclaration() {
                    var token, declarations, startToken;
                    startToken = lookahead;
                    token = lex();
                    declarations = parseVariableDeclarationList();
                    return delegate.markEnd(delegate.createVariableDeclaration(declarations, token.value), startToken);
                }
                function parseForStatement() {
                    var init, test, update, left, right, body, oldInIteration, previousAllowIn = state.allowIn;
                    init = test = update = null;
                    expectKeyword('for');
                    expect('(');
                    if (match(';')) {
                        lex();
                    } else {
                        if (matchKeyword('var') || matchKeyword('let')) {
                            state.allowIn = false;
                            init = parseForVariableDeclaration();
                            state.allowIn = previousAllowIn;
                            if (init.declarations.length === 1 && matchKeyword('in')) {
                                lex();
                                left = init;
                                right = parseExpression();
                                init = null;
                            }
                        } else {
                            state.allowIn = false;
                            init = parseExpression();
                            state.allowIn = previousAllowIn;
                            if (matchKeyword('in')) {
                                if (!isLeftHandSide(init)) {
                                    throwErrorTolerant({}, Messages.InvalidLHSInForIn);
                                }
                                lex();
                                left = init;
                                right = parseExpression();
                                init = null;
                            }
                        }
                        if (typeof left === 'undefined') {
                            expect(';');
                        }
                    }
                    if (typeof left === 'undefined') {
                        if (!match(';')) {
                            test = parseExpression();
                        }
                        expect(';');
                        if (!match(')')) {
                            update = parseExpression();
                        }
                    }
                    expect(')');
                    oldInIteration = state.inIteration;
                    state.inIteration = true;
                    body = parseStatement();
                    state.inIteration = oldInIteration;
                    return typeof left === 'undefined' ? delegate.createForStatement(init, test, update, body) : delegate.createForInStatement(left, right, body);
                }
                function parseContinueStatement() {
                    var label = null, key;
                    expectKeyword('continue');
                    if (source.charCodeAt(index) === 59) {
                        lex();
                        if (!state.inIteration) {
                            throwError({}, Messages.IllegalContinue);
                        }
                        return delegate.createContinueStatement(null);
                    }
                    if (peekLineTerminator()) {
                        if (!state.inIteration) {
                            throwError({}, Messages.IllegalContinue);
                        }
                        return delegate.createContinueStatement(null);
                    }
                    if (lookahead.type === Token.Identifier) {
                        label = parseVariableIdentifier();
                        key = '$' + label.name;
                        if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                            throwError({}, Messages.UnknownLabel, label.name);
                        }
                    }
                    consumeSemicolon();
                    if (label === null && !state.inIteration) {
                        throwError({}, Messages.IllegalContinue);
                    }
                    return delegate.createContinueStatement(label);
                }
                function parseBreakStatement() {
                    var label = null, key;
                    expectKeyword('break');
                    if (source.charCodeAt(index) === 59) {
                        lex();
                        if (!(state.inIteration || state.inSwitch)) {
                            throwError({}, Messages.IllegalBreak);
                        }
                        return delegate.createBreakStatement(null);
                    }
                    if (peekLineTerminator()) {
                        if (!(state.inIteration || state.inSwitch)) {
                            throwError({}, Messages.IllegalBreak);
                        }
                        return delegate.createBreakStatement(null);
                    }
                    if (lookahead.type === Token.Identifier) {
                        label = parseVariableIdentifier();
                        key = '$' + label.name;
                        if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                            throwError({}, Messages.UnknownLabel, label.name);
                        }
                    }
                    consumeSemicolon();
                    if (label === null && !(state.inIteration || state.inSwitch)) {
                        throwError({}, Messages.IllegalBreak);
                    }
                    return delegate.createBreakStatement(label);
                }
                function parseReturnStatement() {
                    var argument = null;
                    expectKeyword('return');
                    if (!state.inFunctionBody) {
                        throwErrorTolerant({}, Messages.IllegalReturn);
                    }
                    if (source.charCodeAt(index) === 32) {
                        if (isIdentifierStart(source.charCodeAt(index + 1))) {
                            argument = parseExpression();
                            consumeSemicolon();
                            return delegate.createReturnStatement(argument);
                        }
                    }
                    if (peekLineTerminator()) {
                        return delegate.createReturnStatement(null);
                    }
                    if (!match(';')) {
                        if (!match('}') && lookahead.type !== Token.EOF) {
                            argument = parseExpression();
                        }
                    }
                    consumeSemicolon();
                    return delegate.createReturnStatement(argument);
                }
                function parseWithStatement() {
                    var object, body;
                    if (strict) {
                        skipComment();
                        throwErrorTolerant({}, Messages.StrictModeWith);
                    }
                    expectKeyword('with');
                    expect('(');
                    object = parseExpression();
                    expect(')');
                    body = parseStatement();
                    return delegate.createWithStatement(object, body);
                }
                function parseSwitchCase() {
                    var test, consequent = [], statement, startToken;
                    startToken = lookahead;
                    if (matchKeyword('default')) {
                        lex();
                        test = null;
                    } else {
                        expectKeyword('case');
                        test = parseExpression();
                    }
                    expect(':');
                    while (index < length) {
                        if (match('}') || matchKeyword('default') || matchKeyword('case')) {
                            break;
                        }
                        statement = parseStatement();
                        consequent.push(statement);
                    }
                    return delegate.markEnd(delegate.createSwitchCase(test, consequent), startToken);
                }
                function parseSwitchStatement() {
                    var discriminant, cases, clause, oldInSwitch, defaultFound;
                    expectKeyword('switch');
                    expect('(');
                    discriminant = parseExpression();
                    expect(')');
                    expect('{');
                    cases = [];
                    if (match('}')) {
                        lex();
                        return delegate.createSwitchStatement(discriminant, cases);
                    }
                    oldInSwitch = state.inSwitch;
                    state.inSwitch = true;
                    defaultFound = false;
                    while (index < length) {
                        if (match('}')) {
                            break;
                        }
                        clause = parseSwitchCase();
                        if (clause.test === null) {
                            if (defaultFound) {
                                throwError({}, Messages.MultipleDefaultsInSwitch);
                            }
                            defaultFound = true;
                        }
                        cases.push(clause);
                    }
                    state.inSwitch = oldInSwitch;
                    expect('}');
                    return delegate.createSwitchStatement(discriminant, cases);
                }
                function parseThrowStatement() {
                    var argument;
                    expectKeyword('throw');
                    if (peekLineTerminator()) {
                        throwError({}, Messages.NewlineAfterThrow);
                    }
                    argument = parseExpression();
                    consumeSemicolon();
                    return delegate.createThrowStatement(argument);
                }
                function parseCatchClause() {
                    var param, body, startToken;
                    startToken = lookahead;
                    expectKeyword('catch');
                    expect('(');
                    if (match(')')) {
                        throwUnexpected(lookahead);
                    }
                    param = parseVariableIdentifier();
                    if (strict && isRestrictedWord(param.name)) {
                        throwErrorTolerant({}, Messages.StrictCatchVariable);
                    }
                    expect(')');
                    body = parseBlock();
                    return delegate.markEnd(delegate.createCatchClause(param, body), startToken);
                }
                function parseTryStatement() {
                    var block, handlers = [], finalizer = null;
                    expectKeyword('try');
                    block = parseBlock();
                    if (matchKeyword('catch')) {
                        handlers.push(parseCatchClause());
                    }
                    if (matchKeyword('finally')) {
                        lex();
                        finalizer = parseBlock();
                    }
                    if (handlers.length === 0 && !finalizer) {
                        throwError({}, Messages.NoCatchOrFinally);
                    }
                    return delegate.createTryStatement(block, [], handlers, finalizer);
                }
                function parseDebuggerStatement() {
                    expectKeyword('debugger');
                    consumeSemicolon();
                    return delegate.createDebuggerStatement();
                }
                function parseStatement() {
                    var type = lookahead.type, expr, labeledBody, key, startToken;
                    if (type === Token.EOF) {
                        throwUnexpected(lookahead);
                    }
                    if (type === Token.Punctuator && lookahead.value === '{') {
                        return parseBlock();
                    }
                    startToken = lookahead;
                    if (type === Token.Punctuator) {
                        switch (lookahead.value) {
                        case ';':
                            return delegate.markEnd(parseEmptyStatement(), startToken);
                        case '(':
                            return delegate.markEnd(parseExpressionStatement(), startToken);
                        default:
                            break;
                        }
                    }
                    if (type === Token.Keyword) {
                        switch (lookahead.value) {
                        case 'break':
                            return delegate.markEnd(parseBreakStatement(), startToken);
                        case 'continue':
                            return delegate.markEnd(parseContinueStatement(), startToken);
                        case 'debugger':
                            return delegate.markEnd(parseDebuggerStatement(), startToken);
                        case 'do':
                            return delegate.markEnd(parseDoWhileStatement(), startToken);
                        case 'for':
                            return delegate.markEnd(parseForStatement(), startToken);
                        case 'function':
                            return delegate.markEnd(parseFunctionDeclaration(), startToken);
                        case 'if':
                            return delegate.markEnd(parseIfStatement(), startToken);
                        case 'return':
                            return delegate.markEnd(parseReturnStatement(), startToken);
                        case 'switch':
                            return delegate.markEnd(parseSwitchStatement(), startToken);
                        case 'throw':
                            return delegate.markEnd(parseThrowStatement(), startToken);
                        case 'try':
                            return delegate.markEnd(parseTryStatement(), startToken);
                        case 'var':
                            return delegate.markEnd(parseVariableStatement(), startToken);
                        case 'while':
                            return delegate.markEnd(parseWhileStatement(), startToken);
                        case 'with':
                            return delegate.markEnd(parseWithStatement(), startToken);
                        default:
                            break;
                        }
                    }
                    expr = parseExpression();
                    if (expr.type === Syntax.Identifier && match(':')) {
                        lex();
                        key = '$' + expr.name;
                        if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                            throwError({}, Messages.Redeclaration, 'Label', expr.name);
                        }
                        state.labelSet[key] = true;
                        labeledBody = parseStatement();
                        delete state.labelSet[key];
                        return delegate.markEnd(delegate.createLabeledStatement(expr, labeledBody), startToken);
                    }
                    consumeSemicolon();
                    return delegate.markEnd(delegate.createExpressionStatement(expr), startToken);
                }
                function parseFunctionSourceElements() {
                    var sourceElement, sourceElements = [], token, directive, firstRestricted, oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, startToken;
                    startToken = lookahead;
                    expect('{');
                    while (index < length) {
                        if (lookahead.type !== Token.StringLiteral) {
                            break;
                        }
                        token = lookahead;
                        sourceElement = parseSourceElement();
                        sourceElements.push(sourceElement);
                        if (sourceElement.expression.type !== Syntax.Literal) {
                            break;
                        }
                        directive = source.slice(token.start + 1, token.end - 1);
                        if (directive === 'use strict') {
                            strict = true;
                            if (firstRestricted) {
                                throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                            }
                        } else {
                            if (!firstRestricted && token.octal) {
                                firstRestricted = token;
                            }
                        }
                    }
                    oldLabelSet = state.labelSet;
                    oldInIteration = state.inIteration;
                    oldInSwitch = state.inSwitch;
                    oldInFunctionBody = state.inFunctionBody;
                    state.labelSet = {};
                    state.inIteration = false;
                    state.inSwitch = false;
                    state.inFunctionBody = true;
                    while (index < length) {
                        if (match('}')) {
                            break;
                        }
                        sourceElement = parseSourceElement();
                        if (typeof sourceElement === 'undefined') {
                            break;
                        }
                        sourceElements.push(sourceElement);
                    }
                    expect('}');
                    state.labelSet = oldLabelSet;
                    state.inIteration = oldInIteration;
                    state.inSwitch = oldInSwitch;
                    state.inFunctionBody = oldInFunctionBody;
                    return delegate.markEnd(delegate.createBlockStatement(sourceElements), startToken);
                }
                function parseParams(firstRestricted) {
                    var param, params = [], token, stricted, paramSet, key, message;
                    expect('(');
                    if (!match(')')) {
                        paramSet = {};
                        while (index < length) {
                            token = lookahead;
                            param = parseVariableIdentifier();
                            key = '$' + token.value;
                            if (strict) {
                                if (isRestrictedWord(token.value)) {
                                    stricted = token;
                                    message = Messages.StrictParamName;
                                }
                                if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                                    stricted = token;
                                    message = Messages.StrictParamDupe;
                                }
                            } else if (!firstRestricted) {
                                if (isRestrictedWord(token.value)) {
                                    firstRestricted = token;
                                    message = Messages.StrictParamName;
                                } else if (isStrictModeReservedWord(token.value)) {
                                    firstRestricted = token;
                                    message = Messages.StrictReservedWord;
                                } else if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                                    firstRestricted = token;
                                    message = Messages.StrictParamDupe;
                                }
                            }
                            params.push(param);
                            paramSet[key] = true;
                            if (match(')')) {
                                break;
                            }
                            expect(',');
                        }
                    }
                    expect(')');
                    return {
                        params: params,
                        stricted: stricted,
                        firstRestricted: firstRestricted,
                        message: message
                    };
                }
                function parseFunctionDeclaration() {
                    var id, params = [], body, token, stricted, tmp, firstRestricted, message, previousStrict, startToken;
                    startToken = lookahead;
                    expectKeyword('function');
                    token = lookahead;
                    id = parseVariableIdentifier();
                    if (strict) {
                        if (isRestrictedWord(token.value)) {
                            throwErrorTolerant(token, Messages.StrictFunctionName);
                        }
                    } else {
                        if (isRestrictedWord(token.value)) {
                            firstRestricted = token;
                            message = Messages.StrictFunctionName;
                        } else if (isStrictModeReservedWord(token.value)) {
                            firstRestricted = token;
                            message = Messages.StrictReservedWord;
                        }
                    }
                    tmp = parseParams(firstRestricted);
                    params = tmp.params;
                    stricted = tmp.stricted;
                    firstRestricted = tmp.firstRestricted;
                    if (tmp.message) {
                        message = tmp.message;
                    }
                    previousStrict = strict;
                    body = parseFunctionSourceElements();
                    if (strict && firstRestricted) {
                        throwError(firstRestricted, message);
                    }
                    if (strict && stricted) {
                        throwErrorTolerant(stricted, message);
                    }
                    strict = previousStrict;
                    return delegate.markEnd(delegate.createFunctionDeclaration(id, params, [], body), startToken);
                }
                function parseFunctionExpression() {
                    var token, id = null, stricted, firstRestricted, message, tmp, params = [], body, previousStrict, startToken;
                    startToken = lookahead;
                    expectKeyword('function');
                    if (!match('(')) {
                        token = lookahead;
                        id = parseVariableIdentifier();
                        if (strict) {
                            if (isRestrictedWord(token.value)) {
                                throwErrorTolerant(token, Messages.StrictFunctionName);
                            }
                        } else {
                            if (isRestrictedWord(token.value)) {
                                firstRestricted = token;
                                message = Messages.StrictFunctionName;
                            } else if (isStrictModeReservedWord(token.value)) {
                                firstRestricted = token;
                                message = Messages.StrictReservedWord;
                            }
                        }
                    }
                    tmp = parseParams(firstRestricted);
                    params = tmp.params;
                    stricted = tmp.stricted;
                    firstRestricted = tmp.firstRestricted;
                    if (tmp.message) {
                        message = tmp.message;
                    }
                    previousStrict = strict;
                    body = parseFunctionSourceElements();
                    if (strict && firstRestricted) {
                        throwError(firstRestricted, message);
                    }
                    if (strict && stricted) {
                        throwErrorTolerant(stricted, message);
                    }
                    strict = previousStrict;
                    return delegate.markEnd(delegate.createFunctionExpression(id, params, [], body), startToken);
                }
                function parseSourceElement() {
                    if (lookahead.type === Token.Keyword) {
                        switch (lookahead.value) {
                        case 'const':
                        case 'let':
                            return parseConstLetDeclaration(lookahead.value);
                        case 'function':
                            return parseFunctionDeclaration();
                        default:
                            return parseStatement();
                        }
                    }
                    if (lookahead.type !== Token.EOF) {
                        return parseStatement();
                    }
                }
                function parseSourceElements() {
                    var sourceElement, sourceElements = [], token, directive, firstRestricted;
                    while (index < length) {
                        token = lookahead;
                        if (token.type !== Token.StringLiteral) {
                            break;
                        }
                        sourceElement = parseSourceElement();
                        sourceElements.push(sourceElement);
                        if (sourceElement.expression.type !== Syntax.Literal) {
                            break;
                        }
                        directive = source.slice(token.start + 1, token.end - 1);
                        if (directive === 'use strict') {
                            strict = true;
                            if (firstRestricted) {
                                throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                            }
                        } else {
                            if (!firstRestricted && token.octal) {
                                firstRestricted = token;
                            }
                        }
                    }
                    while (index < length) {
                        sourceElement = parseSourceElement();
                        if (typeof sourceElement === 'undefined') {
                            break;
                        }
                        sourceElements.push(sourceElement);
                    }
                    return sourceElements;
                }
                function parseProgram() {
                    var body, startToken;
                    skipComment();
                    peek();
                    startToken = lookahead;
                    strict = false;
                    body = parseSourceElements();
                    return delegate.markEnd(delegate.createProgram(body), startToken);
                }
                function filterTokenLocation() {
                    var i, entry, token, tokens = [];
                    for (i = 0; i < extra.tokens.length; ++i) {
                        entry = extra.tokens[i];
                        token = {
                            type: entry.type,
                            value: entry.value
                        };
                        if (extra.range) {
                            token.range = entry.range;
                        }
                        if (extra.loc) {
                            token.loc = entry.loc;
                        }
                        tokens.push(token);
                    }
                    extra.tokens = tokens;
                }
                function tokenize(code, options) {
                    var toString, token, tokens;
                    toString = String;
                    if (typeof code !== 'string' && !(code instanceof String)) {
                        code = toString(code);
                    }
                    delegate = SyntaxTreeDelegate;
                    source = code;
                    index = 0;
                    lineNumber = source.length > 0 ? 1 : 0;
                    lineStart = 0;
                    length = source.length;
                    lookahead = null;
                    state = {
                        allowIn: true,
                        labelSet: {},
                        inFunctionBody: false,
                        inIteration: false,
                        inSwitch: false,
                        lastCommentStart: -1
                    };
                    extra = {};
                    options = options || {};
                    options.tokens = true;
                    extra.tokens = [];
                    extra.tokenize = true;
                    extra.openParenToken = -1;
                    extra.openCurlyToken = -1;
                    extra.range = typeof options.range === 'boolean' && options.range;
                    extra.loc = typeof options.loc === 'boolean' && options.loc;
                    if (typeof options.comment === 'boolean' && options.comment) {
                        extra.comments = [];
                    }
                    if (typeof options.tolerant === 'boolean' && options.tolerant) {
                        extra.errors = [];
                    }
                    try {
                        peek();
                        if (lookahead.type === Token.EOF) {
                            return extra.tokens;
                        }
                        token = lex();
                        while (lookahead.type !== Token.EOF) {
                            try {
                                token = lex();
                            } catch (lexError) {
                                token = lookahead;
                                if (extra.errors) {
                                    extra.errors.push(lexError);
                                    break;
                                } else {
                                    throw lexError;
                                }
                            }
                        }
                        filterTokenLocation();
                        tokens = extra.tokens;
                        if (typeof extra.comments !== 'undefined') {
                            tokens.comments = extra.comments;
                        }
                        if (typeof extra.errors !== 'undefined') {
                            tokens.errors = extra.errors;
                        }
                    } catch (e) {
                        throw e;
                    } finally {
                        extra = {};
                    }
                    return tokens;
                }
                function parse(code, options) {
                    var program, toString;
                    toString = String;
                    if (typeof code !== 'string' && !(code instanceof String)) {
                        code = toString(code);
                    }
                    delegate = SyntaxTreeDelegate;
                    source = code;
                    index = 0;
                    lineNumber = source.length > 0 ? 1 : 0;
                    lineStart = 0;
                    length = source.length;
                    lookahead = null;
                    state = {
                        allowIn: true,
                        labelSet: {},
                        inFunctionBody: false,
                        inIteration: false,
                        inSwitch: false,
                        lastCommentStart: -1
                    };
                    extra = {};
                    if (typeof options !== 'undefined') {
                        extra.range = typeof options.range === 'boolean' && options.range;
                        extra.loc = typeof options.loc === 'boolean' && options.loc;
                        extra.attachComment = typeof options.attachComment === 'boolean' && options.attachComment;
                        if (extra.loc && options.source !== null && options.source !== undefined) {
                            extra.source = toString(options.source);
                        }
                        if (typeof options.tokens === 'boolean' && options.tokens) {
                            extra.tokens = [];
                        }
                        if (typeof options.comment === 'boolean' && options.comment) {
                            extra.comments = [];
                        }
                        if (typeof options.tolerant === 'boolean' && options.tolerant) {
                            extra.errors = [];
                        }
                        if (extra.attachComment) {
                            extra.range = true;
                            extra.comments = [];
                            extra.bottomRightStack = [];
                            extra.trailingComments = [];
                            extra.leadingComments = [];
                        }
                    }
                    try {
                        program = parseProgram();
                        if (typeof extra.comments !== 'undefined') {
                            program.comments = extra.comments;
                        }
                        if (typeof extra.tokens !== 'undefined') {
                            filterTokenLocation();
                            program.tokens = extra.tokens;
                        }
                        if (typeof extra.errors !== 'undefined') {
                            program.errors = extra.errors;
                        }
                    } catch (e) {
                        throw e;
                    } finally {
                        extra = {};
                    }
                    return program;
                }
                exports.version = '1.2.4';
                exports.tokenize = tokenize;
                exports.parse = parse;
                exports.Syntax = function () {
                    var name, types = {};
                    if (typeof Object.create === 'function') {
                        types = Object.create(null);
                    }
                    for (name in Syntax) {
                        if (Syntax.hasOwnProperty(name)) {
                            types[name] = Syntax[name];
                        }
                    }
                    if (typeof Object.freeze === 'function') {
                        Object.freeze(types);
                    }
                    return types;
                }();
            }));
        },
        {}
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            var traverse = require('traverse'), deepCopy = require('./lib/ast-deepcopy'), astProps = require('./lib/ast-properties'), hasOwn = Object.prototype.hasOwnProperty;
            function espurify(node) {
                var result = deepCopy(node);
                traverse(result).forEach(function (x) {
                    if (this.parent && this.parent.node && this.parent.node.type && isSupportedNodeType(this.parent.node.type) && !isSupportedKey(this.parent.node.type, this.key)) {
                        this.remove(true);
                    }
                });
                return result;
            }
            function isSupportedNodeType(type) {
                return hasOwn.call(astProps, type);
            }
            function isSupportedKey(type, key) {
                return astProps[type].indexOf(key) !== -1;
            }
            module.exports = espurify;
        },
        {
            './lib/ast-deepcopy': 20,
            './lib/ast-properties': 21,
            'traverse': 22
        }
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            var isArray = Array.isArray || function isArray(array) {
                return Object.prototype.toString.call(array) === '[object Array]';
            };
            function deepCopyInternal(obj, result) {
                var key, val;
                for (key in obj) {
                    if (key.lastIndexOf('__', 0) === 0) {
                        continue;
                    }
                    if (obj.hasOwnProperty(key)) {
                        val = obj[key];
                        if (typeof val === 'object' && val !== null) {
                            if (val instanceof RegExp) {
                                val = new RegExp(val);
                            } else {
                                val = deepCopyInternal(val, isArray(val) ? [] : {});
                            }
                        }
                        result[key] = val;
                    }
                }
                return result;
            }
            function deepCopy(obj) {
                return deepCopyInternal(obj, isArray(obj) ? [] : {});
            }
            module.exports = deepCopy;
        },
        {}
    ],
    21: [
        function (require, module, exports) {
            module.exports = {
                AssignmentExpression: [
                    'type',
                    'operator',
                    'left',
                    'right'
                ],
                ArrayExpression: [
                    'type',
                    'elements'
                ],
                ArrayPattern: [
                    'type',
                    'elements'
                ],
                BlockStatement: [
                    'type',
                    'body'
                ],
                BinaryExpression: [
                    'type',
                    'operator',
                    'left',
                    'right'
                ],
                BreakStatement: [
                    'type',
                    'label'
                ],
                CallExpression: [
                    'type',
                    'callee',
                    'arguments'
                ],
                CatchClause: [
                    'type',
                    'param',
                    'guard',
                    'body'
                ],
                ConditionalExpression: [
                    'type',
                    'test',
                    'consequent',
                    'alternate'
                ],
                ContinueStatement: [
                    'type',
                    'label'
                ],
                DebuggerStatement: ['type'],
                DoWhileStatement: [
                    'type',
                    'body',
                    'test'
                ],
                EmptyStatement: ['type'],
                ExpressionStatement: [
                    'type',
                    'expression'
                ],
                ForStatement: [
                    'type',
                    'init',
                    'test',
                    'update',
                    'body'
                ],
                ForInStatement: [
                    'type',
                    'left',
                    'right',
                    'body',
                    'each'
                ],
                FunctionDeclaration: [
                    'type',
                    'id',
                    'params',
                    'defaults',
                    'rest',
                    'body',
                    'generator',
                    'expression'
                ],
                FunctionExpression: [
                    'type',
                    'id',
                    'params',
                    'defaults',
                    'rest',
                    'body',
                    'generator',
                    'expression'
                ],
                Identifier: [
                    'type',
                    'name'
                ],
                IfStatement: [
                    'type',
                    'test',
                    'consequent',
                    'alternate'
                ],
                Literal: [
                    'type',
                    'value'
                ],
                LabeledStatement: [
                    'type',
                    'label',
                    'body'
                ],
                LogicalExpression: [
                    'type',
                    'operator',
                    'left',
                    'right'
                ],
                MemberExpression: [
                    'type',
                    'object',
                    'property',
                    'computed'
                ],
                NewExpression: [
                    'type',
                    'callee',
                    'arguments'
                ],
                ObjectExpression: [
                    'type',
                    'properties'
                ],
                ObjectPattern: [
                    'type',
                    'properties'
                ],
                Program: [
                    'type',
                    'body'
                ],
                Property: [
                    'type',
                    'key',
                    'value',
                    'kind'
                ],
                ReturnStatement: [
                    'type',
                    'argument'
                ],
                SequenceExpression: [
                    'type',
                    'expressions'
                ],
                SwitchStatement: [
                    'type',
                    'discriminant',
                    'cases',
                    'lexical'
                ],
                SwitchCase: [
                    'type',
                    'test',
                    'consequent'
                ],
                ThisExpression: ['type'],
                ThrowStatement: [
                    'type',
                    'argument'
                ],
                TryStatement: [
                    'type',
                    'block',
                    'handlers',
                    'handler',
                    'guardedHandlers',
                    'finalizer'
                ],
                UnaryExpression: [
                    'type',
                    'operator',
                    'prefix',
                    'argument'
                ],
                UpdateExpression: [
                    'type',
                    'operator',
                    'argument',
                    'prefix'
                ],
                VariableDeclaration: [
                    'type',
                    'declarations',
                    'kind'
                ],
                VariableDeclarator: [
                    'type',
                    'id',
                    'init'
                ],
                WhileStatement: [
                    'type',
                    'test',
                    'body'
                ],
                WithStatement: [
                    'type',
                    'object',
                    'body'
                ],
                YieldExpression: [
                    'type',
                    'argument'
                ]
            };
        },
        {}
    ],
    22: [
        function (require, module, exports) {
            var traverse = module.exports = function (obj) {
                return new Traverse(obj);
            };
            function Traverse(obj) {
                this.value = obj;
            }
            Traverse.prototype.get = function (ps) {
                var node = this.value;
                for (var i = 0; i < ps.length; i++) {
                    var key = ps[i];
                    if (!node || !hasOwnProperty.call(node, key)) {
                        node = undefined;
                        break;
                    }
                    node = node[key];
                }
                return node;
            };
            Traverse.prototype.has = function (ps) {
                var node = this.value;
                for (var i = 0; i < ps.length; i++) {
                    var key = ps[i];
                    if (!node || !hasOwnProperty.call(node, key)) {
                        return false;
                    }
                    node = node[key];
                }
                return true;
            };
            Traverse.prototype.set = function (ps, value) {
                var node = this.value;
                for (var i = 0; i < ps.length - 1; i++) {
                    var key = ps[i];
                    if (!hasOwnProperty.call(node, key))
                        node[key] = {};
                    node = node[key];
                }
                node[ps[i]] = value;
                return value;
            };
            Traverse.prototype.map = function (cb) {
                return walk(this.value, cb, true);
            };
            Traverse.prototype.forEach = function (cb) {
                this.value = walk(this.value, cb, false);
                return this.value;
            };
            Traverse.prototype.reduce = function (cb, init) {
                var skip = arguments.length === 1;
                var acc = skip ? this.value : init;
                this.forEach(function (x) {
                    if (!this.isRoot || !skip) {
                        acc = cb.call(this, acc, x);
                    }
                });
                return acc;
            };
            Traverse.prototype.paths = function () {
                var acc = [];
                this.forEach(function (x) {
                    acc.push(this.path);
                });
                return acc;
            };
            Traverse.prototype.nodes = function () {
                var acc = [];
                this.forEach(function (x) {
                    acc.push(this.node);
                });
                return acc;
            };
            Traverse.prototype.clone = function () {
                var parents = [], nodes = [];
                return function clone(src) {
                    for (var i = 0; i < parents.length; i++) {
                        if (parents[i] === src) {
                            return nodes[i];
                        }
                    }
                    if (typeof src === 'object' && src !== null) {
                        var dst = copy(src);
                        parents.push(src);
                        nodes.push(dst);
                        forEach(objectKeys(src), function (key) {
                            dst[key] = clone(src[key]);
                        });
                        parents.pop();
                        nodes.pop();
                        return dst;
                    } else {
                        return src;
                    }
                }(this.value);
            };
            function walk(root, cb, immutable) {
                var path = [];
                var parents = [];
                var alive = true;
                return function walker(node_) {
                    var node = immutable ? copy(node_) : node_;
                    var modifiers = {};
                    var keepGoing = true;
                    var state = {
                        node: node,
                        node_: node_,
                        path: [].concat(path),
                        parent: parents[parents.length - 1],
                        parents: parents,
                        key: path.slice(-1)[0],
                        isRoot: path.length === 0,
                        level: path.length,
                        circular: null,
                        update: function (x, stopHere) {
                            if (!state.isRoot) {
                                state.parent.node[state.key] = x;
                            }
                            state.node = x;
                            if (stopHere)
                                keepGoing = false;
                        },
                        'delete': function (stopHere) {
                            delete state.parent.node[state.key];
                            if (stopHere)
                                keepGoing = false;
                        },
                        remove: function (stopHere) {
                            if (isArray(state.parent.node)) {
                                state.parent.node.splice(state.key, 1);
                            } else {
                                delete state.parent.node[state.key];
                            }
                            if (stopHere)
                                keepGoing = false;
                        },
                        keys: null,
                        before: function (f) {
                            modifiers.before = f;
                        },
                        after: function (f) {
                            modifiers.after = f;
                        },
                        pre: function (f) {
                            modifiers.pre = f;
                        },
                        post: function (f) {
                            modifiers.post = f;
                        },
                        stop: function () {
                            alive = false;
                        },
                        block: function () {
                            keepGoing = false;
                        }
                    };
                    if (!alive)
                        return state;
                    function updateState() {
                        if (typeof state.node === 'object' && state.node !== null) {
                            if (!state.keys || state.node_ !== state.node) {
                                state.keys = objectKeys(state.node);
                            }
                            state.isLeaf = state.keys.length == 0;
                            for (var i = 0; i < parents.length; i++) {
                                if (parents[i].node_ === node_) {
                                    state.circular = parents[i];
                                    break;
                                }
                            }
                        } else {
                            state.isLeaf = true;
                            state.keys = null;
                        }
                        state.notLeaf = !state.isLeaf;
                        state.notRoot = !state.isRoot;
                    }
                    updateState();
                    var ret = cb.call(state, state.node);
                    if (ret !== undefined && state.update)
                        state.update(ret);
                    if (modifiers.before)
                        modifiers.before.call(state, state.node);
                    if (!keepGoing)
                        return state;
                    if (typeof state.node == 'object' && state.node !== null && !state.circular) {
                        parents.push(state);
                        updateState();
                        forEach(state.keys, function (key, i) {
                            path.push(key);
                            if (modifiers.pre)
                                modifiers.pre.call(state, state.node[key], key);
                            var child = walker(state.node[key]);
                            if (immutable && hasOwnProperty.call(state.node, key)) {
                                state.node[key] = child.node;
                            }
                            child.isLast = i == state.keys.length - 1;
                            child.isFirst = i == 0;
                            if (modifiers.post)
                                modifiers.post.call(state, child);
                            path.pop();
                        });
                        parents.pop();
                    }
                    if (modifiers.after)
                        modifiers.after.call(state, state.node);
                    return state;
                }(root).node;
            }
            function copy(src) {
                if (typeof src === 'object' && src !== null) {
                    var dst;
                    if (isArray(src)) {
                        dst = [];
                    } else if (isDate(src)) {
                        dst = new Date(src.getTime ? src.getTime() : src);
                    } else if (isRegExp(src)) {
                        dst = new RegExp(src);
                    } else if (isError(src)) {
                        dst = { message: src.message };
                    } else if (isBoolean(src)) {
                        dst = new Boolean(src);
                    } else if (isNumber(src)) {
                        dst = new Number(src);
                    } else if (isString(src)) {
                        dst = new String(src);
                    } else if (Object.create && Object.getPrototypeOf) {
                        dst = Object.create(Object.getPrototypeOf(src));
                    } else if (src.constructor === Object) {
                        dst = {};
                    } else {
                        var proto = src.constructor && src.constructor.prototype || src.__proto__ || {};
                        var T = function () {
                        };
                        T.prototype = proto;
                        dst = new T();
                    }
                    forEach(objectKeys(src), function (key) {
                        dst[key] = src[key];
                    });
                    return dst;
                } else
                    return src;
            }
            var objectKeys = Object.keys || function keys(obj) {
                var res = [];
                for (var key in obj)
                    res.push(key);
                return res;
            };
            function toS(obj) {
                return Object.prototype.toString.call(obj);
            }
            function isDate(obj) {
                return toS(obj) === '[object Date]';
            }
            function isRegExp(obj) {
                return toS(obj) === '[object RegExp]';
            }
            function isError(obj) {
                return toS(obj) === '[object Error]';
            }
            function isBoolean(obj) {
                return toS(obj) === '[object Boolean]';
            }
            function isNumber(obj) {
                return toS(obj) === '[object Number]';
            }
            function isString(obj) {
                return toS(obj) === '[object String]';
            }
            var isArray = Array.isArray || function isArray(xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };
            var forEach = function (xs, fn) {
                if (xs.forEach)
                    return xs.forEach(fn);
                else
                    for (var i = 0; i < xs.length; i++) {
                        fn(xs[i], i, xs);
                    }
            };
            forEach(objectKeys(Traverse.prototype), function (key) {
                traverse[key] = function (obj) {
                    var args = [].slice.call(arguments, 1);
                    var t = new Traverse(obj);
                    return t[key].apply(t, args);
                };
            });
            var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
                return key in obj;
            };
        },
        {}
    ],
    23: [
        function (require, module, exports) {
            (function (root, factory) {
                'use strict';
                if (typeof define === 'function' && define.amd) {
                    define(['exports'], factory);
                } else if (typeof exports !== 'undefined') {
                    factory(exports);
                } else {
                    factory(root.estraverse = {});
                }
            }(this, function (exports) {
                'use strict';
                var Syntax, isArray, VisitorOption, VisitorKeys, objectCreate, objectKeys, BREAK, SKIP, REMOVE;
                function ignoreJSHintError() {
                }
                isArray = Array.isArray;
                if (!isArray) {
                    isArray = function isArray(array) {
                        return Object.prototype.toString.call(array) === '[object Array]';
                    };
                }
                function deepCopy(obj) {
                    var ret = {}, key, val;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            val = obj[key];
                            if (typeof val === 'object' && val !== null) {
                                ret[key] = deepCopy(val);
                            } else {
                                ret[key] = val;
                            }
                        }
                    }
                    return ret;
                }
                function shallowCopy(obj) {
                    var ret = {}, key;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            ret[key] = obj[key];
                        }
                    }
                    return ret;
                }
                ignoreJSHintError(shallowCopy);
                function upperBound(array, func) {
                    var diff, len, i, current;
                    len = array.length;
                    i = 0;
                    while (len) {
                        diff = len >>> 1;
                        current = i + diff;
                        if (func(array[current])) {
                            len = diff;
                        } else {
                            i = current + 1;
                            len -= diff + 1;
                        }
                    }
                    return i;
                }
                function lowerBound(array, func) {
                    var diff, len, i, current;
                    len = array.length;
                    i = 0;
                    while (len) {
                        diff = len >>> 1;
                        current = i + diff;
                        if (func(array[current])) {
                            i = current + 1;
                            len -= diff + 1;
                        } else {
                            len = diff;
                        }
                    }
                    return i;
                }
                ignoreJSHintError(lowerBound);
                objectCreate = Object.create || function () {
                    function F() {
                    }
                    return function (o) {
                        F.prototype = o;
                        return new F();
                    };
                }();
                objectKeys = Object.keys || function (o) {
                    var keys = [], key;
                    for (key in o) {
                        keys.push(key);
                    }
                    return keys;
                };
                function extend(to, from) {
                    objectKeys(from).forEach(function (key) {
                        to[key] = from[key];
                    });
                    return to;
                }
                Syntax = {
                    AssignmentExpression: 'AssignmentExpression',
                    ArrayExpression: 'ArrayExpression',
                    ArrayPattern: 'ArrayPattern',
                    ArrowFunctionExpression: 'ArrowFunctionExpression',
                    BlockStatement: 'BlockStatement',
                    BinaryExpression: 'BinaryExpression',
                    BreakStatement: 'BreakStatement',
                    CallExpression: 'CallExpression',
                    CatchClause: 'CatchClause',
                    ClassBody: 'ClassBody',
                    ClassDeclaration: 'ClassDeclaration',
                    ClassExpression: 'ClassExpression',
                    ComprehensionBlock: 'ComprehensionBlock',
                    ComprehensionExpression: 'ComprehensionExpression',
                    ConditionalExpression: 'ConditionalExpression',
                    ContinueStatement: 'ContinueStatement',
                    DebuggerStatement: 'DebuggerStatement',
                    DirectiveStatement: 'DirectiveStatement',
                    DoWhileStatement: 'DoWhileStatement',
                    EmptyStatement: 'EmptyStatement',
                    ExportBatchSpecifier: 'ExportBatchSpecifier',
                    ExportDeclaration: 'ExportDeclaration',
                    ExportSpecifier: 'ExportSpecifier',
                    ExpressionStatement: 'ExpressionStatement',
                    ForStatement: 'ForStatement',
                    ForInStatement: 'ForInStatement',
                    ForOfStatement: 'ForOfStatement',
                    FunctionDeclaration: 'FunctionDeclaration',
                    FunctionExpression: 'FunctionExpression',
                    GeneratorExpression: 'GeneratorExpression',
                    Identifier: 'Identifier',
                    IfStatement: 'IfStatement',
                    ImportDeclaration: 'ImportDeclaration',
                    ImportDefaultSpecifier: 'ImportDefaultSpecifier',
                    ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
                    ImportSpecifier: 'ImportSpecifier',
                    Literal: 'Literal',
                    LabeledStatement: 'LabeledStatement',
                    LogicalExpression: 'LogicalExpression',
                    MemberExpression: 'MemberExpression',
                    MethodDefinition: 'MethodDefinition',
                    ModuleSpecifier: 'ModuleSpecifier',
                    NewExpression: 'NewExpression',
                    ObjectExpression: 'ObjectExpression',
                    ObjectPattern: 'ObjectPattern',
                    Program: 'Program',
                    Property: 'Property',
                    ReturnStatement: 'ReturnStatement',
                    SequenceExpression: 'SequenceExpression',
                    SpreadElement: 'SpreadElement',
                    SwitchStatement: 'SwitchStatement',
                    SwitchCase: 'SwitchCase',
                    TaggedTemplateExpression: 'TaggedTemplateExpression',
                    TemplateElement: 'TemplateElement',
                    TemplateLiteral: 'TemplateLiteral',
                    ThisExpression: 'ThisExpression',
                    ThrowStatement: 'ThrowStatement',
                    TryStatement: 'TryStatement',
                    UnaryExpression: 'UnaryExpression',
                    UpdateExpression: 'UpdateExpression',
                    VariableDeclaration: 'VariableDeclaration',
                    VariableDeclarator: 'VariableDeclarator',
                    WhileStatement: 'WhileStatement',
                    WithStatement: 'WithStatement',
                    YieldExpression: 'YieldExpression'
                };
                VisitorKeys = {
                    AssignmentExpression: [
                        'left',
                        'right'
                    ],
                    ArrayExpression: ['elements'],
                    ArrayPattern: ['elements'],
                    ArrowFunctionExpression: [
                        'params',
                        'defaults',
                        'rest',
                        'body'
                    ],
                    BlockStatement: ['body'],
                    BinaryExpression: [
                        'left',
                        'right'
                    ],
                    BreakStatement: ['label'],
                    CallExpression: [
                        'callee',
                        'arguments'
                    ],
                    CatchClause: [
                        'param',
                        'body'
                    ],
                    ClassBody: ['body'],
                    ClassDeclaration: [
                        'id',
                        'body',
                        'superClass'
                    ],
                    ClassExpression: [
                        'id',
                        'body',
                        'superClass'
                    ],
                    ComprehensionBlock: [
                        'left',
                        'right'
                    ],
                    ComprehensionExpression: [
                        'blocks',
                        'filter',
                        'body'
                    ],
                    ConditionalExpression: [
                        'test',
                        'consequent',
                        'alternate'
                    ],
                    ContinueStatement: ['label'],
                    DebuggerStatement: [],
                    DirectiveStatement: [],
                    DoWhileStatement: [
                        'body',
                        'test'
                    ],
                    EmptyStatement: [],
                    ExportBatchSpecifier: [],
                    ExportDeclaration: [
                        'declaration',
                        'specifiers',
                        'source'
                    ],
                    ExportSpecifier: [
                        'id',
                        'name'
                    ],
                    ExpressionStatement: ['expression'],
                    ForStatement: [
                        'init',
                        'test',
                        'update',
                        'body'
                    ],
                    ForInStatement: [
                        'left',
                        'right',
                        'body'
                    ],
                    ForOfStatement: [
                        'left',
                        'right',
                        'body'
                    ],
                    FunctionDeclaration: [
                        'id',
                        'params',
                        'defaults',
                        'rest',
                        'body'
                    ],
                    FunctionExpression: [
                        'id',
                        'params',
                        'defaults',
                        'rest',
                        'body'
                    ],
                    GeneratorExpression: [
                        'blocks',
                        'filter',
                        'body'
                    ],
                    Identifier: [],
                    IfStatement: [
                        'test',
                        'consequent',
                        'alternate'
                    ],
                    ImportDeclaration: [
                        'specifiers',
                        'source'
                    ],
                    ImportDefaultSpecifier: ['id'],
                    ImportNamespaceSpecifier: ['id'],
                    ImportSpecifier: [
                        'id',
                        'name'
                    ],
                    Literal: [],
                    LabeledStatement: [
                        'label',
                        'body'
                    ],
                    LogicalExpression: [
                        'left',
                        'right'
                    ],
                    MemberExpression: [
                        'object',
                        'property'
                    ],
                    MethodDefinition: [
                        'key',
                        'value'
                    ],
                    ModuleSpecifier: [],
                    NewExpression: [
                        'callee',
                        'arguments'
                    ],
                    ObjectExpression: ['properties'],
                    ObjectPattern: ['properties'],
                    Program: ['body'],
                    Property: [
                        'key',
                        'value'
                    ],
                    ReturnStatement: ['argument'],
                    SequenceExpression: ['expressions'],
                    SpreadElement: ['argument'],
                    SwitchStatement: [
                        'discriminant',
                        'cases'
                    ],
                    SwitchCase: [
                        'test',
                        'consequent'
                    ],
                    TaggedTemplateExpression: [
                        'tag',
                        'quasi'
                    ],
                    TemplateElement: [],
                    TemplateLiteral: [
                        'quasis',
                        'expressions'
                    ],
                    ThisExpression: [],
                    ThrowStatement: ['argument'],
                    TryStatement: [
                        'block',
                        'handlers',
                        'handler',
                        'guardedHandlers',
                        'finalizer'
                    ],
                    UnaryExpression: ['argument'],
                    UpdateExpression: ['argument'],
                    VariableDeclaration: ['declarations'],
                    VariableDeclarator: [
                        'id',
                        'init'
                    ],
                    WhileStatement: [
                        'test',
                        'body'
                    ],
                    WithStatement: [
                        'object',
                        'body'
                    ],
                    YieldExpression: ['argument']
                };
                BREAK = {};
                SKIP = {};
                REMOVE = {};
                VisitorOption = {
                    Break: BREAK,
                    Skip: SKIP,
                    Remove: REMOVE
                };
                function Reference(parent, key) {
                    this.parent = parent;
                    this.key = key;
                }
                Reference.prototype.replace = function replace(node) {
                    this.parent[this.key] = node;
                };
                Reference.prototype.remove = function remove() {
                    if (isArray(this.parent)) {
                        this.parent.splice(this.key, 1);
                        return true;
                    } else {
                        this.replace(null);
                        return false;
                    }
                };
                function Element(node, path, wrap, ref) {
                    this.node = node;
                    this.path = path;
                    this.wrap = wrap;
                    this.ref = ref;
                }
                function Controller() {
                }
                Controller.prototype.path = function path() {
                    var i, iz, j, jz, result, element;
                    function addToPath(result, path) {
                        if (isArray(path)) {
                            for (j = 0, jz = path.length; j < jz; ++j) {
                                result.push(path[j]);
                            }
                        } else {
                            result.push(path);
                        }
                    }
                    if (!this.__current.path) {
                        return null;
                    }
                    result = [];
                    for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
                        element = this.__leavelist[i];
                        addToPath(result, element.path);
                    }
                    addToPath(result, this.__current.path);
                    return result;
                };
                Controller.prototype.type = function () {
                    var node = this.current();
                    return node.type || this.__current.wrap;
                };
                Controller.prototype.parents = function parents() {
                    var i, iz, result;
                    result = [];
                    for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
                        result.push(this.__leavelist[i].node);
                    }
                    return result;
                };
                Controller.prototype.current = function current() {
                    return this.__current.node;
                };
                Controller.prototype.__execute = function __execute(callback, element) {
                    var previous, result;
                    result = undefined;
                    previous = this.__current;
                    this.__current = element;
                    this.__state = null;
                    if (callback) {
                        result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
                    }
                    this.__current = previous;
                    return result;
                };
                Controller.prototype.notify = function notify(flag) {
                    this.__state = flag;
                };
                Controller.prototype.skip = function () {
                    this.notify(SKIP);
                };
                Controller.prototype['break'] = function () {
                    this.notify(BREAK);
                };
                Controller.prototype.remove = function () {
                    this.notify(REMOVE);
                };
                Controller.prototype.__initialize = function (root, visitor) {
                    this.visitor = visitor;
                    this.root = root;
                    this.__worklist = [];
                    this.__leavelist = [];
                    this.__current = null;
                    this.__state = null;
                    this.__fallback = visitor.fallback === 'iteration';
                    this.__keys = VisitorKeys;
                    if (visitor.keys) {
                        this.__keys = extend(objectCreate(this.__keys), visitor.keys);
                    }
                };
                function isNode(node) {
                    if (node == null) {
                        return false;
                    }
                    return typeof node === 'object' && typeof node.type === 'string';
                }
                function isProperty(nodeType, key) {
                    return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
                }
                Controller.prototype.traverse = function traverse(root, visitor) {
                    var worklist, leavelist, element, node, nodeType, ret, key, current, current2, candidates, candidate, sentinel;
                    this.__initialize(root, visitor);
                    sentinel = {};
                    worklist = this.__worklist;
                    leavelist = this.__leavelist;
                    worklist.push(new Element(root, null, null, null));
                    leavelist.push(new Element(null, null, null, null));
                    while (worklist.length) {
                        element = worklist.pop();
                        if (element === sentinel) {
                            element = leavelist.pop();
                            ret = this.__execute(visitor.leave, element);
                            if (this.__state === BREAK || ret === BREAK) {
                                return;
                            }
                            continue;
                        }
                        if (element.node) {
                            ret = this.__execute(visitor.enter, element);
                            if (this.__state === BREAK || ret === BREAK) {
                                return;
                            }
                            worklist.push(sentinel);
                            leavelist.push(element);
                            if (this.__state === SKIP || ret === SKIP) {
                                continue;
                            }
                            node = element.node;
                            nodeType = element.wrap || node.type;
                            candidates = this.__keys[nodeType];
                            if (!candidates) {
                                if (this.__fallback) {
                                    candidates = objectKeys(node);
                                } else {
                                    throw new Error('Unknown node type ' + nodeType + '.');
                                }
                            }
                            current = candidates.length;
                            while ((current -= 1) >= 0) {
                                key = candidates[current];
                                candidate = node[key];
                                if (!candidate) {
                                    continue;
                                }
                                if (isArray(candidate)) {
                                    current2 = candidate.length;
                                    while ((current2 -= 1) >= 0) {
                                        if (!candidate[current2]) {
                                            continue;
                                        }
                                        if (isProperty(nodeType, candidates[current])) {
                                            element = new Element(candidate[current2], [
                                                key,
                                                current2
                                            ], 'Property', null);
                                        } else if (isNode(candidate[current2])) {
                                            element = new Element(candidate[current2], [
                                                key,
                                                current2
                                            ], null, null);
                                        } else {
                                            continue;
                                        }
                                        worklist.push(element);
                                    }
                                } else if (isNode(candidate)) {
                                    worklist.push(new Element(candidate, key, null, null));
                                }
                            }
                        }
                    }
                };
                Controller.prototype.replace = function replace(root, visitor) {
                    function removeElem(element) {
                        var i, key, nextElem, parent;
                        if (element.ref.remove()) {
                            key = element.ref.key;
                            parent = element.ref.parent;
                            i = worklist.length;
                            while (i--) {
                                nextElem = worklist[i];
                                if (nextElem.ref && nextElem.ref.parent === parent) {
                                    if (nextElem.ref.key < key) {
                                        break;
                                    }
                                    --nextElem.ref.key;
                                }
                            }
                        }
                    }
                    var worklist, leavelist, node, nodeType, target, element, current, current2, candidates, candidate, sentinel, outer, key;
                    this.__initialize(root, visitor);
                    sentinel = {};
                    worklist = this.__worklist;
                    leavelist = this.__leavelist;
                    outer = { root: root };
                    element = new Element(root, null, null, new Reference(outer, 'root'));
                    worklist.push(element);
                    leavelist.push(element);
                    while (worklist.length) {
                        element = worklist.pop();
                        if (element === sentinel) {
                            element = leavelist.pop();
                            target = this.__execute(visitor.leave, element);
                            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                                element.ref.replace(target);
                            }
                            if (this.__state === REMOVE || target === REMOVE) {
                                removeElem(element);
                            }
                            if (this.__state === BREAK || target === BREAK) {
                                return outer.root;
                            }
                            continue;
                        }
                        target = this.__execute(visitor.enter, element);
                        if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                            element.ref.replace(target);
                            element.node = target;
                        }
                        if (this.__state === REMOVE || target === REMOVE) {
                            removeElem(element);
                            element.node = null;
                        }
                        if (this.__state === BREAK || target === BREAK) {
                            return outer.root;
                        }
                        node = element.node;
                        if (!node) {
                            continue;
                        }
                        worklist.push(sentinel);
                        leavelist.push(element);
                        if (this.__state === SKIP || target === SKIP) {
                            continue;
                        }
                        nodeType = element.wrap || node.type;
                        candidates = this.__keys[nodeType];
                        if (!candidates) {
                            if (this.__fallback) {
                                candidates = objectKeys(node);
                            } else {
                                throw new Error('Unknown node type ' + nodeType + '.');
                            }
                        }
                        current = candidates.length;
                        while ((current -= 1) >= 0) {
                            key = candidates[current];
                            candidate = node[key];
                            if (!candidate) {
                                continue;
                            }
                            if (isArray(candidate)) {
                                current2 = candidate.length;
                                while ((current2 -= 1) >= 0) {
                                    if (!candidate[current2]) {
                                        continue;
                                    }
                                    if (isProperty(nodeType, candidates[current])) {
                                        element = new Element(candidate[current2], [
                                            key,
                                            current2
                                        ], 'Property', new Reference(candidate, current2));
                                    } else if (isNode(candidate[current2])) {
                                        element = new Element(candidate[current2], [
                                            key,
                                            current2
                                        ], null, new Reference(candidate, current2));
                                    } else {
                                        continue;
                                    }
                                    worklist.push(element);
                                }
                            } else if (isNode(candidate)) {
                                worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                            }
                        }
                    }
                    return outer.root;
                };
                function traverse(root, visitor) {
                    var controller = new Controller();
                    return controller.traverse(root, visitor);
                }
                function replace(root, visitor) {
                    var controller = new Controller();
                    return controller.replace(root, visitor);
                }
                function extendCommentRange(comment, tokens) {
                    var target;
                    target = upperBound(tokens, function search(token) {
                        return token.range[0] > comment.range[0];
                    });
                    comment.extendedRange = [
                        comment.range[0],
                        comment.range[1]
                    ];
                    if (target !== tokens.length) {
                        comment.extendedRange[1] = tokens[target].range[0];
                    }
                    target -= 1;
                    if (target >= 0) {
                        comment.extendedRange[0] = tokens[target].range[1];
                    }
                    return comment;
                }
                function attachComments(tree, providedComments, tokens) {
                    var comments = [], comment, len, i, cursor;
                    if (!tree.range) {
                        throw new Error('attachComments needs range information');
                    }
                    if (!tokens.length) {
                        if (providedComments.length) {
                            for (i = 0, len = providedComments.length; i < len; i += 1) {
                                comment = deepCopy(providedComments[i]);
                                comment.extendedRange = [
                                    0,
                                    tree.range[0]
                                ];
                                comments.push(comment);
                            }
                            tree.leadingComments = comments;
                        }
                        return tree;
                    }
                    for (i = 0, len = providedComments.length; i < len; i += 1) {
                        comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
                    }
                    cursor = 0;
                    traverse(tree, {
                        enter: function (node) {
                            var comment;
                            while (cursor < comments.length) {
                                comment = comments[cursor];
                                if (comment.extendedRange[1] > node.range[0]) {
                                    break;
                                }
                                if (comment.extendedRange[1] === node.range[0]) {
                                    if (!node.leadingComments) {
                                        node.leadingComments = [];
                                    }
                                    node.leadingComments.push(comment);
                                    comments.splice(cursor, 1);
                                } else {
                                    cursor += 1;
                                }
                            }
                            if (cursor === comments.length) {
                                return VisitorOption.Break;
                            }
                            if (comments[cursor].extendedRange[0] > node.range[1]) {
                                return VisitorOption.Skip;
                            }
                        }
                    });
                    cursor = 0;
                    traverse(tree, {
                        leave: function (node) {
                            var comment;
                            while (cursor < comments.length) {
                                comment = comments[cursor];
                                if (node.range[1] < comment.extendedRange[0]) {
                                    break;
                                }
                                if (node.range[1] === comment.extendedRange[0]) {
                                    if (!node.trailingComments) {
                                        node.trailingComments = [];
                                    }
                                    node.trailingComments.push(comment);
                                    comments.splice(cursor, 1);
                                } else {
                                    cursor += 1;
                                }
                            }
                            if (cursor === comments.length) {
                                return VisitorOption.Break;
                            }
                            if (comments[cursor].extendedRange[0] > node.range[1]) {
                                return VisitorOption.Skip;
                            }
                        }
                    });
                    return tree;
                }
                exports.version = '1.8.0';
                exports.Syntax = Syntax;
                exports.traverse = traverse;
                exports.replace = replace;
                exports.attachComments = attachComments;
                exports.VisitorKeys = VisitorKeys;
                exports.VisitorOption = VisitorOption;
                exports.Controller = Controller;
            }));
        },
        {}
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./lib/create');
        },
        { './lib/create': 29 }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            function AssertionRenderer(traversal, config) {
                var assertionLine;
                traversal.on('start', function (context) {
                    assertionLine = context.source.content;
                });
                traversal.on('render', function (writer) {
                    writer.write('');
                    writer.write(assertionLine);
                });
            }
            module.exports = AssertionRenderer;
        },
        {}
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            var typeName = require('type-name'), keys = Object.keys || require('object-keys'), syntax = require('estraverse').Syntax;
            function BinaryExpressionRenderer(traversal, config) {
                this.config = config;
                this.stringify = config.stringify;
                this.diff = config.diff;
                this.espathToPair = {};
                var _this = this;
                traversal.on('esnode', function (esNode) {
                    var pair;
                    if (!esNode.isCaptured()) {
                        if (isTargetBinaryExpression(esNode.getParent()) && esNode.currentNode.type === syntax.Literal) {
                            _this.espathToPair[esNode.parentEspath][esNode.currentProp] = {
                                code: esNode.code(),
                                value: esNode.value()
                            };
                        }
                        return;
                    }
                    if (isTargetBinaryExpression(esNode.getParent())) {
                        _this.espathToPair[esNode.parentEspath][esNode.currentProp] = {
                            code: esNode.code(),
                            value: esNode.value()
                        };
                    }
                    if (isTargetBinaryExpression(esNode)) {
                        pair = {
                            operator: esNode.currentNode.operator,
                            value: esNode.value()
                        };
                        _this.espathToPair[esNode.espath] = pair;
                    }
                });
                traversal.on('render', function (writer) {
                    var pairs = [];
                    keys(_this.espathToPair).forEach(function (espath) {
                        var pair = _this.espathToPair[espath];
                        if (pair.left && pair.right) {
                            pairs.push(pair);
                        }
                    });
                    pairs.forEach(function (pair) {
                        _this.compare(pair, writer);
                    });
                });
            }
            BinaryExpressionRenderer.prototype.compare = function (pair, writer) {
                if (isStringDiffTarget(pair)) {
                    this.showStringDiff(pair, writer);
                } else {
                    this.showExpectedAndActual(pair, writer);
                }
            };
            BinaryExpressionRenderer.prototype.showExpectedAndActual = function (pair, writer) {
                writer.write('');
                writer.write('[' + typeName(pair.right.value) + '] ' + pair.right.code);
                writer.write('=> ' + this.stringify(pair.right.value));
                writer.write('[' + typeName(pair.left.value) + '] ' + pair.left.code);
                writer.write('=> ' + this.stringify(pair.left.value));
            };
            BinaryExpressionRenderer.prototype.showStringDiff = function (pair, writer) {
                writer.write('');
                writer.write('--- [string] ' + pair.right.code);
                writer.write('+++ [string] ' + pair.left.code);
                writer.write(this.diff(pair.right.value, pair.left.value, this.config));
            };
            function isTargetBinaryExpression(esNode) {
                return esNode && esNode.currentNode.type === syntax.BinaryExpression && (esNode.currentNode.operator === '===' || esNode.currentNode.operator === '==') && esNode.isCaptured() && !esNode.value();
            }
            function isStringDiffTarget(pair) {
                return typeof pair.left.value === 'string' && typeof pair.right.value === 'string';
            }
            module.exports = BinaryExpressionRenderer;
        },
        {
            'estraverse': 39,
            'object-keys': 42,
            'type-name': 47
        }
    ],
    27: [
        function (require, module, exports) {
            'use strict';
            function DiagramRenderer(traversal, config) {
                this.config = config;
                this.events = [];
                this.stringify = config.stringify;
                this.widthOf = config.widthOf;
                this.initialVertivalBarLength = 1;
                var _this = this;
                traversal.on('start', function (context) {
                    _this.context = context;
                    _this.assertionLine = context.source.content;
                    _this.initializeRows();
                });
                traversal.on('esnode', function (esNode) {
                    if (!esNode.isCaptured()) {
                        return;
                    }
                    _this.events.push({
                        value: esNode.value(),
                        loc: esNode.location()
                    });
                });
                traversal.on('render', function (writer) {
                    _this.events.sort(rightToLeft);
                    _this.constructRows(_this.events);
                    _this.rows.forEach(function (columns) {
                        writer.write(columns.join(''));
                    });
                });
            }
            DiagramRenderer.prototype.initializeRows = function () {
                this.rows = [];
                for (var i = 0; i <= this.initialVertivalBarLength; i += 1) {
                    this.addOneMoreRow();
                }
            };
            DiagramRenderer.prototype.newRowFor = function (assertionLine) {
                return createRow(this.widthOf(assertionLine), ' ');
            };
            DiagramRenderer.prototype.addOneMoreRow = function () {
                this.rows.push(this.newRowFor(this.assertionLine));
            };
            DiagramRenderer.prototype.lastRow = function () {
                return this.rows[this.rows.length - 1];
            };
            DiagramRenderer.prototype.renderVerticalBarAt = function (columnIndex) {
                var i, lastRowIndex = this.rows.length - 1;
                for (i = 0; i < lastRowIndex; i += 1) {
                    this.rows[i].splice(columnIndex, 1, '|');
                }
            };
            DiagramRenderer.prototype.renderValueAt = function (columnIndex, dumpedValue) {
                var i, width = this.widthOf(dumpedValue);
                for (i = 0; i < width; i += 1) {
                    this.lastRow().splice(columnIndex + i, 1, dumpedValue.charAt(i));
                }
            };
            DiagramRenderer.prototype.isOverlapped = function (prevCapturing, nextCaputuring, dumpedValue) {
                return typeof prevCapturing !== 'undefined' && this.startColumnFor(prevCapturing) <= this.startColumnFor(nextCaputuring) + this.widthOf(dumpedValue);
            };
            DiagramRenderer.prototype.constructRows = function (capturedEvents) {
                var that = this, prevCaptured;
                capturedEvents.forEach(function (captured) {
                    var dumpedValue = that.stringify(captured.value);
                    if (that.isOverlapped(prevCaptured, captured, dumpedValue)) {
                        that.addOneMoreRow();
                    }
                    that.renderVerticalBarAt(that.startColumnFor(captured));
                    that.renderValueAt(that.startColumnFor(captured), dumpedValue);
                    prevCaptured = captured;
                });
            };
            DiagramRenderer.prototype.startColumnFor = function (captured) {
                return this.widthOf(this.assertionLine.slice(0, captured.loc.start.column));
            };
            function createRow(numCols, initial) {
                var row = [], i;
                for (i = 0; i < numCols; i += 1) {
                    row[i] = initial;
                }
                return row;
            }
            function rightToLeft(a, b) {
                return b.loc.start.column - a.loc.start.column;
            }
            module.exports = DiagramRenderer;
        },
        {}
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            function FileRenderer(traversal, config) {
                var filepath, lineNumber;
                traversal.on('start', function (context) {
                    filepath = context.source.filepath;
                    lineNumber = context.source.line;
                });
                traversal.on('render', function (writer) {
                    if (filepath) {
                        writer.write('# ' + [
                            filepath,
                            lineNumber
                        ].join(':'));
                    } else {
                        writer.write('# at line: ' + lineNumber);
                    }
                });
            }
            module.exports = FileRenderer;
        },
        {}
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            var stringifier = require('stringifier'), stringWidth = require('./string-width'), StringWriter = require('./string-writer'), ContextTraversal = require('./traverse'), udiff = require('./udiff'), defaultOptions = require('./default-options'), typeName = require('type-name'), extend = require('xtend');
            (function () {
                require('./built-in/assertion');
                require('./built-in/binary-expression');
                require('./built-in/diagram');
                require('./built-in/file');
            }());
            function create(options) {
                var config = extend(defaultOptions(), options);
                if (typeof config.widthOf !== 'function') {
                    config.widthOf = stringWidth(extend(config));
                }
                if (typeof config.stringify !== 'function') {
                    config.stringify = stringifier(extend(config));
                }
                if (typeof config.diff !== 'function') {
                    config.diff = udiff(extend(config));
                }
                if (!config.writerClass) {
                    config.writerClass = StringWriter;
                }
                return function (context) {
                    var traversal = new ContextTraversal(context);
                    var writer = new config.writerClass(extend(config));
                    var renderers = config.renderers.map(function (rendererName) {
                        var RendererClass;
                        if (typeName(rendererName) === 'function') {
                            RendererClass = rendererName;
                        } else if (typeName(rendererName) === 'string') {
                            RendererClass = require(rendererName);
                        }
                        return new RendererClass(traversal, extend(config));
                    });
                    traversal.emit('start', context);
                    traversal.traverse();
                    traversal.emit('render', writer);
                    writer.write('');
                    renderers.length = 0;
                    return writer.flush();
                };
            }
            create.defaultOptions = defaultOptions;
            create.stringWidth = stringWidth;
            module.exports = create;
        },
        {
            './built-in/assertion': 25,
            './built-in/binary-expression': 26,
            './built-in/diagram': 27,
            './built-in/file': 28,
            './default-options': 30,
            './string-width': 33,
            './string-writer': 34,
            './traverse': 35,
            './udiff': 36,
            'stringifier': 44,
            'type-name': 47,
            'xtend': 48
        }
    ],
    30: [
        function (require, module, exports) {
            module.exports = function defaultOptions() {
                'use strict';
                return {
                    lineDiffThreshold: 5,
                    maxDepth: 1,
                    outputOffset: 2,
                    anonymous: 'Object',
                    circular: '#@Circular#',
                    lineSeparator: '\n',
                    ambiguousEastAsianCharWidth: 2,
                    renderers: [
                        './built-in/file',
                        './built-in/assertion',
                        './built-in/diagram',
                        './built-in/binary-expression'
                    ]
                };
            };
        },
        {}
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            var syntax = require('estraverse').Syntax, locationOf = require('./location');
            function EsNode(path, currentNode, parentNode, espathToValue, jsCode, jsAST) {
                if (path) {
                    this.espath = path.join('/');
                    this.parentEspath = path.slice(0, path.length - 1).join('/');
                    this.currentProp = path[path.length - 1];
                } else {
                    this.espath = '';
                    this.parentEspath = '';
                    this.currentProp = null;
                }
                this.currentNode = currentNode;
                this.parentNode = parentNode;
                this.parentEsNode = null;
                this.espathToValue = espathToValue;
                this.jsCode = jsCode;
                this.jsAST = jsAST;
            }
            EsNode.prototype.setParent = function (parentEsNode) {
                this.parentEsNode = parentEsNode;
            };
            EsNode.prototype.getParent = function () {
                return this.parentEsNode;
            };
            EsNode.prototype.code = function () {
                return this.jsCode.slice(this.currentNode.loc.start.column, this.currentNode.loc.end.column);
            };
            EsNode.prototype.value = function () {
                if (this.currentNode.type === syntax.Literal) {
                    return this.currentNode.value;
                }
                return this.espathToValue[this.espath];
            };
            EsNode.prototype.isCaptured = function () {
                return this.espathToValue.hasOwnProperty(this.espath);
            };
            EsNode.prototype.location = function () {
                return locationOf(this.currentNode, this.jsAST.tokens);
            };
            module.exports = EsNode;
        },
        {
            './location': 32,
            'estraverse': 39
        }
    ],
    32: [
        function (require, module, exports) {
            'use strict';
            var syntax = require('estraverse').Syntax;
            function locationOf(currentNode, tokens) {
                switch (currentNode.type) {
                case syntax.MemberExpression:
                    return propertyLocationOf(currentNode, tokens);
                case syntax.CallExpression:
                    if (currentNode.callee.type === syntax.MemberExpression) {
                        return propertyLocationOf(currentNode.callee, tokens);
                    }
                    break;
                case syntax.BinaryExpression:
                case syntax.LogicalExpression:
                case syntax.AssignmentExpression:
                    return infixOperatorLocationOf(currentNode, tokens);
                default:
                    break;
                }
                return currentNode.loc;
            }
            function propertyLocationOf(memberExpression, tokens) {
                var prop = memberExpression.property, token;
                if (!memberExpression.computed) {
                    return prop.loc;
                }
                token = findLeftBracketTokenOf(memberExpression, tokens);
                return token ? token.loc : prop.loc;
            }
            function infixOperatorLocationOf(expression, tokens) {
                var token = findOperatorTokenOf(expression, tokens);
                return token ? token.loc : expression.left.loc;
            }
            function findLeftBracketTokenOf(expression, tokens) {
                var fromLine = expression.loc.start.line, toLine = expression.property.loc.start.line, fromColumn = expression.property.loc.start.column;
                return searchToken(tokens, fromLine, toLine, function (token, index) {
                    var prevToken;
                    if (token.loc.start.column === fromColumn) {
                        prevToken = tokens[index - 1];
                        if (prevToken.type === 'Punctuator' && prevToken.value === '[') {
                            return prevToken;
                        }
                    }
                    return undefined;
                });
            }
            function findOperatorTokenOf(expression, tokens) {
                var fromLine = expression.left.loc.end.line, toLine = expression.right.loc.start.line, fromColumn = expression.left.loc.end.column, toColumn = expression.right.loc.start.column;
                return searchToken(tokens, fromLine, toLine, function (token, index) {
                    if (fromColumn < token.loc.start.column && token.loc.end.column < toColumn && token.type === 'Punctuator' && token.value === expression.operator) {
                        return token;
                    }
                    return undefined;
                });
            }
            function searchToken(tokens, fromLine, toLine, predicate) {
                var i, token, found;
                for (i = 0; i < tokens.length; i += 1) {
                    token = tokens[i];
                    if (token.loc.start.line < fromLine) {
                        continue;
                    }
                    if (toLine < token.loc.end.line) {
                        break;
                    }
                    found = predicate(token, i);
                    if (found) {
                        return found;
                    }
                }
                return undefined;
            }
            module.exports = locationOf;
        },
        { 'estraverse': 39 }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            var eaw = require('eastasianwidth');
            function stringWidth(config) {
                var ambiguousCharWidth = config && config.ambiguousEastAsianCharWidth || 1;
                return function widthOf(str) {
                    var i, code, width = 0;
                    for (i = 0; i < str.length; i += 1) {
                        code = eaw.eastAsianWidth(str.charAt(i));
                        switch (code) {
                        case 'F':
                        case 'W':
                            width += 2;
                            break;
                        case 'H':
                        case 'Na':
                        case 'N':
                            width += 1;
                            break;
                        case 'A':
                            width += ambiguousCharWidth;
                            break;
                        }
                    }
                    return width;
                };
            }
            module.exports = stringWidth;
        },
        { 'eastasianwidth': 37 }
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            function spacerStr(len) {
                var str = '';
                for (var i = 0; i < len; i += 1) {
                    str += ' ';
                }
                return str;
            }
            function StringWriter(config) {
                this.lines = [];
                this.lineSeparator = config.lineSeparator;
                this.regex = new RegExp(this.lineSeparator, 'g');
                this.spacer = spacerStr(config.outputOffset);
            }
            StringWriter.prototype.write = function (str) {
                this.lines.push(this.spacer + str.replace(this.regex, this.lineSeparator + this.spacer));
            };
            StringWriter.prototype.flush = function () {
                var str = this.lines.join(this.lineSeparator);
                this.lines.length = 0;
                return str;
            };
            module.exports = StringWriter;
        },
        {}
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            var estraverse = require('estraverse'), esprima = require('esprima'), EventEmitter = require('events').EventEmitter, inherits = require('util').inherits, EsNode = require('./esnode');
            function ContextTraversal(context) {
                this.context = context;
                EventEmitter.call(this);
            }
            inherits(ContextTraversal, EventEmitter);
            ContextTraversal.prototype.traverse = function () {
                var _this = this;
                this.context.args.forEach(function (arg) {
                    onEachEsNode(arg, _this.context.source.content, function (esNode) {
                        _this.emit('esnode', esNode);
                    });
                });
            };
            function onEachEsNode(arg, jsCode, callback) {
                var jsAST = esprima.parse(jsCode, {
                        tolerant: true,
                        loc: true,
                        tokens: true,
                        raw: true
                    }), espathToValue = arg.events.reduce(function (accum, ev) {
                        accum[ev.espath] = ev.value;
                        return accum;
                    }, {}), nodeStack = [];
                estraverse.traverse(extractExpressionFrom(jsAST), {
                    enter: function (currentNode, parentNode) {
                        var esNode = new EsNode(this.path(), currentNode, parentNode, espathToValue, jsCode, jsAST);
                        if (1 < nodeStack.length) {
                            esNode.setParent(nodeStack[nodeStack.length - 1]);
                        }
                        nodeStack.push(esNode);
                        callback(esNode);
                    },
                    leave: function (currentNode, parentNode) {
                        nodeStack.pop();
                    }
                });
            }
            function extractExpressionFrom(tree) {
                var expressionStatement = tree.body[0], expression = expressionStatement.expression;
                return expression;
            }
            module.exports = ContextTraversal;
        },
        {
            './esnode': 31,
            'esprima': 38,
            'estraverse': 39,
            'events': 2,
            'util': 6
        }
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            var DiffMatchPatch = require('googlediff'), dmp = new DiffMatchPatch();
            function udiff(config) {
                return function diff(text1, text2) {
                    var patch;
                    if (config && shouldUseLineLevelDiff(text1, config)) {
                        patch = udiffLines(text1, text2);
                    } else {
                        patch = udiffChars(text1, text2);
                    }
                    return decodeURIComponent(patch);
                };
            }
            function shouldUseLineLevelDiff(text, config) {
                return config.lineDiffThreshold < text.split(/\r\n|\r|\n/).length;
            }
            function udiffLines(text1, text2) {
                var a = dmp.diff_linesToChars_(text1, text2), diffs = dmp.diff_main(a.chars1, a.chars2, false);
                dmp.diff_charsToLines_(diffs, a.lineArray);
                dmp.diff_cleanupSemantic(diffs);
                return dmp.patch_toText(dmp.patch_make(text1, diffs));
            }
            function udiffChars(text1, text2) {
                var diffs = dmp.diff_main(text1, text2, false);
                dmp.diff_cleanupSemantic(diffs);
                return dmp.patch_toText(dmp.patch_make(text1, diffs));
            }
            module.exports = udiff;
        },
        { 'googlediff': 40 }
    ],
    37: [
        function (require, module, exports) {
            var eaw = exports;
            eaw.eastAsianWidth = function (character) {
                var x = character.charCodeAt(0);
                var y = character.length == 2 ? character.charCodeAt(1) : 0;
                var codePoint = x;
                if (55296 <= x && x <= 56319 && (56320 <= y && y <= 57343)) {
                    x &= 1023;
                    y &= 1023;
                    codePoint = x << 10 | y;
                    codePoint += 65536;
                }
                if (12288 == codePoint || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510) {
                    return 'F';
                }
                if (8361 == codePoint || 65377 <= codePoint && codePoint <= 65470 || 65474 <= codePoint && codePoint <= 65479 || 65482 <= codePoint && codePoint <= 65487 || 65490 <= codePoint && codePoint <= 65495 || 65498 <= codePoint && codePoint <= 65500 || 65512 <= codePoint && codePoint <= 65518) {
                    return 'H';
                }
                if (4352 <= codePoint && codePoint <= 4447 || 4515 <= codePoint && codePoint <= 4519 || 4602 <= codePoint && codePoint <= 4607 || 9001 <= codePoint && codePoint <= 9002 || 11904 <= codePoint && codePoint <= 11929 || 11931 <= codePoint && codePoint <= 12019 || 12032 <= codePoint && codePoint <= 12245 || 12272 <= codePoint && codePoint <= 12283 || 12289 <= codePoint && codePoint <= 12350 || 12353 <= codePoint && codePoint <= 12438 || 12441 <= codePoint && codePoint <= 12543 || 12549 <= codePoint && codePoint <= 12589 || 12593 <= codePoint && codePoint <= 12686 || 12688 <= codePoint && codePoint <= 12730 || 12736 <= codePoint && codePoint <= 12771 || 12784 <= codePoint && codePoint <= 12830 || 12832 <= codePoint && codePoint <= 12871 || 12880 <= codePoint && codePoint <= 13054 || 13056 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42124 || 42128 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 55216 <= codePoint && codePoint <= 55238 || 55243 <= codePoint && codePoint <= 55291 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65106 || 65108 <= codePoint && codePoint <= 65126 || 65128 <= codePoint && codePoint <= 65131 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127490 || 127504 <= codePoint && codePoint <= 127546 || 127552 <= codePoint && codePoint <= 127560 || 127568 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 194367 || 177984 <= codePoint && codePoint <= 196605 || 196608 <= codePoint && codePoint <= 262141) {
                    return 'W';
                }
                if (32 <= codePoint && codePoint <= 126 || 162 <= codePoint && codePoint <= 163 || 165 <= codePoint && codePoint <= 166 || 172 == codePoint || 175 == codePoint || 10214 <= codePoint && codePoint <= 10221 || 10629 <= codePoint && codePoint <= 10630) {
                    return 'Na';
                }
                if (161 == codePoint || 164 == codePoint || 167 <= codePoint && codePoint <= 168 || 170 == codePoint || 173 <= codePoint && codePoint <= 174 || 176 <= codePoint && codePoint <= 180 || 182 <= codePoint && codePoint <= 186 || 188 <= codePoint && codePoint <= 191 || 198 == codePoint || 208 == codePoint || 215 <= codePoint && codePoint <= 216 || 222 <= codePoint && codePoint <= 225 || 230 == codePoint || 232 <= codePoint && codePoint <= 234 || 236 <= codePoint && codePoint <= 237 || 240 == codePoint || 242 <= codePoint && codePoint <= 243 || 247 <= codePoint && codePoint <= 250 || 252 == codePoint || 254 == codePoint || 257 == codePoint || 273 == codePoint || 275 == codePoint || 283 == codePoint || 294 <= codePoint && codePoint <= 295 || 299 == codePoint || 305 <= codePoint && codePoint <= 307 || 312 == codePoint || 319 <= codePoint && codePoint <= 322 || 324 == codePoint || 328 <= codePoint && codePoint <= 331 || 333 == codePoint || 338 <= codePoint && codePoint <= 339 || 358 <= codePoint && codePoint <= 359 || 363 == codePoint || 462 == codePoint || 464 == codePoint || 466 == codePoint || 468 == codePoint || 470 == codePoint || 472 == codePoint || 474 == codePoint || 476 == codePoint || 593 == codePoint || 609 == codePoint || 708 == codePoint || 711 == codePoint || 713 <= codePoint && codePoint <= 715 || 717 == codePoint || 720 == codePoint || 728 <= codePoint && codePoint <= 731 || 733 == codePoint || 735 == codePoint || 768 <= codePoint && codePoint <= 879 || 913 <= codePoint && codePoint <= 929 || 931 <= codePoint && codePoint <= 937 || 945 <= codePoint && codePoint <= 961 || 963 <= codePoint && codePoint <= 969 || 1025 == codePoint || 1040 <= codePoint && codePoint <= 1103 || 1105 == codePoint || 8208 == codePoint || 8211 <= codePoint && codePoint <= 8214 || 8216 <= codePoint && codePoint <= 8217 || 8220 <= codePoint && codePoint <= 8221 || 8224 <= codePoint && codePoint <= 8226 || 8228 <= codePoint && codePoint <= 8231 || 8240 == codePoint || 8242 <= codePoint && codePoint <= 8243 || 8245 == codePoint || 8251 == codePoint || 8254 == codePoint || 8308 == codePoint || 8319 == codePoint || 8321 <= codePoint && codePoint <= 8324 || 8364 == codePoint || 8451 == codePoint || 8453 == codePoint || 8457 == codePoint || 8467 == codePoint || 8470 == codePoint || 8481 <= codePoint && codePoint <= 8482 || 8486 == codePoint || 8491 == codePoint || 8531 <= codePoint && codePoint <= 8532 || 8539 <= codePoint && codePoint <= 8542 || 8544 <= codePoint && codePoint <= 8555 || 8560 <= codePoint && codePoint <= 8569 || 8585 == codePoint || 8592 <= codePoint && codePoint <= 8601 || 8632 <= codePoint && codePoint <= 8633 || 8658 == codePoint || 8660 == codePoint || 8679 == codePoint || 8704 == codePoint || 8706 <= codePoint && codePoint <= 8707 || 8711 <= codePoint && codePoint <= 8712 || 8715 == codePoint || 8719 == codePoint || 8721 == codePoint || 8725 == codePoint || 8730 == codePoint || 8733 <= codePoint && codePoint <= 8736 || 8739 == codePoint || 8741 == codePoint || 8743 <= codePoint && codePoint <= 8748 || 8750 == codePoint || 8756 <= codePoint && codePoint <= 8759 || 8764 <= codePoint && codePoint <= 8765 || 8776 == codePoint || 8780 == codePoint || 8786 == codePoint || 8800 <= codePoint && codePoint <= 8801 || 8804 <= codePoint && codePoint <= 8807 || 8810 <= codePoint && codePoint <= 8811 || 8814 <= codePoint && codePoint <= 8815 || 8834 <= codePoint && codePoint <= 8835 || 8838 <= codePoint && codePoint <= 8839 || 8853 == codePoint || 8857 == codePoint || 8869 == codePoint || 8895 == codePoint || 8978 == codePoint || 9312 <= codePoint && codePoint <= 9449 || 9451 <= codePoint && codePoint <= 9547 || 9552 <= codePoint && codePoint <= 9587 || 9600 <= codePoint && codePoint <= 9615 || 9618 <= codePoint && codePoint <= 9621 || 9632 <= codePoint && codePoint <= 9633 || 9635 <= codePoint && codePoint <= 9641 || 9650 <= codePoint && codePoint <= 9651 || 9654 <= codePoint && codePoint <= 9655 || 9660 <= codePoint && codePoint <= 9661 || 9664 <= codePoint && codePoint <= 9665 || 9670 <= codePoint && codePoint <= 9672 || 9675 == codePoint || 9678 <= codePoint && codePoint <= 9681 || 9698 <= codePoint && codePoint <= 9701 || 9711 == codePoint || 9733 <= codePoint && codePoint <= 9734 || 9737 == codePoint || 9742 <= codePoint && codePoint <= 9743 || 9748 <= codePoint && codePoint <= 9749 || 9756 == codePoint || 9758 == codePoint || 9792 == codePoint || 9794 == codePoint || 9824 <= codePoint && codePoint <= 9825 || 9827 <= codePoint && codePoint <= 9829 || 9831 <= codePoint && codePoint <= 9834 || 9836 <= codePoint && codePoint <= 9837 || 9839 == codePoint || 9886 <= codePoint && codePoint <= 9887 || 9918 <= codePoint && codePoint <= 9919 || 9924 <= codePoint && codePoint <= 9933 || 9935 <= codePoint && codePoint <= 9953 || 9955 == codePoint || 9960 <= codePoint && codePoint <= 9983 || 10045 == codePoint || 10071 == codePoint || 10102 <= codePoint && codePoint <= 10111 || 11093 <= codePoint && codePoint <= 11097 || 12872 <= codePoint && codePoint <= 12879 || 57344 <= codePoint && codePoint <= 63743 || 65024 <= codePoint && codePoint <= 65039 || 65533 == codePoint || 127232 <= codePoint && codePoint <= 127242 || 127248 <= codePoint && codePoint <= 127277 || 127280 <= codePoint && codePoint <= 127337 || 127344 <= codePoint && codePoint <= 127386 || 917760 <= codePoint && codePoint <= 917999 || 983040 <= codePoint && codePoint <= 1048573 || 1048576 <= codePoint && codePoint <= 1114109) {
                    return 'A';
                }
                return 'N';
            };
            eaw.characterLength = function (character) {
                var code = this.eastAsianWidth(character);
                if (code == 'F' || code == 'W' || code == 'A') {
                    return 2;
                } else {
                    return 1;
                }
            };
            eaw.length = function (string) {
                var len = 0;
                for (var i = 0; i < string.length; i++) {
                    len = len + this.characterLength(string.charAt(i));
                }
                return len;
            };
        },
        {}
    ],
    38: [
        function (require, module, exports) {
            module.exports = require(18);
        },
        { '/Users/matsu_chara/Documents/sand/knock-sample/node_modules/power-assert/node_modules/empower/node_modules/escallmatch/node_modules/esprima/esprima.js': 18 }
    ],
    39: [
        function (require, module, exports) {
            (function (root, factory) {
                'use strict';
                if (typeof define === 'function' && define.amd) {
                    define(['exports'], factory);
                } else if (typeof exports !== 'undefined') {
                    factory(exports);
                } else {
                    factory(root.estraverse = {});
                }
            }(this, function (exports) {
                'use strict';
                var Syntax, isArray, VisitorOption, VisitorKeys, objectCreate, objectKeys, BREAK, SKIP, REMOVE;
                function ignoreJSHintError() {
                }
                isArray = Array.isArray;
                if (!isArray) {
                    isArray = function isArray(array) {
                        return Object.prototype.toString.call(array) === '[object Array]';
                    };
                }
                function deepCopy(obj) {
                    var ret = {}, key, val;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            val = obj[key];
                            if (typeof val === 'object' && val !== null) {
                                ret[key] = deepCopy(val);
                            } else {
                                ret[key] = val;
                            }
                        }
                    }
                    return ret;
                }
                function shallowCopy(obj) {
                    var ret = {}, key;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            ret[key] = obj[key];
                        }
                    }
                    return ret;
                }
                ignoreJSHintError(shallowCopy);
                function upperBound(array, func) {
                    var diff, len, i, current;
                    len = array.length;
                    i = 0;
                    while (len) {
                        diff = len >>> 1;
                        current = i + diff;
                        if (func(array[current])) {
                            len = diff;
                        } else {
                            i = current + 1;
                            len -= diff + 1;
                        }
                    }
                    return i;
                }
                function lowerBound(array, func) {
                    var diff, len, i, current;
                    len = array.length;
                    i = 0;
                    while (len) {
                        diff = len >>> 1;
                        current = i + diff;
                        if (func(array[current])) {
                            i = current + 1;
                            len -= diff + 1;
                        } else {
                            len = diff;
                        }
                    }
                    return i;
                }
                ignoreJSHintError(lowerBound);
                objectCreate = Object.create || function () {
                    function F() {
                    }
                    return function (o) {
                        F.prototype = o;
                        return new F();
                    };
                }();
                objectKeys = Object.keys || function (o) {
                    var keys = [], key;
                    for (key in o) {
                        keys.push(key);
                    }
                    return keys;
                };
                function extend(to, from) {
                    objectKeys(from).forEach(function (key) {
                        to[key] = from[key];
                    });
                    return to;
                }
                Syntax = {
                    AssignmentExpression: 'AssignmentExpression',
                    ArrayExpression: 'ArrayExpression',
                    ArrayPattern: 'ArrayPattern',
                    ArrowFunctionExpression: 'ArrowFunctionExpression',
                    BlockStatement: 'BlockStatement',
                    BinaryExpression: 'BinaryExpression',
                    BreakStatement: 'BreakStatement',
                    CallExpression: 'CallExpression',
                    CatchClause: 'CatchClause',
                    ClassBody: 'ClassBody',
                    ClassDeclaration: 'ClassDeclaration',
                    ClassExpression: 'ClassExpression',
                    ComprehensionBlock: 'ComprehensionBlock',
                    ComprehensionExpression: 'ComprehensionExpression',
                    ConditionalExpression: 'ConditionalExpression',
                    ContinueStatement: 'ContinueStatement',
                    DebuggerStatement: 'DebuggerStatement',
                    DirectiveStatement: 'DirectiveStatement',
                    DoWhileStatement: 'DoWhileStatement',
                    EmptyStatement: 'EmptyStatement',
                    ExportBatchSpecifier: 'ExportBatchSpecifier',
                    ExportDeclaration: 'ExportDeclaration',
                    ExportSpecifier: 'ExportSpecifier',
                    ExpressionStatement: 'ExpressionStatement',
                    ForStatement: 'ForStatement',
                    ForInStatement: 'ForInStatement',
                    ForOfStatement: 'ForOfStatement',
                    FunctionDeclaration: 'FunctionDeclaration',
                    FunctionExpression: 'FunctionExpression',
                    GeneratorExpression: 'GeneratorExpression',
                    Identifier: 'Identifier',
                    IfStatement: 'IfStatement',
                    ImportDeclaration: 'ImportDeclaration',
                    ImportDefaultSpecifier: 'ImportDefaultSpecifier',
                    ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
                    ImportSpecifier: 'ImportSpecifier',
                    Literal: 'Literal',
                    LabeledStatement: 'LabeledStatement',
                    LogicalExpression: 'LogicalExpression',
                    MemberExpression: 'MemberExpression',
                    MethodDefinition: 'MethodDefinition',
                    ModuleSpecifier: 'ModuleSpecifier',
                    NewExpression: 'NewExpression',
                    ObjectExpression: 'ObjectExpression',
                    ObjectPattern: 'ObjectPattern',
                    Program: 'Program',
                    Property: 'Property',
                    ReturnStatement: 'ReturnStatement',
                    SequenceExpression: 'SequenceExpression',
                    SpreadElement: 'SpreadElement',
                    SwitchStatement: 'SwitchStatement',
                    SwitchCase: 'SwitchCase',
                    TaggedTemplateExpression: 'TaggedTemplateExpression',
                    TemplateElement: 'TemplateElement',
                    TemplateLiteral: 'TemplateLiteral',
                    ThisExpression: 'ThisExpression',
                    ThrowStatement: 'ThrowStatement',
                    TryStatement: 'TryStatement',
                    UnaryExpression: 'UnaryExpression',
                    UpdateExpression: 'UpdateExpression',
                    VariableDeclaration: 'VariableDeclaration',
                    VariableDeclarator: 'VariableDeclarator',
                    WhileStatement: 'WhileStatement',
                    WithStatement: 'WithStatement',
                    YieldExpression: 'YieldExpression'
                };
                VisitorKeys = {
                    AssignmentExpression: [
                        'left',
                        'right'
                    ],
                    ArrayExpression: ['elements'],
                    ArrayPattern: ['elements'],
                    ArrowFunctionExpression: [
                        'params',
                        'defaults',
                        'rest',
                        'body'
                    ],
                    BlockStatement: ['body'],
                    BinaryExpression: [
                        'left',
                        'right'
                    ],
                    BreakStatement: ['label'],
                    CallExpression: [
                        'callee',
                        'arguments'
                    ],
                    CatchClause: [
                        'param',
                        'body'
                    ],
                    ClassBody: ['body'],
                    ClassDeclaration: [
                        'id',
                        'body',
                        'superClass'
                    ],
                    ClassExpression: [
                        'id',
                        'body',
                        'superClass'
                    ],
                    ComprehensionBlock: [
                        'left',
                        'right'
                    ],
                    ComprehensionExpression: [
                        'blocks',
                        'filter',
                        'body'
                    ],
                    ConditionalExpression: [
                        'test',
                        'consequent',
                        'alternate'
                    ],
                    ContinueStatement: ['label'],
                    DebuggerStatement: [],
                    DirectiveStatement: [],
                    DoWhileStatement: [
                        'body',
                        'test'
                    ],
                    EmptyStatement: [],
                    ExportBatchSpecifier: [],
                    ExportDeclaration: [
                        'declaration',
                        'specifiers',
                        'source'
                    ],
                    ExportSpecifier: [
                        'id',
                        'name'
                    ],
                    ExpressionStatement: ['expression'],
                    ForStatement: [
                        'init',
                        'test',
                        'update',
                        'body'
                    ],
                    ForInStatement: [
                        'left',
                        'right',
                        'body'
                    ],
                    ForOfStatement: [
                        'left',
                        'right',
                        'body'
                    ],
                    FunctionDeclaration: [
                        'id',
                        'params',
                        'defaults',
                        'rest',
                        'body'
                    ],
                    FunctionExpression: [
                        'id',
                        'params',
                        'defaults',
                        'rest',
                        'body'
                    ],
                    GeneratorExpression: [
                        'blocks',
                        'filter',
                        'body'
                    ],
                    Identifier: [],
                    IfStatement: [
                        'test',
                        'consequent',
                        'alternate'
                    ],
                    ImportDeclaration: [
                        'specifiers',
                        'source'
                    ],
                    ImportDefaultSpecifier: ['id'],
                    ImportNamespaceSpecifier: ['id'],
                    ImportSpecifier: [
                        'id',
                        'name'
                    ],
                    Literal: [],
                    LabeledStatement: [
                        'label',
                        'body'
                    ],
                    LogicalExpression: [
                        'left',
                        'right'
                    ],
                    MemberExpression: [
                        'object',
                        'property'
                    ],
                    MethodDefinition: [
                        'key',
                        'value'
                    ],
                    ModuleSpecifier: [],
                    NewExpression: [
                        'callee',
                        'arguments'
                    ],
                    ObjectExpression: ['properties'],
                    ObjectPattern: ['properties'],
                    Program: ['body'],
                    Property: [
                        'key',
                        'value'
                    ],
                    ReturnStatement: ['argument'],
                    SequenceExpression: ['expressions'],
                    SpreadElement: ['argument'],
                    SwitchStatement: [
                        'discriminant',
                        'cases'
                    ],
                    SwitchCase: [
                        'test',
                        'consequent'
                    ],
                    TaggedTemplateExpression: [
                        'tag',
                        'quasi'
                    ],
                    TemplateElement: [],
                    TemplateLiteral: [
                        'quasis',
                        'expressions'
                    ],
                    ThisExpression: [],
                    ThrowStatement: ['argument'],
                    TryStatement: [
                        'block',
                        'handlers',
                        'handler',
                        'guardedHandlers',
                        'finalizer'
                    ],
                    UnaryExpression: ['argument'],
                    UpdateExpression: ['argument'],
                    VariableDeclaration: ['declarations'],
                    VariableDeclarator: [
                        'id',
                        'init'
                    ],
                    WhileStatement: [
                        'test',
                        'body'
                    ],
                    WithStatement: [
                        'object',
                        'body'
                    ],
                    YieldExpression: ['argument']
                };
                BREAK = {};
                SKIP = {};
                REMOVE = {};
                VisitorOption = {
                    Break: BREAK,
                    Skip: SKIP,
                    Remove: REMOVE
                };
                function Reference(parent, key) {
                    this.parent = parent;
                    this.key = key;
                }
                Reference.prototype.replace = function replace(node) {
                    this.parent[this.key] = node;
                };
                Reference.prototype.remove = function remove() {
                    if (isArray(this.parent)) {
                        this.parent.splice(this.key, 1);
                        return true;
                    } else {
                        this.replace(null);
                        return false;
                    }
                };
                function Element(node, path, wrap, ref) {
                    this.node = node;
                    this.path = path;
                    this.wrap = wrap;
                    this.ref = ref;
                }
                function Controller() {
                }
                Controller.prototype.path = function path() {
                    var i, iz, j, jz, result, element;
                    function addToPath(result, path) {
                        if (isArray(path)) {
                            for (j = 0, jz = path.length; j < jz; ++j) {
                                result.push(path[j]);
                            }
                        } else {
                            result.push(path);
                        }
                    }
                    if (!this.__current.path) {
                        return null;
                    }
                    result = [];
                    for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
                        element = this.__leavelist[i];
                        addToPath(result, element.path);
                    }
                    addToPath(result, this.__current.path);
                    return result;
                };
                Controller.prototype.parents = function parents() {
                    var i, iz, result;
                    result = [];
                    for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
                        result.push(this.__leavelist[i].node);
                    }
                    return result;
                };
                Controller.prototype.current = function current() {
                    return this.__current.node;
                };
                Controller.prototype.__execute = function __execute(callback, element) {
                    var previous, result;
                    result = undefined;
                    previous = this.__current;
                    this.__current = element;
                    this.__state = null;
                    if (callback) {
                        result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
                    }
                    this.__current = previous;
                    return result;
                };
                Controller.prototype.notify = function notify(flag) {
                    this.__state = flag;
                };
                Controller.prototype.skip = function () {
                    this.notify(SKIP);
                };
                Controller.prototype['break'] = function () {
                    this.notify(BREAK);
                };
                Controller.prototype.remove = function () {
                    this.notify(REMOVE);
                };
                Controller.prototype.__initialize = function (root, visitor) {
                    this.visitor = visitor;
                    this.root = root;
                    this.__worklist = [];
                    this.__leavelist = [];
                    this.__current = null;
                    this.__state = null;
                    this.__fallback = visitor.fallback === 'iteration';
                    this.__keys = VisitorKeys;
                    if (visitor.keys) {
                        this.__keys = extend(objectCreate(this.__keys), visitor.keys);
                    }
                };
                function isNode(node) {
                    if (node == null) {
                        return false;
                    }
                    return typeof node === 'object' && typeof node.type === 'string';
                }
                function isProperty(nodeType, key) {
                    return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
                }
                Controller.prototype.traverse = function traverse(root, visitor) {
                    var worklist, leavelist, element, node, nodeType, ret, key, current, current2, candidates, candidate, sentinel;
                    this.__initialize(root, visitor);
                    sentinel = {};
                    worklist = this.__worklist;
                    leavelist = this.__leavelist;
                    worklist.push(new Element(root, null, null, null));
                    leavelist.push(new Element(null, null, null, null));
                    while (worklist.length) {
                        element = worklist.pop();
                        if (element === sentinel) {
                            element = leavelist.pop();
                            ret = this.__execute(visitor.leave, element);
                            if (this.__state === BREAK || ret === BREAK) {
                                return;
                            }
                            continue;
                        }
                        if (element.node) {
                            ret = this.__execute(visitor.enter, element);
                            if (this.__state === BREAK || ret === BREAK) {
                                return;
                            }
                            worklist.push(sentinel);
                            leavelist.push(element);
                            if (this.__state === SKIP || ret === SKIP) {
                                continue;
                            }
                            node = element.node;
                            nodeType = element.wrap || node.type;
                            candidates = this.__keys[nodeType];
                            if (!candidates) {
                                if (this.__fallback) {
                                    candidates = objectKeys(node);
                                } else {
                                    throw new Error('Unknown node type ' + nodeType + '.');
                                }
                            }
                            current = candidates.length;
                            while ((current -= 1) >= 0) {
                                key = candidates[current];
                                candidate = node[key];
                                if (!candidate) {
                                    continue;
                                }
                                if (isArray(candidate)) {
                                    current2 = candidate.length;
                                    while ((current2 -= 1) >= 0) {
                                        if (!candidate[current2]) {
                                            continue;
                                        }
                                        if (isProperty(nodeType, candidates[current])) {
                                            element = new Element(candidate[current2], [
                                                key,
                                                current2
                                            ], 'Property', null);
                                        } else if (isNode(candidate[current2])) {
                                            element = new Element(candidate[current2], [
                                                key,
                                                current2
                                            ], null, null);
                                        } else {
                                            continue;
                                        }
                                        worklist.push(element);
                                    }
                                } else if (isNode(candidate)) {
                                    worklist.push(new Element(candidate, key, null, null));
                                }
                            }
                        }
                    }
                };
                Controller.prototype.replace = function replace(root, visitor) {
                    function removeElem(element) {
                        var i, key, nextElem, parent;
                        if (element.ref.remove()) {
                            key = element.ref.key;
                            parent = element.ref.parent;
                            i = worklist.length;
                            while (i--) {
                                nextElem = worklist[i];
                                if (nextElem.ref && nextElem.ref.parent === parent) {
                                    if (nextElem.ref.key < key) {
                                        break;
                                    }
                                    --nextElem.ref.key;
                                }
                            }
                        }
                    }
                    var worklist, leavelist, node, nodeType, target, element, current, current2, candidates, candidate, sentinel, outer, key;
                    this.__initialize(root, visitor);
                    sentinel = {};
                    worklist = this.__worklist;
                    leavelist = this.__leavelist;
                    outer = { root: root };
                    element = new Element(root, null, null, new Reference(outer, 'root'));
                    worklist.push(element);
                    leavelist.push(element);
                    while (worklist.length) {
                        element = worklist.pop();
                        if (element === sentinel) {
                            element = leavelist.pop();
                            target = this.__execute(visitor.leave, element);
                            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                                element.ref.replace(target);
                            }
                            if (this.__state === REMOVE || target === REMOVE) {
                                removeElem(element);
                            }
                            if (this.__state === BREAK || target === BREAK) {
                                return outer.root;
                            }
                            continue;
                        }
                        target = this.__execute(visitor.enter, element);
                        if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                            element.ref.replace(target);
                            element.node = target;
                        }
                        if (this.__state === REMOVE || target === REMOVE) {
                            removeElem(element);
                            element.node = null;
                        }
                        if (this.__state === BREAK || target === BREAK) {
                            return outer.root;
                        }
                        node = element.node;
                        if (!node) {
                            continue;
                        }
                        worklist.push(sentinel);
                        leavelist.push(element);
                        if (this.__state === SKIP || target === SKIP) {
                            continue;
                        }
                        nodeType = element.wrap || node.type;
                        candidates = this.__keys[nodeType];
                        if (!candidates) {
                            if (this.__fallback) {
                                candidates = objectKeys(node);
                            } else {
                                throw new Error('Unknown node type ' + nodeType + '.');
                            }
                        }
                        current = candidates.length;
                        while ((current -= 1) >= 0) {
                            key = candidates[current];
                            candidate = node[key];
                            if (!candidate) {
                                continue;
                            }
                            if (isArray(candidate)) {
                                current2 = candidate.length;
                                while ((current2 -= 1) >= 0) {
                                    if (!candidate[current2]) {
                                        continue;
                                    }
                                    if (isProperty(nodeType, candidates[current])) {
                                        element = new Element(candidate[current2], [
                                            key,
                                            current2
                                        ], 'Property', new Reference(candidate, current2));
                                    } else if (isNode(candidate[current2])) {
                                        element = new Element(candidate[current2], [
                                            key,
                                            current2
                                        ], null, new Reference(candidate, current2));
                                    } else {
                                        continue;
                                    }
                                    worklist.push(element);
                                }
                            } else if (isNode(candidate)) {
                                worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                            }
                        }
                    }
                    return outer.root;
                };
                function traverse(root, visitor) {
                    var controller = new Controller();
                    return controller.traverse(root, visitor);
                }
                function replace(root, visitor) {
                    var controller = new Controller();
                    return controller.replace(root, visitor);
                }
                function extendCommentRange(comment, tokens) {
                    var target;
                    target = upperBound(tokens, function search(token) {
                        return token.range[0] > comment.range[0];
                    });
                    comment.extendedRange = [
                        comment.range[0],
                        comment.range[1]
                    ];
                    if (target !== tokens.length) {
                        comment.extendedRange[1] = tokens[target].range[0];
                    }
                    target -= 1;
                    if (target >= 0) {
                        comment.extendedRange[0] = tokens[target].range[1];
                    }
                    return comment;
                }
                function attachComments(tree, providedComments, tokens) {
                    var comments = [], comment, len, i, cursor;
                    if (!tree.range) {
                        throw new Error('attachComments needs range information');
                    }
                    if (!tokens.length) {
                        if (providedComments.length) {
                            for (i = 0, len = providedComments.length; i < len; i += 1) {
                                comment = deepCopy(providedComments[i]);
                                comment.extendedRange = [
                                    0,
                                    tree.range[0]
                                ];
                                comments.push(comment);
                            }
                            tree.leadingComments = comments;
                        }
                        return tree;
                    }
                    for (i = 0, len = providedComments.length; i < len; i += 1) {
                        comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
                    }
                    cursor = 0;
                    traverse(tree, {
                        enter: function (node) {
                            var comment;
                            while (cursor < comments.length) {
                                comment = comments[cursor];
                                if (comment.extendedRange[1] > node.range[0]) {
                                    break;
                                }
                                if (comment.extendedRange[1] === node.range[0]) {
                                    if (!node.leadingComments) {
                                        node.leadingComments = [];
                                    }
                                    node.leadingComments.push(comment);
                                    comments.splice(cursor, 1);
                                } else {
                                    cursor += 1;
                                }
                            }
                            if (cursor === comments.length) {
                                return VisitorOption.Break;
                            }
                            if (comments[cursor].extendedRange[0] > node.range[1]) {
                                return VisitorOption.Skip;
                            }
                        }
                    });
                    cursor = 0;
                    traverse(tree, {
                        leave: function (node) {
                            var comment;
                            while (cursor < comments.length) {
                                comment = comments[cursor];
                                if (node.range[1] < comment.extendedRange[0]) {
                                    break;
                                }
                                if (node.range[1] === comment.extendedRange[0]) {
                                    if (!node.trailingComments) {
                                        node.trailingComments = [];
                                    }
                                    node.trailingComments.push(comment);
                                    comments.splice(cursor, 1);
                                } else {
                                    cursor += 1;
                                }
                            }
                            if (cursor === comments.length) {
                                return VisitorOption.Break;
                            }
                            if (comments[cursor].extendedRange[0] > node.range[1]) {
                                return VisitorOption.Skip;
                            }
                        }
                    });
                    return tree;
                }
                exports.version = '1.7.1';
                exports.Syntax = Syntax;
                exports.traverse = traverse;
                exports.replace = replace;
                exports.attachComments = attachComments;
                exports.VisitorKeys = VisitorKeys;
                exports.VisitorOption = VisitorOption;
                exports.Controller = Controller;
            }));
        },
        {}
    ],
    40: [
        function (require, module, exports) {
            module.exports = require('./javascript/diff_match_patch_uncompressed.js').diff_match_patch;
        },
        { './javascript/diff_match_patch_uncompressed.js': 41 }
    ],
    41: [
        function (require, module, exports) {
            function diff_match_patch() {
                this.Diff_Timeout = 1;
                this.Diff_EditCost = 4;
                this.Match_Threshold = 0.5;
                this.Match_Distance = 1000;
                this.Patch_DeleteThreshold = 0.5;
                this.Patch_Margin = 4;
                this.Match_MaxBits = 32;
            }
            var DIFF_DELETE = -1;
            var DIFF_INSERT = 1;
            var DIFF_EQUAL = 0;
            diff_match_patch.Diff;
            diff_match_patch.prototype.diff_main = function (text1, text2, opt_checklines, opt_deadline) {
                if (typeof opt_deadline == 'undefined') {
                    if (this.Diff_Timeout <= 0) {
                        opt_deadline = Number.MAX_VALUE;
                    } else {
                        opt_deadline = new Date().getTime() + this.Diff_Timeout * 1000;
                    }
                }
                var deadline = opt_deadline;
                if (text1 == null || text2 == null) {
                    throw new Error('Null input. (diff_main)');
                }
                if (text1 == text2) {
                    if (text1) {
                        return [[
                                DIFF_EQUAL,
                                text1
                            ]];
                    }
                    return [];
                }
                if (typeof opt_checklines == 'undefined') {
                    opt_checklines = true;
                }
                var checklines = opt_checklines;
                var commonlength = this.diff_commonPrefix(text1, text2);
                var commonprefix = text1.substring(0, commonlength);
                text1 = text1.substring(commonlength);
                text2 = text2.substring(commonlength);
                commonlength = this.diff_commonSuffix(text1, text2);
                var commonsuffix = text1.substring(text1.length - commonlength);
                text1 = text1.substring(0, text1.length - commonlength);
                text2 = text2.substring(0, text2.length - commonlength);
                var diffs = this.diff_compute_(text1, text2, checklines, deadline);
                if (commonprefix) {
                    diffs.unshift([
                        DIFF_EQUAL,
                        commonprefix
                    ]);
                }
                if (commonsuffix) {
                    diffs.push([
                        DIFF_EQUAL,
                        commonsuffix
                    ]);
                }
                this.diff_cleanupMerge(diffs);
                return diffs;
            };
            diff_match_patch.prototype.diff_compute_ = function (text1, text2, checklines, deadline) {
                var diffs;
                if (!text1) {
                    return [[
                            DIFF_INSERT,
                            text2
                        ]];
                }
                if (!text2) {
                    return [[
                            DIFF_DELETE,
                            text1
                        ]];
                }
                var longtext = text1.length > text2.length ? text1 : text2;
                var shorttext = text1.length > text2.length ? text2 : text1;
                var i = longtext.indexOf(shorttext);
                if (i != -1) {
                    diffs = [
                        [
                            DIFF_INSERT,
                            longtext.substring(0, i)
                        ],
                        [
                            DIFF_EQUAL,
                            shorttext
                        ],
                        [
                            DIFF_INSERT,
                            longtext.substring(i + shorttext.length)
                        ]
                    ];
                    if (text1.length > text2.length) {
                        diffs[0][0] = diffs[2][0] = DIFF_DELETE;
                    }
                    return diffs;
                }
                if (shorttext.length == 1) {
                    return [
                        [
                            DIFF_DELETE,
                            text1
                        ],
                        [
                            DIFF_INSERT,
                            text2
                        ]
                    ];
                }
                var hm = this.diff_halfMatch_(text1, text2);
                if (hm) {
                    var text1_a = hm[0];
                    var text1_b = hm[1];
                    var text2_a = hm[2];
                    var text2_b = hm[3];
                    var mid_common = hm[4];
                    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
                    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
                    return diffs_a.concat([[
                            DIFF_EQUAL,
                            mid_common
                        ]], diffs_b);
                }
                if (checklines && text1.length > 100 && text2.length > 100) {
                    return this.diff_lineMode_(text1, text2, deadline);
                }
                return this.diff_bisect_(text1, text2, deadline);
            };
            diff_match_patch.prototype.diff_lineMode_ = function (text1, text2, deadline) {
                var a = this.diff_linesToChars_(text1, text2);
                text1 = a.chars1;
                text2 = a.chars2;
                var linearray = a.lineArray;
                var diffs = this.diff_main(text1, text2, false, deadline);
                this.diff_charsToLines_(diffs, linearray);
                this.diff_cleanupSemantic(diffs);
                diffs.push([
                    DIFF_EQUAL,
                    ''
                ]);
                var pointer = 0;
                var count_delete = 0;
                var count_insert = 0;
                var text_delete = '';
                var text_insert = '';
                while (pointer < diffs.length) {
                    switch (diffs[pointer][0]) {
                    case DIFF_INSERT:
                        count_insert++;
                        text_insert += diffs[pointer][1];
                        break;
                    case DIFF_DELETE:
                        count_delete++;
                        text_delete += diffs[pointer][1];
                        break;
                    case DIFF_EQUAL:
                        if (count_delete >= 1 && count_insert >= 1) {
                            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert);
                            pointer = pointer - count_delete - count_insert;
                            var a = this.diff_main(text_delete, text_insert, false, deadline);
                            for (var j = a.length - 1; j >= 0; j--) {
                                diffs.splice(pointer, 0, a[j]);
                            }
                            pointer = pointer + a.length;
                        }
                        count_insert = 0;
                        count_delete = 0;
                        text_delete = '';
                        text_insert = '';
                        break;
                    }
                    pointer++;
                }
                diffs.pop();
                return diffs;
            };
            diff_match_patch.prototype.diff_bisect_ = function (text1, text2, deadline) {
                var text1_length = text1.length;
                var text2_length = text2.length;
                var max_d = Math.ceil((text1_length + text2_length) / 2);
                var v_offset = max_d;
                var v_length = 2 * max_d;
                var v1 = new Array(v_length);
                var v2 = new Array(v_length);
                for (var x = 0; x < v_length; x++) {
                    v1[x] = -1;
                    v2[x] = -1;
                }
                v1[v_offset + 1] = 0;
                v2[v_offset + 1] = 0;
                var delta = text1_length - text2_length;
                var front = delta % 2 != 0;
                var k1start = 0;
                var k1end = 0;
                var k2start = 0;
                var k2end = 0;
                for (var d = 0; d < max_d; d++) {
                    if (new Date().getTime() > deadline) {
                        break;
                    }
                    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
                        var k1_offset = v_offset + k1;
                        var x1;
                        if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
                            x1 = v1[k1_offset + 1];
                        } else {
                            x1 = v1[k1_offset - 1] + 1;
                        }
                        var y1 = x1 - k1;
                        while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
                            x1++;
                            y1++;
                        }
                        v1[k1_offset] = x1;
                        if (x1 > text1_length) {
                            k1end += 2;
                        } else if (y1 > text2_length) {
                            k1start += 2;
                        } else if (front) {
                            var k2_offset = v_offset + delta - k1;
                            if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
                                var x2 = text1_length - v2[k2_offset];
                                if (x1 >= x2) {
                                    return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
                                }
                            }
                        }
                    }
                    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
                        var k2_offset = v_offset + k2;
                        var x2;
                        if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
                            x2 = v2[k2_offset + 1];
                        } else {
                            x2 = v2[k2_offset - 1] + 1;
                        }
                        var y2 = x2 - k2;
                        while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
                            x2++;
                            y2++;
                        }
                        v2[k2_offset] = x2;
                        if (x2 > text1_length) {
                            k2end += 2;
                        } else if (y2 > text2_length) {
                            k2start += 2;
                        } else if (!front) {
                            var k1_offset = v_offset + delta - k2;
                            if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
                                var x1 = v1[k1_offset];
                                var y1 = v_offset + x1 - k1_offset;
                                x2 = text1_length - x2;
                                if (x1 >= x2) {
                                    return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
                                }
                            }
                        }
                    }
                }
                return [
                    [
                        DIFF_DELETE,
                        text1
                    ],
                    [
                        DIFF_INSERT,
                        text2
                    ]
                ];
            };
            diff_match_patch.prototype.diff_bisectSplit_ = function (text1, text2, x, y, deadline) {
                var text1a = text1.substring(0, x);
                var text2a = text2.substring(0, y);
                var text1b = text1.substring(x);
                var text2b = text2.substring(y);
                var diffs = this.diff_main(text1a, text2a, false, deadline);
                var diffsb = this.diff_main(text1b, text2b, false, deadline);
                return diffs.concat(diffsb);
            };
            diff_match_patch.prototype.diff_linesToChars_ = function (text1, text2) {
                var lineArray = [];
                var lineHash = {};
                lineArray[0] = '';
                function diff_linesToCharsMunge_(text) {
                    var chars = '';
                    var lineStart = 0;
                    var lineEnd = -1;
                    var lineArrayLength = lineArray.length;
                    while (lineEnd < text.length - 1) {
                        lineEnd = text.indexOf('\n', lineStart);
                        if (lineEnd == -1) {
                            lineEnd = text.length - 1;
                        }
                        var line = text.substring(lineStart, lineEnd + 1);
                        lineStart = lineEnd + 1;
                        if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== undefined) {
                            chars += String.fromCharCode(lineHash[line]);
                        } else {
                            chars += String.fromCharCode(lineArrayLength);
                            lineHash[line] = lineArrayLength;
                            lineArray[lineArrayLength++] = line;
                        }
                    }
                    return chars;
                }
                var chars1 = diff_linesToCharsMunge_(text1);
                var chars2 = diff_linesToCharsMunge_(text2);
                return {
                    chars1: chars1,
                    chars2: chars2,
                    lineArray: lineArray
                };
            };
            diff_match_patch.prototype.diff_charsToLines_ = function (diffs, lineArray) {
                for (var x = 0; x < diffs.length; x++) {
                    var chars = diffs[x][1];
                    var text = [];
                    for (var y = 0; y < chars.length; y++) {
                        text[y] = lineArray[chars.charCodeAt(y)];
                    }
                    diffs[x][1] = text.join('');
                }
            };
            diff_match_patch.prototype.diff_commonPrefix = function (text1, text2) {
                if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
                    return 0;
                }
                var pointermin = 0;
                var pointermax = Math.min(text1.length, text2.length);
                var pointermid = pointermax;
                var pointerstart = 0;
                while (pointermin < pointermid) {
                    if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
                        pointermin = pointermid;
                        pointerstart = pointermin;
                    } else {
                        pointermax = pointermid;
                    }
                    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
                }
                return pointermid;
            };
            diff_match_patch.prototype.diff_commonSuffix = function (text1, text2) {
                if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
                    return 0;
                }
                var pointermin = 0;
                var pointermax = Math.min(text1.length, text2.length);
                var pointermid = pointermax;
                var pointerend = 0;
                while (pointermin < pointermid) {
                    if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
                        pointermin = pointermid;
                        pointerend = pointermin;
                    } else {
                        pointermax = pointermid;
                    }
                    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
                }
                return pointermid;
            };
            diff_match_patch.prototype.diff_commonOverlap_ = function (text1, text2) {
                var text1_length = text1.length;
                var text2_length = text2.length;
                if (text1_length == 0 || text2_length == 0) {
                    return 0;
                }
                if (text1_length > text2_length) {
                    text1 = text1.substring(text1_length - text2_length);
                } else if (text1_length < text2_length) {
                    text2 = text2.substring(0, text1_length);
                }
                var text_length = Math.min(text1_length, text2_length);
                if (text1 == text2) {
                    return text_length;
                }
                var best = 0;
                var length = 1;
                while (true) {
                    var pattern = text1.substring(text_length - length);
                    var found = text2.indexOf(pattern);
                    if (found == -1) {
                        return best;
                    }
                    length += found;
                    if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
                        best = length;
                        length++;
                    }
                }
            };
            diff_match_patch.prototype.diff_halfMatch_ = function (text1, text2) {
                if (this.Diff_Timeout <= 0) {
                    return null;
                }
                var longtext = text1.length > text2.length ? text1 : text2;
                var shorttext = text1.length > text2.length ? text2 : text1;
                if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
                    return null;
                }
                var dmp = this;
                function diff_halfMatchI_(longtext, shorttext, i) {
                    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
                    var j = -1;
                    var best_common = '';
                    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
                    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
                        var prefixLength = dmp.diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
                        var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
                        if (best_common.length < suffixLength + prefixLength) {
                            best_common = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
                            best_longtext_a = longtext.substring(0, i - suffixLength);
                            best_longtext_b = longtext.substring(i + prefixLength);
                            best_shorttext_a = shorttext.substring(0, j - suffixLength);
                            best_shorttext_b = shorttext.substring(j + prefixLength);
                        }
                    }
                    if (best_common.length * 2 >= longtext.length) {
                        return [
                            best_longtext_a,
                            best_longtext_b,
                            best_shorttext_a,
                            best_shorttext_b,
                            best_common
                        ];
                    } else {
                        return null;
                    }
                }
                var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
                var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
                var hm;
                if (!hm1 && !hm2) {
                    return null;
                } else if (!hm2) {
                    hm = hm1;
                } else if (!hm1) {
                    hm = hm2;
                } else {
                    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
                }
                var text1_a, text1_b, text2_a, text2_b;
                if (text1.length > text2.length) {
                    text1_a = hm[0];
                    text1_b = hm[1];
                    text2_a = hm[2];
                    text2_b = hm[3];
                } else {
                    text2_a = hm[0];
                    text2_b = hm[1];
                    text1_a = hm[2];
                    text1_b = hm[3];
                }
                var mid_common = hm[4];
                return [
                    text1_a,
                    text1_b,
                    text2_a,
                    text2_b,
                    mid_common
                ];
            };
            diff_match_patch.prototype.diff_cleanupSemantic = function (diffs) {
                var changes = false;
                var equalities = [];
                var equalitiesLength = 0;
                var lastequality = null;
                var pointer = 0;
                var length_insertions1 = 0;
                var length_deletions1 = 0;
                var length_insertions2 = 0;
                var length_deletions2 = 0;
                while (pointer < diffs.length) {
                    if (diffs[pointer][0] == DIFF_EQUAL) {
                        equalities[equalitiesLength++] = pointer;
                        length_insertions1 = length_insertions2;
                        length_deletions1 = length_deletions2;
                        length_insertions2 = 0;
                        length_deletions2 = 0;
                        lastequality = diffs[pointer][1];
                    } else {
                        if (diffs[pointer][0] == DIFF_INSERT) {
                            length_insertions2 += diffs[pointer][1].length;
                        } else {
                            length_deletions2 += diffs[pointer][1].length;
                        }
                        if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
                            diffs.splice(equalities[equalitiesLength - 1], 0, [
                                DIFF_DELETE,
                                lastequality
                            ]);
                            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
                            equalitiesLength--;
                            equalitiesLength--;
                            pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
                            length_insertions1 = 0;
                            length_deletions1 = 0;
                            length_insertions2 = 0;
                            length_deletions2 = 0;
                            lastequality = null;
                            changes = true;
                        }
                    }
                    pointer++;
                }
                if (changes) {
                    this.diff_cleanupMerge(diffs);
                }
                this.diff_cleanupSemanticLossless(diffs);
                pointer = 1;
                while (pointer < diffs.length) {
                    if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
                        var deletion = diffs[pointer - 1][1];
                        var insertion = diffs[pointer][1];
                        var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
                        var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
                        if (overlap_length1 >= overlap_length2) {
                            if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
                                diffs.splice(pointer, 0, [
                                    DIFF_EQUAL,
                                    insertion.substring(0, overlap_length1)
                                ]);
                                diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
                                diffs[pointer + 1][1] = insertion.substring(overlap_length1);
                                pointer++;
                            }
                        } else {
                            if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
                                diffs.splice(pointer, 0, [
                                    DIFF_EQUAL,
                                    deletion.substring(0, overlap_length2)
                                ]);
                                diffs[pointer - 1][0] = DIFF_INSERT;
                                diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
                                diffs[pointer + 1][0] = DIFF_DELETE;
                                diffs[pointer + 1][1] = deletion.substring(overlap_length2);
                                pointer++;
                            }
                        }
                        pointer++;
                    }
                    pointer++;
                }
            };
            diff_match_patch.prototype.diff_cleanupSemanticLossless = function (diffs) {
                function diff_cleanupSemanticScore_(one, two) {
                    if (!one || !two) {
                        return 6;
                    }
                    var char1 = one.charAt(one.length - 1);
                    var char2 = two.charAt(0);
                    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
                    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
                    var whitespace1 = nonAlphaNumeric1 && char1.match(diff_match_patch.whitespaceRegex_);
                    var whitespace2 = nonAlphaNumeric2 && char2.match(diff_match_patch.whitespaceRegex_);
                    var lineBreak1 = whitespace1 && char1.match(diff_match_patch.linebreakRegex_);
                    var lineBreak2 = whitespace2 && char2.match(diff_match_patch.linebreakRegex_);
                    var blankLine1 = lineBreak1 && one.match(diff_match_patch.blanklineEndRegex_);
                    var blankLine2 = lineBreak2 && two.match(diff_match_patch.blanklineStartRegex_);
                    if (blankLine1 || blankLine2) {
                        return 5;
                    } else if (lineBreak1 || lineBreak2) {
                        return 4;
                    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
                        return 3;
                    } else if (whitespace1 || whitespace2) {
                        return 2;
                    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
                        return 1;
                    }
                    return 0;
                }
                var pointer = 1;
                while (pointer < diffs.length - 1) {
                    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
                        var equality1 = diffs[pointer - 1][1];
                        var edit = diffs[pointer][1];
                        var equality2 = diffs[pointer + 1][1];
                        var commonOffset = this.diff_commonSuffix(equality1, edit);
                        if (commonOffset) {
                            var commonString = edit.substring(edit.length - commonOffset);
                            equality1 = equality1.substring(0, equality1.length - commonOffset);
                            edit = commonString + edit.substring(0, edit.length - commonOffset);
                            equality2 = commonString + equality2;
                        }
                        var bestEquality1 = equality1;
                        var bestEdit = edit;
                        var bestEquality2 = equality2;
                        var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
                        while (edit.charAt(0) === equality2.charAt(0)) {
                            equality1 += edit.charAt(0);
                            edit = edit.substring(1) + equality2.charAt(0);
                            equality2 = equality2.substring(1);
                            var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
                            if (score >= bestScore) {
                                bestScore = score;
                                bestEquality1 = equality1;
                                bestEdit = edit;
                                bestEquality2 = equality2;
                            }
                        }
                        if (diffs[pointer - 1][1] != bestEquality1) {
                            if (bestEquality1) {
                                diffs[pointer - 1][1] = bestEquality1;
                            } else {
                                diffs.splice(pointer - 1, 1);
                                pointer--;
                            }
                            diffs[pointer][1] = bestEdit;
                            if (bestEquality2) {
                                diffs[pointer + 1][1] = bestEquality2;
                            } else {
                                diffs.splice(pointer + 1, 1);
                                pointer--;
                            }
                        }
                    }
                    pointer++;
                }
            };
            diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
            diff_match_patch.whitespaceRegex_ = /\s/;
            diff_match_patch.linebreakRegex_ = /[\r\n]/;
            diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
            diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;
            diff_match_patch.prototype.diff_cleanupEfficiency = function (diffs) {
                var changes = false;
                var equalities = [];
                var equalitiesLength = 0;
                var lastequality = null;
                var pointer = 0;
                var pre_ins = false;
                var pre_del = false;
                var post_ins = false;
                var post_del = false;
                while (pointer < diffs.length) {
                    if (diffs[pointer][0] == DIFF_EQUAL) {
                        if (diffs[pointer][1].length < this.Diff_EditCost && (post_ins || post_del)) {
                            equalities[equalitiesLength++] = pointer;
                            pre_ins = post_ins;
                            pre_del = post_del;
                            lastequality = diffs[pointer][1];
                        } else {
                            equalitiesLength = 0;
                            lastequality = null;
                        }
                        post_ins = post_del = false;
                    } else {
                        if (diffs[pointer][0] == DIFF_DELETE) {
                            post_del = true;
                        } else {
                            post_ins = true;
                        }
                        if (lastequality && (pre_ins && pre_del && post_ins && post_del || lastequality.length < this.Diff_EditCost / 2 && pre_ins + pre_del + post_ins + post_del == 3)) {
                            diffs.splice(equalities[equalitiesLength - 1], 0, [
                                DIFF_DELETE,
                                lastequality
                            ]);
                            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
                            equalitiesLength--;
                            lastequality = null;
                            if (pre_ins && pre_del) {
                                post_ins = post_del = true;
                                equalitiesLength = 0;
                            } else {
                                equalitiesLength--;
                                pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
                                post_ins = post_del = false;
                            }
                            changes = true;
                        }
                    }
                    pointer++;
                }
                if (changes) {
                    this.diff_cleanupMerge(diffs);
                }
            };
            diff_match_patch.prototype.diff_cleanupMerge = function (diffs) {
                diffs.push([
                    DIFF_EQUAL,
                    ''
                ]);
                var pointer = 0;
                var count_delete = 0;
                var count_insert = 0;
                var text_delete = '';
                var text_insert = '';
                var commonlength;
                while (pointer < diffs.length) {
                    switch (diffs[pointer][0]) {
                    case DIFF_INSERT:
                        count_insert++;
                        text_insert += diffs[pointer][1];
                        pointer++;
                        break;
                    case DIFF_DELETE:
                        count_delete++;
                        text_delete += diffs[pointer][1];
                        pointer++;
                        break;
                    case DIFF_EQUAL:
                        if (count_delete + count_insert > 1) {
                            if (count_delete !== 0 && count_insert !== 0) {
                                commonlength = this.diff_commonPrefix(text_insert, text_delete);
                                if (commonlength !== 0) {
                                    if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
                                        diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
                                    } else {
                                        diffs.splice(0, 0, [
                                            DIFF_EQUAL,
                                            text_insert.substring(0, commonlength)
                                        ]);
                                        pointer++;
                                    }
                                    text_insert = text_insert.substring(commonlength);
                                    text_delete = text_delete.substring(commonlength);
                                }
                                commonlength = this.diff_commonSuffix(text_insert, text_delete);
                                if (commonlength !== 0) {
                                    diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                                    text_insert = text_insert.substring(0, text_insert.length - commonlength);
                                    text_delete = text_delete.substring(0, text_delete.length - commonlength);
                                }
                            }
                            if (count_delete === 0) {
                                diffs.splice(pointer - count_insert, count_delete + count_insert, [
                                    DIFF_INSERT,
                                    text_insert
                                ]);
                            } else if (count_insert === 0) {
                                diffs.splice(pointer - count_delete, count_delete + count_insert, [
                                    DIFF_DELETE,
                                    text_delete
                                ]);
                            } else {
                                diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [
                                    DIFF_DELETE,
                                    text_delete
                                ], [
                                    DIFF_INSERT,
                                    text_insert
                                ]);
                            }
                            pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
                        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
                            diffs[pointer - 1][1] += diffs[pointer][1];
                            diffs.splice(pointer, 1);
                        } else {
                            pointer++;
                        }
                        count_insert = 0;
                        count_delete = 0;
                        text_delete = '';
                        text_insert = '';
                        break;
                    }
                }
                if (diffs[diffs.length - 1][1] === '') {
                    diffs.pop();
                }
                var changes = false;
                pointer = 1;
                while (pointer < diffs.length - 1) {
                    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
                        if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
                            diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
                            diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
                            diffs.splice(pointer - 1, 1);
                            changes = true;
                        } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
                            diffs[pointer - 1][1] += diffs[pointer + 1][1];
                            diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
                            diffs.splice(pointer + 1, 1);
                            changes = true;
                        }
                    }
                    pointer++;
                }
                if (changes) {
                    this.diff_cleanupMerge(diffs);
                }
            };
            diff_match_patch.prototype.diff_xIndex = function (diffs, loc) {
                var chars1 = 0;
                var chars2 = 0;
                var last_chars1 = 0;
                var last_chars2 = 0;
                var x;
                for (x = 0; x < diffs.length; x++) {
                    if (diffs[x][0] !== DIFF_INSERT) {
                        chars1 += diffs[x][1].length;
                    }
                    if (diffs[x][0] !== DIFF_DELETE) {
                        chars2 += diffs[x][1].length;
                    }
                    if (chars1 > loc) {
                        break;
                    }
                    last_chars1 = chars1;
                    last_chars2 = chars2;
                }
                if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
                    return last_chars2;
                }
                return last_chars2 + (loc - last_chars1);
            };
            diff_match_patch.prototype.diff_prettyHtml = function (diffs) {
                var html = [];
                var pattern_amp = /&/g;
                var pattern_lt = /</g;
                var pattern_gt = />/g;
                var pattern_para = /\n/g;
                for (var x = 0; x < diffs.length; x++) {
                    var op = diffs[x][0];
                    var data = diffs[x][1];
                    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;').replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
                    switch (op) {
                    case DIFF_INSERT:
                        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
                        break;
                    case DIFF_DELETE:
                        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
                        break;
                    case DIFF_EQUAL:
                        html[x] = '<span>' + text + '</span>';
                        break;
                    }
                }
                return html.join('');
            };
            diff_match_patch.prototype.diff_text1 = function (diffs) {
                var text = [];
                for (var x = 0; x < diffs.length; x++) {
                    if (diffs[x][0] !== DIFF_INSERT) {
                        text[x] = diffs[x][1];
                    }
                }
                return text.join('');
            };
            diff_match_patch.prototype.diff_text2 = function (diffs) {
                var text = [];
                for (var x = 0; x < diffs.length; x++) {
                    if (diffs[x][0] !== DIFF_DELETE) {
                        text[x] = diffs[x][1];
                    }
                }
                return text.join('');
            };
            diff_match_patch.prototype.diff_levenshtein = function (diffs) {
                var levenshtein = 0;
                var insertions = 0;
                var deletions = 0;
                for (var x = 0; x < diffs.length; x++) {
                    var op = diffs[x][0];
                    var data = diffs[x][1];
                    switch (op) {
                    case DIFF_INSERT:
                        insertions += data.length;
                        break;
                    case DIFF_DELETE:
                        deletions += data.length;
                        break;
                    case DIFF_EQUAL:
                        levenshtein += Math.max(insertions, deletions);
                        insertions = 0;
                        deletions = 0;
                        break;
                    }
                }
                levenshtein += Math.max(insertions, deletions);
                return levenshtein;
            };
            diff_match_patch.prototype.diff_toDelta = function (diffs) {
                var text = [];
                for (var x = 0; x < diffs.length; x++) {
                    switch (diffs[x][0]) {
                    case DIFF_INSERT:
                        text[x] = '+' + encodeURI(diffs[x][1]);
                        break;
                    case DIFF_DELETE:
                        text[x] = '-' + diffs[x][1].length;
                        break;
                    case DIFF_EQUAL:
                        text[x] = '=' + diffs[x][1].length;
                        break;
                    }
                }
                return text.join('\t').replace(/%20/g, ' ');
            };
            diff_match_patch.prototype.diff_fromDelta = function (text1, delta) {
                var diffs = [];
                var diffsLength = 0;
                var pointer = 0;
                var tokens = delta.split(/\t/g);
                for (var x = 0; x < tokens.length; x++) {
                    var param = tokens[x].substring(1);
                    switch (tokens[x].charAt(0)) {
                    case '+':
                        try {
                            diffs[diffsLength++] = [
                                DIFF_INSERT,
                                decodeURI(param)
                            ];
                        } catch (ex) {
                            throw new Error('Illegal escape in diff_fromDelta: ' + param);
                        }
                        break;
                    case '-':
                    case '=':
                        var n = parseInt(param, 10);
                        if (isNaN(n) || n < 0) {
                            throw new Error('Invalid number in diff_fromDelta: ' + param);
                        }
                        var text = text1.substring(pointer, pointer += n);
                        if (tokens[x].charAt(0) == '=') {
                            diffs[diffsLength++] = [
                                DIFF_EQUAL,
                                text
                            ];
                        } else {
                            diffs[diffsLength++] = [
                                DIFF_DELETE,
                                text
                            ];
                        }
                        break;
                    default:
                        if (tokens[x]) {
                            throw new Error('Invalid diff operation in diff_fromDelta: ' + tokens[x]);
                        }
                    }
                }
                if (pointer != text1.length) {
                    throw new Error('Delta length (' + pointer + ') does not equal source text length (' + text1.length + ').');
                }
                return diffs;
            };
            diff_match_patch.prototype.match_main = function (text, pattern, loc) {
                if (text == null || pattern == null || loc == null) {
                    throw new Error('Null input. (match_main)');
                }
                loc = Math.max(0, Math.min(loc, text.length));
                if (text == pattern) {
                    return 0;
                } else if (!text.length) {
                    return -1;
                } else if (text.substring(loc, loc + pattern.length) == pattern) {
                    return loc;
                } else {
                    return this.match_bitap_(text, pattern, loc);
                }
            };
            diff_match_patch.prototype.match_bitap_ = function (text, pattern, loc) {
                if (pattern.length > this.Match_MaxBits) {
                    throw new Error('Pattern too long for this browser.');
                }
                var s = this.match_alphabet_(pattern);
                var dmp = this;
                function match_bitapScore_(e, x) {
                    var accuracy = e / pattern.length;
                    var proximity = Math.abs(loc - x);
                    if (!dmp.Match_Distance) {
                        return proximity ? 1 : accuracy;
                    }
                    return accuracy + proximity / dmp.Match_Distance;
                }
                var score_threshold = this.Match_Threshold;
                var best_loc = text.indexOf(pattern, loc);
                if (best_loc != -1) {
                    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
                    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
                    if (best_loc != -1) {
                        score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
                    }
                }
                var matchmask = 1 << pattern.length - 1;
                best_loc = -1;
                var bin_min, bin_mid;
                var bin_max = pattern.length + text.length;
                var last_rd;
                for (var d = 0; d < pattern.length; d++) {
                    bin_min = 0;
                    bin_mid = bin_max;
                    while (bin_min < bin_mid) {
                        if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
                            bin_min = bin_mid;
                        } else {
                            bin_max = bin_mid;
                        }
                        bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
                    }
                    bin_max = bin_mid;
                    var start = Math.max(1, loc - bin_mid + 1);
                    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;
                    var rd = Array(finish + 2);
                    rd[finish + 1] = (1 << d) - 1;
                    for (var j = finish; j >= start; j--) {
                        var charMatch = s[text.charAt(j - 1)];
                        if (d === 0) {
                            rd[j] = (rd[j + 1] << 1 | 1) & charMatch;
                        } else {
                            rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((last_rd[j + 1] | last_rd[j]) << 1 | 1) | last_rd[j + 1];
                        }
                        if (rd[j] & matchmask) {
                            var score = match_bitapScore_(d, j - 1);
                            if (score <= score_threshold) {
                                score_threshold = score;
                                best_loc = j - 1;
                                if (best_loc > loc) {
                                    start = Math.max(1, 2 * loc - best_loc);
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                    if (match_bitapScore_(d + 1, loc) > score_threshold) {
                        break;
                    }
                    last_rd = rd;
                }
                return best_loc;
            };
            diff_match_patch.prototype.match_alphabet_ = function (pattern) {
                var s = {};
                for (var i = 0; i < pattern.length; i++) {
                    s[pattern.charAt(i)] = 0;
                }
                for (var i = 0; i < pattern.length; i++) {
                    s[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
                }
                return s;
            };
            diff_match_patch.prototype.patch_addContext_ = function (patch, text) {
                if (text.length == 0) {
                    return;
                }
                var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
                var padding = 0;
                while (text.indexOf(pattern) != text.lastIndexOf(pattern) && pattern.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin) {
                    padding += this.Patch_Margin;
                    pattern = text.substring(patch.start2 - padding, patch.start2 + patch.length1 + padding);
                }
                padding += this.Patch_Margin;
                var prefix = text.substring(patch.start2 - padding, patch.start2);
                if (prefix) {
                    patch.diffs.unshift([
                        DIFF_EQUAL,
                        prefix
                    ]);
                }
                var suffix = text.substring(patch.start2 + patch.length1, patch.start2 + patch.length1 + padding);
                if (suffix) {
                    patch.diffs.push([
                        DIFF_EQUAL,
                        suffix
                    ]);
                }
                patch.start1 -= prefix.length;
                patch.start2 -= prefix.length;
                patch.length1 += prefix.length + suffix.length;
                patch.length2 += prefix.length + suffix.length;
            };
            diff_match_patch.prototype.patch_make = function (a, opt_b, opt_c) {
                var text1, diffs;
                if (typeof a == 'string' && typeof opt_b == 'string' && typeof opt_c == 'undefined') {
                    text1 = a;
                    diffs = this.diff_main(text1, opt_b, true);
                    if (diffs.length > 2) {
                        this.diff_cleanupSemantic(diffs);
                        this.diff_cleanupEfficiency(diffs);
                    }
                } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' && typeof opt_c == 'undefined') {
                    diffs = a;
                    text1 = this.diff_text1(diffs);
                } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' && typeof opt_c == 'undefined') {
                    text1 = a;
                    diffs = opt_b;
                } else if (typeof a == 'string' && typeof opt_b == 'string' && opt_c && typeof opt_c == 'object') {
                    text1 = a;
                    diffs = opt_c;
                } else {
                    throw new Error('Unknown call format to patch_make.');
                }
                if (diffs.length === 0) {
                    return [];
                }
                var patches = [];
                var patch = new diff_match_patch.patch_obj();
                var patchDiffLength = 0;
                var char_count1 = 0;
                var char_count2 = 0;
                var prepatch_text = text1;
                var postpatch_text = text1;
                for (var x = 0; x < diffs.length; x++) {
                    var diff_type = diffs[x][0];
                    var diff_text = diffs[x][1];
                    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
                        patch.start1 = char_count1;
                        patch.start2 = char_count2;
                    }
                    switch (diff_type) {
                    case DIFF_INSERT:
                        patch.diffs[patchDiffLength++] = diffs[x];
                        patch.length2 += diff_text.length;
                        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text + postpatch_text.substring(char_count2);
                        break;
                    case DIFF_DELETE:
                        patch.length1 += diff_text.length;
                        patch.diffs[patchDiffLength++] = diffs[x];
                        postpatch_text = postpatch_text.substring(0, char_count2) + postpatch_text.substring(char_count2 + diff_text.length);
                        break;
                    case DIFF_EQUAL:
                        if (diff_text.length <= 2 * this.Patch_Margin && patchDiffLength && diffs.length != x + 1) {
                            patch.diffs[patchDiffLength++] = diffs[x];
                            patch.length1 += diff_text.length;
                            patch.length2 += diff_text.length;
                        } else if (diff_text.length >= 2 * this.Patch_Margin) {
                            if (patchDiffLength) {
                                this.patch_addContext_(patch, prepatch_text);
                                patches.push(patch);
                                patch = new diff_match_patch.patch_obj();
                                patchDiffLength = 0;
                                prepatch_text = postpatch_text;
                                char_count1 = char_count2;
                            }
                        }
                        break;
                    }
                    if (diff_type !== DIFF_INSERT) {
                        char_count1 += diff_text.length;
                    }
                    if (diff_type !== DIFF_DELETE) {
                        char_count2 += diff_text.length;
                    }
                }
                if (patchDiffLength) {
                    this.patch_addContext_(patch, prepatch_text);
                    patches.push(patch);
                }
                return patches;
            };
            diff_match_patch.prototype.patch_deepCopy = function (patches) {
                var patchesCopy = [];
                for (var x = 0; x < patches.length; x++) {
                    var patch = patches[x];
                    var patchCopy = new diff_match_patch.patch_obj();
                    patchCopy.diffs = [];
                    for (var y = 0; y < patch.diffs.length; y++) {
                        patchCopy.diffs[y] = patch.diffs[y].slice();
                    }
                    patchCopy.start1 = patch.start1;
                    patchCopy.start2 = patch.start2;
                    patchCopy.length1 = patch.length1;
                    patchCopy.length2 = patch.length2;
                    patchesCopy[x] = patchCopy;
                }
                return patchesCopy;
            };
            diff_match_patch.prototype.patch_apply = function (patches, text) {
                if (patches.length == 0) {
                    return [
                        text,
                        []
                    ];
                }
                patches = this.patch_deepCopy(patches);
                var nullPadding = this.patch_addPadding(patches);
                text = nullPadding + text + nullPadding;
                this.patch_splitMax(patches);
                var delta = 0;
                var results = [];
                for (var x = 0; x < patches.length; x++) {
                    var expected_loc = patches[x].start2 + delta;
                    var text1 = this.diff_text1(patches[x].diffs);
                    var start_loc;
                    var end_loc = -1;
                    if (text1.length > this.Match_MaxBits) {
                        start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits), expected_loc);
                        if (start_loc != -1) {
                            end_loc = this.match_main(text, text1.substring(text1.length - this.Match_MaxBits), expected_loc + text1.length - this.Match_MaxBits);
                            if (end_loc == -1 || start_loc >= end_loc) {
                                start_loc = -1;
                            }
                        }
                    } else {
                        start_loc = this.match_main(text, text1, expected_loc);
                    }
                    if (start_loc == -1) {
                        results[x] = false;
                        delta -= patches[x].length2 - patches[x].length1;
                    } else {
                        results[x] = true;
                        delta = start_loc - expected_loc;
                        var text2;
                        if (end_loc == -1) {
                            text2 = text.substring(start_loc, start_loc + text1.length);
                        } else {
                            text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
                        }
                        if (text1 == text2) {
                            text = text.substring(0, start_loc) + this.diff_text2(patches[x].diffs) + text.substring(start_loc + text1.length);
                        } else {
                            var diffs = this.diff_main(text1, text2, false);
                            if (text1.length > this.Match_MaxBits && this.diff_levenshtein(diffs) / text1.length > this.Patch_DeleteThreshold) {
                                results[x] = false;
                            } else {
                                this.diff_cleanupSemanticLossless(diffs);
                                var index1 = 0;
                                var index2;
                                for (var y = 0; y < patches[x].diffs.length; y++) {
                                    var mod = patches[x].diffs[y];
                                    if (mod[0] !== DIFF_EQUAL) {
                                        index2 = this.diff_xIndex(diffs, index1);
                                    }
                                    if (mod[0] === DIFF_INSERT) {
                                        text = text.substring(0, start_loc + index2) + mod[1] + text.substring(start_loc + index2);
                                    } else if (mod[0] === DIFF_DELETE) {
                                        text = text.substring(0, start_loc + index2) + text.substring(start_loc + this.diff_xIndex(diffs, index1 + mod[1].length));
                                    }
                                    if (mod[0] !== DIFF_DELETE) {
                                        index1 += mod[1].length;
                                    }
                                }
                            }
                        }
                    }
                }
                text = text.substring(nullPadding.length, text.length - nullPadding.length);
                return [
                    text,
                    results
                ];
            };
            diff_match_patch.prototype.patch_addPadding = function (patches) {
                var paddingLength = this.Patch_Margin;
                var nullPadding = '';
                for (var x = 1; x <= paddingLength; x++) {
                    nullPadding += String.fromCharCode(x);
                }
                for (var x = 0; x < patches.length; x++) {
                    patches[x].start1 += paddingLength;
                    patches[x].start2 += paddingLength;
                }
                var patch = patches[0];
                var diffs = patch.diffs;
                if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
                    diffs.unshift([
                        DIFF_EQUAL,
                        nullPadding
                    ]);
                    patch.start1 -= paddingLength;
                    patch.start2 -= paddingLength;
                    patch.length1 += paddingLength;
                    patch.length2 += paddingLength;
                } else if (paddingLength > diffs[0][1].length) {
                    var extraLength = paddingLength - diffs[0][1].length;
                    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
                    patch.start1 -= extraLength;
                    patch.start2 -= extraLength;
                    patch.length1 += extraLength;
                    patch.length2 += extraLength;
                }
                patch = patches[patches.length - 1];
                diffs = patch.diffs;
                if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
                    diffs.push([
                        DIFF_EQUAL,
                        nullPadding
                    ]);
                    patch.length1 += paddingLength;
                    patch.length2 += paddingLength;
                } else if (paddingLength > diffs[diffs.length - 1][1].length) {
                    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
                    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
                    patch.length1 += extraLength;
                    patch.length2 += extraLength;
                }
                return nullPadding;
            };
            diff_match_patch.prototype.patch_splitMax = function (patches) {
                var patch_size = this.Match_MaxBits;
                for (var x = 0; x < patches.length; x++) {
                    if (patches[x].length1 <= patch_size) {
                        continue;
                    }
                    var bigpatch = patches[x];
                    patches.splice(x--, 1);
                    var start1 = bigpatch.start1;
                    var start2 = bigpatch.start2;
                    var precontext = '';
                    while (bigpatch.diffs.length !== 0) {
                        var patch = new diff_match_patch.patch_obj();
                        var empty = true;
                        patch.start1 = start1 - precontext.length;
                        patch.start2 = start2 - precontext.length;
                        if (precontext !== '') {
                            patch.length1 = patch.length2 = precontext.length;
                            patch.diffs.push([
                                DIFF_EQUAL,
                                precontext
                            ]);
                        }
                        while (bigpatch.diffs.length !== 0 && patch.length1 < patch_size - this.Patch_Margin) {
                            var diff_type = bigpatch.diffs[0][0];
                            var diff_text = bigpatch.diffs[0][1];
                            if (diff_type === DIFF_INSERT) {
                                patch.length2 += diff_text.length;
                                start2 += diff_text.length;
                                patch.diffs.push(bigpatch.diffs.shift());
                                empty = false;
                            } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 && patch.diffs[0][0] == DIFF_EQUAL && diff_text.length > 2 * patch_size) {
                                patch.length1 += diff_text.length;
                                start1 += diff_text.length;
                                empty = false;
                                patch.diffs.push([
                                    diff_type,
                                    diff_text
                                ]);
                                bigpatch.diffs.shift();
                            } else {
                                diff_text = diff_text.substring(0, patch_size - patch.length1 - this.Patch_Margin);
                                patch.length1 += diff_text.length;
                                start1 += diff_text.length;
                                if (diff_type === DIFF_EQUAL) {
                                    patch.length2 += diff_text.length;
                                    start2 += diff_text.length;
                                } else {
                                    empty = false;
                                }
                                patch.diffs.push([
                                    diff_type,
                                    diff_text
                                ]);
                                if (diff_text == bigpatch.diffs[0][1]) {
                                    bigpatch.diffs.shift();
                                } else {
                                    bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(diff_text.length);
                                }
                            }
                        }
                        precontext = this.diff_text2(patch.diffs);
                        precontext = precontext.substring(precontext.length - this.Patch_Margin);
                        var postcontext = this.diff_text1(bigpatch.diffs).substring(0, this.Patch_Margin);
                        if (postcontext !== '') {
                            patch.length1 += postcontext.length;
                            patch.length2 += postcontext.length;
                            if (patch.diffs.length !== 0 && patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
                                patch.diffs[patch.diffs.length - 1][1] += postcontext;
                            } else {
                                patch.diffs.push([
                                    DIFF_EQUAL,
                                    postcontext
                                ]);
                            }
                        }
                        if (!empty) {
                            patches.splice(++x, 0, patch);
                        }
                    }
                }
            };
            diff_match_patch.prototype.patch_toText = function (patches) {
                var text = [];
                for (var x = 0; x < patches.length; x++) {
                    text[x] = patches[x];
                }
                return text.join('');
            };
            diff_match_patch.prototype.patch_fromText = function (textline) {
                var patches = [];
                if (!textline) {
                    return patches;
                }
                var text = textline.split('\n');
                var textPointer = 0;
                var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
                while (textPointer < text.length) {
                    var m = text[textPointer].match(patchHeader);
                    if (!m) {
                        throw new Error('Invalid patch string: ' + text[textPointer]);
                    }
                    var patch = new diff_match_patch.patch_obj();
                    patches.push(patch);
                    patch.start1 = parseInt(m[1], 10);
                    if (m[2] === '') {
                        patch.start1--;
                        patch.length1 = 1;
                    } else if (m[2] == '0') {
                        patch.length1 = 0;
                    } else {
                        patch.start1--;
                        patch.length1 = parseInt(m[2], 10);
                    }
                    patch.start2 = parseInt(m[3], 10);
                    if (m[4] === '') {
                        patch.start2--;
                        patch.length2 = 1;
                    } else if (m[4] == '0') {
                        patch.length2 = 0;
                    } else {
                        patch.start2--;
                        patch.length2 = parseInt(m[4], 10);
                    }
                    textPointer++;
                    while (textPointer < text.length) {
                        var sign = text[textPointer].charAt(0);
                        try {
                            var line = decodeURI(text[textPointer].substring(1));
                        } catch (ex) {
                            throw new Error('Illegal escape in patch_fromText: ' + line);
                        }
                        if (sign == '-') {
                            patch.diffs.push([
                                DIFF_DELETE,
                                line
                            ]);
                        } else if (sign == '+') {
                            patch.diffs.push([
                                DIFF_INSERT,
                                line
                            ]);
                        } else if (sign == ' ') {
                            patch.diffs.push([
                                DIFF_EQUAL,
                                line
                            ]);
                        } else if (sign == '@') {
                            break;
                        } else if (sign === '') {
                        } else {
                            throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
                        }
                        textPointer++;
                    }
                }
                return patches;
            };
            diff_match_patch.patch_obj = function () {
                this.diffs = [];
                this.start1 = null;
                this.start2 = null;
                this.length1 = 0;
                this.length2 = 0;
            };
            diff_match_patch.patch_obj.prototype.toString = function () {
                var coords1, coords2;
                if (this.length1 === 0) {
                    coords1 = this.start1 + ',0';
                } else if (this.length1 == 1) {
                    coords1 = this.start1 + 1;
                } else {
                    coords1 = this.start1 + 1 + ',' + this.length1;
                }
                if (this.length2 === 0) {
                    coords2 = this.start2 + ',0';
                } else if (this.length2 == 1) {
                    coords2 = this.start2 + 1;
                } else {
                    coords2 = this.start2 + 1 + ',' + this.length2;
                }
                var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
                var op;
                for (var x = 0; x < this.diffs.length; x++) {
                    switch (this.diffs[x][0]) {
                    case DIFF_INSERT:
                        op = '+';
                        break;
                    case DIFF_DELETE:
                        op = '-';
                        break;
                    case DIFF_EQUAL:
                        op = ' ';
                        break;
                    }
                    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
                }
                return text.join('').replace(/%20/g, ' ');
            };
            this['diff_match_patch'] = diff_match_patch;
            this['DIFF_DELETE'] = DIFF_DELETE;
            this['DIFF_INSERT'] = DIFF_INSERT;
            this['DIFF_EQUAL'] = DIFF_EQUAL;
        },
        {}
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            var has = Object.prototype.hasOwnProperty;
            var toStr = Object.prototype.toString;
            var isArgs = require('./isArguments');
            var hasDontEnumBug = !{ 'toString': null }.propertyIsEnumerable('toString');
            var hasProtoEnumBug = function () {
            }.propertyIsEnumerable('prototype');
            var dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];
            var keysShim = function keys(object) {
                var isObject = object !== null && typeof object === 'object';
                var isFunction = toStr.call(object) === '[object Function]';
                var isArguments = isArgs(object);
                var isString = isObject && toStr.call(object) === '[object String]';
                var theKeys = [];
                if (!isObject && !isFunction && !isArguments) {
                    throw new TypeError('Object.keys called on a non-object');
                }
                var skipProto = hasProtoEnumBug && isFunction;
                if (isString && object.length > 0 && !has.call(object, 0)) {
                    for (var i = 0; i < object.length; ++i) {
                        theKeys.push(String(i));
                    }
                }
                if (isArguments && object.length > 0) {
                    for (var j = 0; j < object.length; ++j) {
                        theKeys.push(String(j));
                    }
                } else {
                    for (var name in object) {
                        if (!(skipProto && name === 'prototype') && has.call(object, name)) {
                            theKeys.push(String(name));
                        }
                    }
                }
                if (hasDontEnumBug) {
                    var ctor = object.constructor;
                    var skipConstructor = ctor && ctor.prototype === object;
                    for (var k = 0; k < dontEnums.length; ++k) {
                        if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
                            theKeys.push(dontEnums[k]);
                        }
                    }
                }
                return theKeys;
            };
            keysShim.shim = function shimObjectKeys() {
                if (!Object.keys) {
                    Object.keys = keysShim;
                }
                return Object.keys || keysShim;
            };
            module.exports = keysShim;
        },
        { './isArguments': 43 }
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            var toStr = Object.prototype.toString;
            module.exports = function isArguments(value) {
                var str = toStr.call(value);
                var isArgs = str === '[object Arguments]';
                if (!isArgs) {
                    isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
                }
                return isArgs;
            };
        },
        {}
    ],
    44: [
        function (require, module, exports) {
            'use strict';
            var traverse = require('traverse'), typeName = require('type-name'), extend = require('xtend'), s = require('./strategies');
            function defaultHandlers() {
                return {
                    'null': s.always('null'),
                    'undefined': s.always('undefined'),
                    'function': s.prune(),
                    'string': s.json(),
                    'boolean': s.json(),
                    'number': s.number(),
                    'RegExp': s.toStr(),
                    'String': s.newLike(),
                    'Boolean': s.newLike(),
                    'Number': s.newLike(),
                    'Date': s.newLike(),
                    'Array': s.array(),
                    'Object': s.object(),
                    '@default': s.object()
                };
            }
            function defaultOptions() {
                return {
                    maxDepth: null,
                    indent: null,
                    anonymous: '@Anonymous',
                    circular: '#@Circular#',
                    snip: '..(snip)',
                    lineSeparator: '\n',
                    typeFun: typeName
                };
            }
            function createStringifier(customOptions) {
                var options = extend(defaultOptions(), customOptions), handlers = extend(defaultHandlers(), options.handlers);
                return function stringifyAny(push, x) {
                    var context = this, handler = handlerFor(context.node, options, handlers), currentPath = '/' + context.path.join('/'), customization = handlers[currentPath], acc = {
                            context: context,
                            options: options,
                            handlers: handlers,
                            push: push
                        };
                    if (typeName(customization) === 'function') {
                        handler = customization;
                    } else if (typeName(customization) === 'number') {
                        handler = s.flow.compose(s.filters.truncate(customization), handler);
                    }
                    handler(acc, x);
                    return push;
                };
            }
            function handlerFor(val, options, handlers) {
                var tname = options.typeFun(val);
                if (typeName(handlers[tname]) === 'function') {
                    return handlers[tname];
                }
                return handlers['@default'];
            }
            function walk(val, reducer) {
                var buffer = [], push = function (str) {
                        buffer.push(str);
                    };
                traverse(val).reduce(reducer, push);
                return buffer.join('');
            }
            function stringify(val, options) {
                return walk(val, createStringifier(options));
            }
            function stringifier(options) {
                return function (val) {
                    return walk(val, createStringifier(options));
                };
            }
            stringifier.stringify = stringify;
            stringifier.strategies = s;
            stringifier.defaultOptions = defaultOptions;
            stringifier.defaultHandlers = defaultHandlers;
            module.exports = stringifier;
        },
        {
            './strategies': 46,
            'traverse': 45,
            'type-name': 47,
            'xtend': 48
        }
    ],
    45: [
        function (require, module, exports) {
            module.exports = require(22);
        },
        { '/Users/matsu_chara/Documents/sand/knock-sample/node_modules/power-assert/node_modules/empower/node_modules/escallmatch/node_modules/espurify/node_modules/traverse/index.js': 22 }
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            var typeName = require('type-name'), slice = Array.prototype.slice, END = {}, ITERATE = {};
            function compose() {
                var filters = slice.apply(arguments);
                return filters.reduceRight(function (right, left) {
                    return left(right);
                });
            }
            function end() {
                return function (acc, x) {
                    acc.context.keys = [];
                    return END;
                };
            }
            function iterate() {
                return function (acc, x) {
                    return ITERATE;
                };
            }
            function filter(predicate) {
                return function (next) {
                    return function (acc, x) {
                        var toBeIterated, isIteratingArray = typeName(x) === 'Array';
                        if (typeName(predicate) === 'function') {
                            toBeIterated = [];
                            acc.context.keys.forEach(function (key) {
                                var indexOrKey = isIteratingArray ? parseInt(key, 10) : key, kvp = {
                                        key: indexOrKey,
                                        value: x[key]
                                    }, decision = predicate(kvp);
                                if (decision) {
                                    toBeIterated.push(key);
                                }
                                if (typeName(decision) === 'number') {
                                    truncateByKey(decision, key, acc);
                                }
                                if (typeName(decision) === 'function') {
                                    customizeStrategyForKey(decision, key, acc);
                                }
                            });
                            acc.context.keys = toBeIterated;
                        }
                        return next(acc, x);
                    };
                };
            }
            function customizeStrategyForKey(strategy, key, acc) {
                acc.handlers[currentPath(key, acc)] = strategy;
            }
            function truncateByKey(size, key, acc) {
                acc.handlers[currentPath(key, acc)] = size;
            }
            function currentPath(key, acc) {
                var pathToCurrentNode = [''].concat(acc.context.path);
                if (typeName(key) !== 'undefined') {
                    pathToCurrentNode.push(key);
                }
                return pathToCurrentNode.join('/');
            }
            function allowedKeys(orderedWhiteList) {
                return function (next) {
                    return function (acc, x) {
                        var isIteratingArray = typeName(x) === 'Array';
                        if (!isIteratingArray && typeName(orderedWhiteList) === 'Array') {
                            acc.context.keys = orderedWhiteList.filter(function (propKey) {
                                return acc.context.keys.indexOf(propKey) !== -1;
                            });
                        }
                        return next(acc, x);
                    };
                };
            }
            function safeKeys() {
                return function (next) {
                    return function (acc, x) {
                        if (typeName(x) !== 'Array') {
                            acc.context.keys = acc.context.keys.filter(function (propKey) {
                                try {
                                    var val = x[propKey];
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            });
                        }
                        return next(acc, x);
                    };
                };
            }
            function when(guard, then) {
                return function (next) {
                    return function (acc, x) {
                        var kvp = {
                            key: acc.context.key,
                            value: x
                        };
                        if (guard(kvp, acc)) {
                            return then(acc, x);
                        }
                        return next(acc, x);
                    };
                };
            }
            function truncate(size) {
                return function (next) {
                    return function (acc, x) {
                        var orig = acc.push, ret;
                        acc.push = function (str) {
                            var savings = str.length - size, truncated;
                            if (savings <= size) {
                                orig.call(acc, str);
                            } else {
                                truncated = str.substring(0, size);
                                orig.call(acc, truncated + acc.options.snip);
                            }
                        };
                        ret = next(acc, x);
                        acc.push = orig;
                        return ret;
                    };
                };
            }
            function constructorName() {
                return function (next) {
                    return function (acc, x) {
                        var name = acc.options.typeFun(x);
                        if (name === '') {
                            name = acc.options.anonymous;
                        }
                        acc.push(name);
                        return next(acc, x);
                    };
                };
            }
            function always(str) {
                return function (next) {
                    return function (acc, x) {
                        acc.push(str);
                        return next(acc, x);
                    };
                };
            }
            function optionValue(key) {
                return function (next) {
                    return function (acc, x) {
                        acc.push(acc.options[key]);
                        return next(acc, x);
                    };
                };
            }
            function json(replacer) {
                return function (next) {
                    return function (acc, x) {
                        acc.push(JSON.stringify(x, replacer));
                        return next(acc, x);
                    };
                };
            }
            function toStr() {
                return function (next) {
                    return function (acc, x) {
                        acc.push(x.toString());
                        return next(acc, x);
                    };
                };
            }
            function decorateArray() {
                return function (next) {
                    return function (acc, x) {
                        acc.context.before(function (node) {
                            acc.push('[');
                        });
                        acc.context.after(function (node) {
                            afterAllChildren(this, acc.push, acc.options);
                            acc.push(']');
                        });
                        acc.context.pre(function (val, key) {
                            beforeEachChild(this, acc.push, acc.options);
                        });
                        acc.context.post(function (childContext) {
                            afterEachChild(childContext, acc.push);
                        });
                        return next(acc, x);
                    };
                };
            }
            function decorateObject() {
                return function (next) {
                    return function (acc, x) {
                        acc.context.before(function (node) {
                            acc.push('{');
                        });
                        acc.context.after(function (node) {
                            afterAllChildren(this, acc.push, acc.options);
                            acc.push('}');
                        });
                        acc.context.pre(function (val, key) {
                            beforeEachChild(this, acc.push, acc.options);
                            acc.push(sanitizeKey(key) + (acc.options.indent ? ': ' : ':'));
                        });
                        acc.context.post(function (childContext) {
                            afterEachChild(childContext, acc.push);
                        });
                        return next(acc, x);
                    };
                };
            }
            function sanitizeKey(key) {
                return /^[A-Za-z_]+$/.test(key) ? key : JSON.stringify(key);
            }
            function afterAllChildren(context, push, options) {
                if (options.indent && 0 < context.keys.length) {
                    push(options.lineSeparator);
                    for (var i = 0; i < context.level; i += 1) {
                        push(options.indent);
                    }
                }
            }
            function beforeEachChild(context, push, options) {
                if (options.indent) {
                    push(options.lineSeparator);
                    for (var i = 0; i <= context.level; i += 1) {
                        push(options.indent);
                    }
                }
            }
            function afterEachChild(childContext, push) {
                if (!childContext.isLast) {
                    push(',');
                }
            }
            function nan(kvp, acc) {
                return kvp.value !== kvp.value;
            }
            function positiveInfinity(kvp, acc) {
                return !isFinite(kvp.value) && kvp.value === Infinity;
            }
            function negativeInfinity(kvp, acc) {
                return !isFinite(kvp.value) && kvp.value !== Infinity;
            }
            function circular(kvp, acc) {
                return acc.context.circular;
            }
            function maxDepth(kvp, acc) {
                return acc.options.maxDepth && acc.options.maxDepth <= acc.context.level;
            }
            var prune = compose(always('#'), constructorName(), always('#'), end());
            var omitNaN = when(nan, compose(always('NaN'), end()));
            var omitPositiveInfinity = when(positiveInfinity, compose(always('Infinity'), end()));
            var omitNegativeInfinity = when(negativeInfinity, compose(always('-Infinity'), end()));
            var omitCircular = when(circular, compose(optionValue('circular'), end()));
            var omitMaxDepth = when(maxDepth, prune);
            module.exports = {
                filters: {
                    always: always,
                    constructorName: constructorName,
                    json: json,
                    toStr: toStr,
                    prune: prune,
                    truncate: truncate,
                    decorateArray: decorateArray,
                    decorateObject: decorateObject
                },
                flow: {
                    compose: compose,
                    when: when,
                    allowedKeys: allowedKeys,
                    safeKeys: safeKeys,
                    filter: filter,
                    iterate: iterate,
                    end: end
                },
                symbols: {
                    END: END,
                    ITERATE: ITERATE
                },
                always: function (str) {
                    return compose(always(str), end());
                },
                json: function () {
                    return compose(json(), end());
                },
                toStr: function () {
                    return compose(toStr(), end());
                },
                prune: function () {
                    return prune;
                },
                number: function () {
                    return compose(omitNaN, omitPositiveInfinity, omitNegativeInfinity, json(), end());
                },
                newLike: function () {
                    return compose(always('new '), constructorName(), always('('), json(), always(')'), end());
                },
                array: function (predicate) {
                    return compose(omitCircular, omitMaxDepth, decorateArray(), filter(predicate), iterate());
                },
                object: function (predicate, orderedWhiteList) {
                    return compose(omitCircular, omitMaxDepth, constructorName(), decorateObject(), allowedKeys(orderedWhiteList), safeKeys(), filter(predicate), iterate());
                }
            };
        },
        { 'type-name': 47 }
    ],
    47: [
        function (require, module, exports) {
            'use strict';
            var toStr = Object.prototype.toString;
            function funcName(f) {
                return f.name ? f.name : /^\s*function\s*([^\(]*)/im.exec(f.toString())[1];
            }
            function ctorName(obj) {
                var strName = toStr.call(obj).slice(8, -1);
                if (strName === 'Object' && obj.constructor) {
                    return funcName(obj.constructor);
                }
                return strName;
            }
            function typeName(val) {
                var type;
                if (val === null) {
                    return 'null';
                }
                type = typeof val;
                if (type === 'object') {
                    return ctorName(val);
                }
                return type;
            }
            module.exports = typeName;
        },
        {}
    ],
    48: [
        function (require, module, exports) {
            module.exports = extend;
            function extend() {
                var target = {};
                for (var i = 0; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            }
        },
        {}
    ],
    49: [
        function (require, module, exports) {
            module.exports = extend;
            function extend(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            }
        },
        {}
    ],
    50: [
        function (require, module, exports) {
            var ToDo, moment;
            moment = require('./../../bower_components/moment/moment.js');
            ToDo = function () {
                function ToDo(text1, deadlineString) {
                    this.text = text1;
                    this.deadline = moment(Date.parse(deadlineString));
                    if (!this.constructor.validate(this.text, deadlineString)) {
                        console.warn('invalid ToDo object was generated.');
                        return;
                    }
                }
                ToDo.validate = function (text, deadlineString) {
                    if (text.length === 0) {
                        return false;
                    }
                    if (isNaN(Date.parse(deadlineString))) {
                        return false;
                    }
                    return true;
                };
                return ToDo;
            }();
            module.exports = ToDo;
        },
        { './../../bower_components/moment/moment.js': 7 }
    ],
    51: [
        function (require, module, exports) {
            var ToDo, assert, moment;
            assert = require('power-assert');
            moment = require('./../../bower_components/moment/moment.js');
            ToDo = require('../../src/ToDoList/ToDo');
            describe('ToDo', function () {
                var t;
                t = new ToDo('test_task', '1/1 1:11');
                it('should be able to instantiate', function () {
                    return assert(assert._expr(assert._capt(assert._capt(t, 'arguments/0/left') !== null, 'arguments/0'), {
                        content: 'assert(t !== null)',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14772
                    }));
                });
                it('has text', function () {
                    return assert(assert._expr(assert._capt(assert._capt(assert._capt(t, 'arguments/0/left/object').text, 'arguments/0/left') === 'test_task', 'arguments/0'), {
                        content: 'assert(t.text === "test_task")',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14775
                    }));
                });
                it('has deadline', function () {
                    return assert(assert._expr(assert._capt(assert._capt(assert._capt(t, 'arguments/0/callee/object/object').deadline, 'arguments/0/callee/object').isSame(assert._capt(moment(assert._capt(assert._capt(Date, 'arguments/0/arguments/0/arguments/0/callee/object').parse('1/1 1:11'), 'arguments/0/arguments/0/arguments/0')), 'arguments/0/arguments/0')), 'arguments/0'), {
                        content: 'assert(t.deadline.isSame(moment(Date.parse("1/1 1:11"))))',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14778
                    }));
                });
                it('has not deadline string', function () {
                    return assert(assert._expr(assert._capt(assert._capt(typeof assert._capt(assert._capt(t, 'arguments/0/left/argument/object').deadline, 'arguments/0/left/argument'), 'arguments/0/left') !== 'string', 'arguments/0'), {
                        content: 'assert(typeof t.deadline !== "string")',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14781
                    }));
                });
                it('validate parmeter', function () {
                    return assert(assert._expr(assert._capt(assert._capt(assert._capt(ToDo, 'arguments/0/left/callee/object').validate('test_task', '1/1 1:11'), 'arguments/0/left') === true, 'arguments/0'), {
                        content: 'assert(ToDo.validate("test_task", "1/1 1:11") === true)',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14784
                    }));
                });
                it('invalid empty text', function () {
                    return assert(assert._expr(assert._capt(assert._capt(assert._capt(ToDo, 'arguments/0/left/callee/object').validate('', '1/1 1:11'), 'arguments/0/left') === false, 'arguments/0'), {
                        content: 'assert(ToDo.validate("", "1/1 1:11") === false)',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14787
                    }));
                });
                it('invalid non-date string', function () {
                    return assert(assert._expr(assert._capt(assert._capt(assert._capt(ToDo, 'arguments/0/left/callee/object').validate('test_task', 'invalid string'), 'arguments/0/left') === false, 'arguments/0'), {
                        content: 'assert(ToDo.validate("test_task", "invalid string") === false)',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14790
                    }));
                });
                return it('can generate (wrongful) instance by invalid parameter', function () {
                    return assert(assert._expr(assert._capt(assert._capt(assert._capt(ToDo, 'arguments/0/left/callee/object').validate('', 'invalid string'), 'arguments/0/left') !== null, 'arguments/0'), {
                        content: 'assert(ToDo.validate("", "invalid string") !== null)',
                        filepath: '/Users/matsu_chara/Documents/sand/knock-sample/test/ToDoList/ToDo.coffee',
                        line: 14793
                    }));
                });
            });
        },
        {
            '../../src/ToDoList/ToDo': 50,
            './../../bower_components/moment/moment.js': 7,
            'power-assert': 8
        }
    ]
}, {}, [51]));