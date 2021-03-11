"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dep = void 0;
var uid = 0;
function staticImplements() {
    return function (constructor) { constructor; };
}
var Dep = /** @class */ (function () {
    function Dep() {
        // 存放订阅者
        this.subs = [];
        this.id = ++uid;
    }
    Dep_1 = Dep;
    // 添加订阅
    Dep.prototype.addSub = function (watcher) {
        this.subs.push(watcher);
    };
    // 添加依赖
    Dep.prototype.depend = function () {
        // 此时使用了这个数据的watcher被放到了全局唯一target，只要调用了watcher就能出发数据的getter
        if (Dep_1.target) {
            // 访问了该数据, 此时的subs为空，target为第一个watcher，不会发生重复
            this.addSub(Dep_1.target);
        }
    };
    // 通知更新
    Dep.prototype.notify = function () {
        // 遍历更新
        for (var i = 0; i < this.subs.length; i++) {
            console.log('调用了notify');
            console.log(this.subs);
            // return 
            this.subs[i].update();
        }
    };
    var Dep_1;
    Dep = Dep_1 = __decorate([
        staticImplements()
    ], Dep);
    return Dep;
}());
exports.Dep = Dep;
