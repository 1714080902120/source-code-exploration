"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 判断是否为数组
 * @param { any } arr
 * @return { Boolean }
 */
exports.isArray = Array.isArray;
/**
 * 判断一个变量是否为基础类型string或者number
 * @param { any } s
 * @return { boolean }
 */
function isPrimitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.isPrimitive = isPrimitive;
