"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.observe = void 0;
var observer_1 = __importDefault(require("./observer"));
/**
 * 判断是否有观察者，没有则创建
 * @param { any } data
 */
function observe(data) {
    if (typeof data !== 'object') {
        return;
    }
    return data.__ob__ ? data.__ob__ : new observer_1.default(data);
}
exports.observe = observe;
