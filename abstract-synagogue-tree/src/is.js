"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is = void 0;
var selfClosingTag = ['meta', 'link', 'base', 'br', 'hr', 'input', 'img'];
/**
 * 判断是否是字符串或者数字
 * @param { any } value
 * @returns { boolean }
 */
function isArray(value) {
    return Array.isArray(value);
}
/**
 * 判断是否是自闭和标签
 * @param { string } tagName
 * @returns { boolean }
 */
function isSelfClosingTag(tagName) {
    return selfClosingTag.indexOf(tagName) !== -1;
}
exports.is = {
    isArray: isArray,
    isSelfClosingTag: isSelfClosingTag
};
