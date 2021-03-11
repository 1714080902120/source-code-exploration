"use strict";
/**
 * 继承Array, 让数据中是数组的元素的原型链指向newArray
 */
Object.defineProperty(exports, "__esModule", { value: true });
var observe_1 = require("./observe");
var utils_1 = require("./utils");
var ArrayProto = Array.prototype;
var someNewArrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
function default_1(data) {
    // newArray.__proto__ === Array.prototype
    var newArray = Object.create(ArrayProto);
    someNewArrayMethods.forEach(function (method) {
        var originalMethod = ArrayProto[method];
        utils_1.def(newArray, method, false, function () {
            console.log('监听到数组变化', arguments);
            if (new Array('push', 'unshift', 'splice').includes(method)) {
                for (var i = method === 'splice' ? 2 : 0; i < arguments.length; i++) {
                    observe_1.observe(arguments[i]);
                }
                var result = originalMethod.apply(data, arguments);
                data.__ob__.dep.notify();
                return result;
            }
            return originalMethod.apply(data, arguments);
        });
    });
    return newArray;
}
exports.default = default_1;
