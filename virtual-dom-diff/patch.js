"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domApi_1 = require("./domApi");
var toVnode_1 = require("./toVnode");
/**
 * 判断是否是同一节点
 * @param { VNode } oldNode
 * @param { VNode } newNode
 * @returns { Boolean }
 */
function isSameNode(oldNode, newNode) {
    return oldNode.key === newNode.key && oldNode.sel === newNode.sel;
}
exports.isSameNode = isSameNode;
/**
 * 专注于生成DOM
 * 对虚拟节点进行判断 纯文本、存在子元素
 * @param { VNode } newNode
 * @param { Element } elm
 * @return { null }
 */
function createDOM(node) {
    // 生成DOM
    var element;
    var text = node.text;
    var dataSetLength = Object.keys(node.data).length;
    if (node.sel === '!') {
        // 为注释节点
        element = domApi_1.domAPI.createCommentNode(text);
    }
    else if (node.sel === undefined) {
        // 为文本节点
        element = domApi_1.domAPI.createTextNode(text);
    }
    else {
        // 为元素节点
        element = domApi_1.domAPI.createElementNode(node.sel);
        var children = node.children;
        element.nodeValue = text ? text : '';
        if (children.length > 0) {
            children.map(function (e) {
                // 递归处理存在子元素的dom
                domApi_1.domAPI.appendChild(element, createDOM(e));
                return e;
            });
        }
        else {
            domApi_1.domAPI.appendChild(element, domApi_1.domAPI.createTextNode(text));
        }
    }
    if (dataSetLength > 0) {
        var key = void 0;
        for (key in node.data) {
            element.setAttribute(key, node.data[key]);
        }
    }
    return element;
}
exports.createDOM = createDOM;
/**
 * 添加到DOMTree上
 * @param { Element | Node } parentNode
 * @param { Element | Node } newDOM
 * @param { Element | Node } oldDOM
 */
function addToDOMTree(parentNode, newDOM, oldNode) {
    domApi_1.domAPI.insertBefore(parentNode, newDOM, oldNode);
    domApi_1.domAPI.removeChildNode(parentNode, oldNode);
}
exports.addToDOMTree = addToDOMTree;
/**
 * 打补丁
 * @param { any } oldNode
 * @param { any } newNode
 * @return { null }
 */
function patch(oldNode, newNode) {
    var parent = domApi_1.domAPI.parentNode(oldNode);
    if (!parent)
        throw new Error('parentNode不能为null');
    // 判断是否为第一次上树
    if (oldNode instanceof Element)
        oldNode = toVnode_1.toVnode(oldNode);
    // 判断是否是同一节点
    newNode.elm = oldNode.elm;
    if (isSameNode(oldNode, newNode)) {
        // diff()
    }
    else {
        // 如果是不同的节点，直接替换
        addToDOMTree(parent, createDOM(newNode), oldNode.elm);
    }
}
exports.patch = patch;
