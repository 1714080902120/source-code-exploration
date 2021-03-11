"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineReactive = void 0;
var dep_1 = require("./dep");
var observe_1 = require("./observe");
/**
 * 采用闭包环境存储变量值, 给对象的字段添加响应式
 * @param { object } obj 对象
 * @param { string | number | symbol } key 字段
 * @return { void }
 */
function defineReactive(obj, key) {
    // 初始值
    var val = obj[key];
    // 这里传入的是子键值
    var childOB = observe_1.observe(val);
    // Dep
    var dep = new dep_1.Dep();
    // 调用observe确保所有属性都绑定了响应式及观察者对象
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        // 访问
        get: function () {
            // console.log(`访问了属性${key as string}, 值为：` + val)
            // 此时如果访问该数据发现target不为null，则开始收集依赖
            if (dep_1.Dep.target) {
                dep.depend();
                if (childOB) {
                    childOB.dep.depend();
                }
            }
            return val;
        },
        // 赋值
        set: function (newVal) {
            // console.log(`赋值给了属性${key as string}, 值为：` + newVal)
            if (newVal === val)
                return;
            val = newVal;
            childOB = observe_1.observe(newVal);
            // 通知所有watcher更新
            dep.notify();
        }
    });
}
exports.defineReactive = defineReactive;
