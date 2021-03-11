"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePath = exports.def = void 0;
/**
 * 将观察者__ob__设置为不可枚举
 * @param { object } obj
 */
function def(obj, key, enumerable, value) {
    Object.defineProperty(obj, key, {
        enumerable: enumerable,
        writable: true,
        configurable: true,
        value: value
    });
}
exports.def = def;
/**
 * 高阶函数
 * 返回一个函数
 * @param { string } expression
 * @return { Function } (obj: Object) => any
 */
function parsePath(expression) {
    var arr = expression.split('.');
    return function (obj) {
        try {
            return arr.reduce(function (before, current) {
                return before[current];
            }, obj);
        }
        catch (error) {
            throw new Error('该对象下并没有该属性');
        }
    };
}
exports.parsePath = parsePath;
