"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var watcher_1 = require("../reactive/watcher");
var Watch = /** @class */ (function () {
    function Watch(vm, watch) {
        this.vm = vm;
        if (watch && Object.keys(watch).length > 0) {
            this.createWatcher(watch);
        }
    }
    Watch.prototype.createWatcher = function (obj) {
        for (var key in obj) {
            var element = obj[key];
            if (element instanceof Function) {
                new watcher_1.Watcher(this.vm._data, key, element);
            }
        }
    };
    return Watch;
}());
exports.default = Watch;
