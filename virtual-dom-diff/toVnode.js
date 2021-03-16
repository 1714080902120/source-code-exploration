"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domApi_1 = require("./domApi");
var vnode_1 = require("./vnode");
function toVnode(element) {
    var data;
    var sel;
    var attr;
    var children;
    var text;
    var elmAttrs = element.attributes;
    var childrenNodes = element.childNodes;
    // console.log(element.nodeType)
    // 判断节点的类型
    switch (element.nodeType) {
        // 元素节点
        case 1:
            sel = element.tagName.toLowerCase();
            children = [];
            data = {};
            attr = {};
            if (childrenNodes.length > 0) {
                for (var i = 0; i < childrenNodes.length; i++) {
                    children.push(toVnode(childrenNodes[i]));
                }
            }
            for (var key in elmAttrs) {
                attr[key] = elmAttrs[key];
            }
            for (var i = 0; i < elmAttrs.length; i++) {
                attr[elmAttrs[i].nodeName] = elmAttrs[i].nodeValue;
            }
            data = { attr: attr };
            break;
        // 文本节点
        case 3:
            text = domApi_1.domAPI.getNodeText(element);
            break;
        // 注释节点
        case 8:
            sel = '!';
            text = domApi_1.domAPI.getNodeComment(element);
            break;
        default:
            console.log('节点为非可接受节点' + JSON.stringify(element));
    }
    return vnode_1.vnode(sel, data, children, text, element);
}
exports.toVnode = toVnode;
