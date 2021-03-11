"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var compile_1 = __importDefault(require("./compile/compile"));
var reactive_1 = __importDefault(require("./reactive"));
var watch_1 = __importDefault(require("./watch"));
var diff_1 = __importDefault(require("./diff"));
var Vue = /** @class */ (function () {
    function Vue($options) {
        this.$el = '';
        this._data = {};
        var el = $options.el, name = $options.name, data = $options.data, methods = $options.methods, computed = $options.computed, components = $options.components, watch = $options.watch, beforeCreate = $options.beforeCreate, created = $options.created, beforeMounted = $options.beforeMounted, mounted = $options.mounted, beforeUpdate = $options.beforeUpdate, updated = $options.updated, beforeDestroy = $options.beforeDestroy, destoryed = $options.destoryed, directives = $options.directives, activated = $options.activated, filters = $options.filters, deactivated = $options.deactivated;
        try {
            beforeCreate ? beforeCreate() : null;
            // 节点
            this.$el = el;
            this._data = data();
            // 数据初始化响应式
            this.reactive(this._data);
            created ? created() : null;
            // AST
            this.compile(this.$el, methods);
            this.watch(watch);
            beforeMounted ? beforeMounted() : null;
            // diff
            this.diff(this.tokens, this._data);
            mounted ? mounted() : null;
        }
        catch (error) {
            utils_1.utils.error(error);
        }
    }
    /**
     * 上树
     */
    Vue.prototype.compile = function (el, methods) {
        new compile_1.default(el, this, methods);
    };
    /**
     * 数据响应式
     * @param { Object } _data
     */
    Vue.prototype.reactive = function (_data) {
        if (!_data)
            utils_1.utils.error('数据为空');
        new reactive_1.default(_data, this);
    };
    /**
     * 绑定watch
     */
    Vue.prototype.watch = function (watch) {
        new watch_1.default(this, watch);
    };
    /**
     * diff
     */
    Vue.prototype.diff = function (tokens, data) {
        if (!tokens)
            utils_1.utils.error('模板为空');
        new diff_1.default(this, tokens, data);
    };
    return Vue;
}());
exports.default = Vue;
