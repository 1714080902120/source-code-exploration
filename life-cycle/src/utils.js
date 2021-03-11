"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
/**
 * 判断是否是Array
 * @param { any } value
 * @returns
 */
function isArray(value) {
    return Array.isArray(value);
}
/**
 * 抛出错误
 * @param { string } errStr
 */
function error(errStr) {
    throw new Error(errStr);
}
/**
 * appendChild
 * @param { Node } parentNode
 * @param { Node } childNode
 */
function appendChild(parentNode, childNode) {
    parentNode.appendChild(childNode);
}
/**
 * removeChild
 * @param { Node } parentNode
 * @param { Node } childNode
 */
function removeChild(parentNode, childNode) {
    parentNode.removeChild(childNode);
}
/**
 * insertBefore
 * @param { Node } parentNode
 * @param { Node } newChildNode
 * @param {  Node } oldChildNode
 */
function insertBefore(parentNode, newChildNode, oldChildNode) {
    parentNode.insertBefore(newChildNode, oldChildNode);
}
/**
 * @param { string } sel
 * @param { any } data
 * @param { VNode[] } children
 * @param { VNode } vnode
 * @returns
 */
function createElementNode(sel, data) {
    const element = document.createElement(sel);
    if (data.attr.length > 0) {
        for (let i = 0; i < data.attr.length; i++) {
            const attr = data.attr[i];
            const { nodeName, nodeValue } = attr;
            element.setAttribute(nodeName, nodeValue);
        }
    }
    return element;
}
/**
 * @param { Text } text
 * @returns
 */
function createTextNode(text) {
    return document.createTextNode(text);
}
/**
 * @param { Text } text
 * @returns
 */
function createCommentNode(text) {
    return document.createComment(text);
}
exports.utils = {
    isArray,
    error,
    appendChild,
    removeChild,
    insertBefore,
    createElementNode,
    createTextNode,
    createCommentNode,
};
