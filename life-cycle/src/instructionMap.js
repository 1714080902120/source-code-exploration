"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructionMap = void 0;
/**
 * 双向绑定
 */
function Model(newVal, oldVal) {
}
/**
 * 遍历
 */
function For(newVal, oldVal) { }
/**
 * 判断函数
 */
function If(newVal, oldVal) { }
/**
 * 添加Html片段
 */
function Html(newVal, oldVal) { }
exports.instructionMap = {
    model: Model,
    for: For,
    if: If,
    html: Html
};
