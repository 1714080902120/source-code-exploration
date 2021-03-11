"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watcher = void 0;
var dep_1 = require("./dep");
var utils_1 = require("./utils");
var uid = 0;
var Watcher = /** @class */ (function () {
    function Watcher(obj, expression, callback) {
        this.id = uid++;
        this.obj = obj;
        this.getter = utils_1.parsePath(expression);
        this.callback = callback;
        dep_1.Dep.target = this;
        this.value = this.get();
        dep_1.Dep.target = null;
    }
    Watcher.prototype.update = function () {
        // 触发更新，执行回调
        this.run();
    };
    Watcher.prototype.get = function () {
        // 当需要更新时，将全局的target指向当前这个watcher
        // 初始化时获取该值并将全局target指向null
        return this.getter(this.obj);
    };
    Watcher.prototype.run = function () {
        this.getAndInvoke(this.callback);
    };
    /**
     * 唤起回调
     * 调用属性的getter获取最新的值, 对比前后两个数据，如果不同将执行回调
     * 对象一律执行回调
     * @param { Function | null } cb
     */
    Watcher.prototype.getAndInvoke = function (cb) {
        var value = this.get();
        if (value !== this.value || typeof value === 'object') {
            var oldValue = this.value;
            this.value = value;
            cb.call(this.obj, this.value, oldValue);
        }
    };
    return Watcher;
}());
exports.Watcher = Watcher;
