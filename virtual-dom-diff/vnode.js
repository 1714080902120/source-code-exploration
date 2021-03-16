"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    return {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: data === undefined ? undefined : data.key
    };
}
exports.vnode = vnode;
