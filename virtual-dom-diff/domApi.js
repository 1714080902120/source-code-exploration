"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 获取dom元素的tagName
 * @param { Element } elm
 * @return { string }
 */
function tagName(elm) {
    return elm.tagName.toLowerCase();
}
/**
 * 生成Element元素
 * @param { string } tagName
 * @return { Element }
 */
function createElementNode(tagName) {
    return document.createElement(tagName);
}
/**
 * 生成TextNode元素
 * @param { string } text
 * @return { Text }
 */
function createTextNode(text) {
    return document.createTextNode(text);
}
/**
 * 生成注释节点
 * @param content
 * @return { Element | Node }
 */
function createCommentNode(content) {
    return document.createComment(content);
}
/**
 * 获取父元素
 * @param { Element | Text } elm
 * @return { Element }
 */
function parentNode(elm) {
    return elm === null ? null : elm.parentNode;
}
/**
 * 插入到父元素中
 * @param { Node } parentNode
 * @param { Element | Text } newNode
 */
function insertBefore(parentNode, newNode, oldNode) {
    parentNode.insertBefore(newNode, oldNode);
}
/**
 * 删除DOM
 * @param { Node } parentNode
 * @param { Node | null } node
 */
function removeChildNode(parentNode, node) {
    parentNode.removeChild(node);
}
/**
 * 增加元素
 * @param { Node | Element } parentNode
 * @param { Node | Element } childNode
 */
function appendChild(parentNode, childNode) {
    parentNode.appendChild(childNode);
}
/**
 * 获取文本节点的内容
 * @param { Node } node
 * @return { string }
 */
function getNodeText(node) {
    return node.nodeValue;
}
/**
 * 获取注释节点内容
 * @param { Node } node
 * @return { string }
 */
function getNodeComment(node) {
    return node.textContent;
}
exports.domAPI = {
    tagName: tagName,
    createElementNode: createElementNode,
    createTextNode: createTextNode,
    createCommentNode: createCommentNode,
    parentNode: parentNode,
    insertBefore: insertBefore,
    removeChildNode: removeChildNode,
    appendChild: appendChild,
    getNodeText: getNodeText,
    getNodeComment: getNodeComment
};
