"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var new_array_1 = __importDefault(require("./new-array"));
var definereactive_1 = require("./definereactive");
var utils_1 = require("./utils");
var dep_1 = require("./dep");
var observe_1 = require("./observe");
/**
 * 观察者给对象添加观察者
 *
 */
var Observer = /** @class */ (function () {
    function Observer(data) {
        this.dep = new dep_1.Dep();
        utils_1.def(data, '__ob__', false, this);
        if (Array.isArray(data)) {
            Object.setPrototypeOf(data, new_array_1.default(data));
            // data.__proto__ === newArray
            this.walkArray(data);
        }
        else {
            this.walk(data);
        }
    }
    /**
     * 遍历对象的所有key
     * @param { any } obj
     */
    Observer.prototype.walk = function (obj) {
        for (var key in obj) {
            // 对子属性逐个添加响应式和观察者对象
            definereactive_1.defineReactive(obj, key);
        }
    };
    Observer.prototype.walkArray = function (data) {
        for (var i = 0; i < data.length; i++) {
            observe_1.observe(data[i]);
        }
    };
    return Observer;
}());
exports.default = Observer;
