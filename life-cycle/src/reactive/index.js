"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observe_1 = require("./observe");
var Reactive = /** @class */ (function () {
    function Reactive(data, vue) {
        this.$data = data;
        this.$vue = vue;
        observe_1.observe(data);
    }
    return Reactive;
}());
exports.default = Reactive;
