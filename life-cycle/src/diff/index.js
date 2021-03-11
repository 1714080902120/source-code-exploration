"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./../utils");
var Patch = /** @class */ (function () {
    function Patch(vm, tokens, data) {
        this.vm = vm;
        var vnode = this.h(tokens);
        if (document.querySelector(this.vm.$el)) {
            var fragment = document.createDocumentFragment();
            var result = this.parse(vnode, fragment);
            utils_1.utils.appendChild(document.body, fragment.firstChild);
        }
        else {
        }
    }
    /**
     * 将ASTTokens转换为Vnode
     * @param { AstTokens } tokens
     */
    Patch.prototype.h = function (tokens) {
        var _this = this;
        var _a, _b;
        var key = undefined;
        if ((_b = (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.bindValue) === null || _b === void 0 ? void 0 : _b.key)
            key = tokens.data.bindValue.key;
        return {
            sel: tokens.tag,
            data: tokens.data ? tokens.data : undefined,
            children: tokens.children ? (tokens.children.length > 0 ? tokens.children.map(function (e) { return _this.h(e); }) : []) : undefined,
            text: tokens.text ? tokens.text : undefined,
            elm: undefined,
            key: key
        };
    };
    /**
     * parse
     * @param { VNode } vnode
     * @param { any } parentNode
     */
    Patch.prototype.parse = function (vnode, parentNode) {
        var _this = this;
        var node;
        switch (vnode.sel) {
            case '!':
                node = utils_1.utils.createCommentNode(vnode.text ? vnode.text : '');
                break;
            case undefined:
                node = utils_1.utils.createTextNode(vnode.text ? vnode.text : '');
                break;
            default:
                node = utils_1.utils.createElementNode(vnode.sel, vnode.data);
                if (vnode.children && vnode.children.length > 0) {
                    vnode.children = vnode.children.map(function (e) { return _this.parse(e, vnode.elm ? vnode.elm : node); });
                }
                break;
        }
        vnode.elm = vnode.elm ? vnode.elm : node;
        utils_1.utils.appendChild(parentNode, node);
        return vnode;
    };
    /**
     * 将挂载了的节点转换为虚拟节点
     * @param { Element | null } element
     */
    Patch.prototype.toVnode = function (element) { };
    /**
     * diff打补丁
     * @param { VNode } oldVnode
     * @param { VNode } newVnode
     */
    Patch.prototype.patchVnode = function (oldVNode, newVnode) { };
    return Patch;
}());
exports.default = Patch;
