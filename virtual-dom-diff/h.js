"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var is = __importStar(require("./is"));
function h(sel, b, c) {
    var data = {};
    var children = [];
    var text;
    // 第四种情况 当第三个参数不为undefined时
    if (c !== undefined) {
        // 判断C类型
        if (is.isPrimitive(c)) {
            // 当C为text时
            text = c;
        }
        else if (is.isArray(c)) {
            // C为数组
            children = c;
        }
        else if (c && c.sel !== undefined) {
            children = [c];
        }
        // 判断第二个参数
        if (b !== null) {
            // b不为null时
            data = b;
        }
    }
    else if (b !== undefined && b !== null) {
        if (is.isArray(b)) {
            children = b;
        }
        else if (b && b.sel !== undefined) {
            children = [b];
        }
        else if (is.isPrimitive(b)) {
            text = b;
        }
        else {
            data = b;
        }
    }
    // 获取完数据后对数据进行处理
    // 如果children里的元素是一个字符串或者数字，对他进行vnode包装
    if (children) {
        children = children.map(function (e) {
            if (is.isPrimitive(e)) {
                return vnode_1.vnode(undefined, undefined, undefined, e, undefined);
            }
            return e;
        });
    }
    return vnode_1.vnode(sel, data, children, text, undefined);
}
exports.h = h;
