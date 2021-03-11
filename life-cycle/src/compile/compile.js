"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Compiler = /** @class */ (function () {
    function Compiler(el, vm, methods) {
        this.$el = '';
        this.$el = el;
        this.vm = vm;
        var element = document.querySelector(el);
        if (!element)
            utils_1.utils.error('未找到节点，请确定输入的el是否正确！');
        var fragment = this.node2Fragment(element);
        var tokens = this.getTokens(element, fragment);
        this.collectInstcution(tokens, methods);
        // 处理不同的元素
        this.dealWithSpecialTokens(tokens);
        this.vm['tokens'] = tokens;
    }
    /**
     * 将真实节点转换为fragment片段, 模拟AST
     * @param { Element } el
     */
    Compiler.prototype.node2Fragment = function (el) {
        var fragment = document.createDocumentFragment();
        var firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment;
    };
    /**
     * 解析
     * @param { DocumentFragment } fragment
     */
    Compiler.prototype.compile = function (fragment) {
        var _this = this;
        var childrenList = Array.from(fragment.childNodes);
        return childrenList.map(function (e) {
            return _this.parse(e);
        });
    };
    Compiler.prototype.parse = function (e) {
        var _this = this;
        var _a;
        var attr = e.attributes;
        var children = undefined;
        var nodeType = e.nodeType;
        var tag = undefined;
        var data = undefined;
        var text = undefined;
        var mustacheReg = /{{(.*)}}/;
        switch (nodeType) {
            case 1:
                tag = e.tagName.toLocaleLowerCase();
                data = { attr: attr };
                children = Array.from(e.childNodes).map(function (ee) { return _this.parse(ee); });
                break;
            case 3:
                tag = undefined;
                text = (_a = e.nodeValue) === null || _a === void 0 ? void 0 : _a.toString().replace(/\s/g, '').replace(/\n/, '');
                if (mustacheReg.test(text)) {
                    var param = text.match(mustacheReg);
                    if (this.vm._data[param[1]]) {
                        text = text.replace(param[0], this.vm._data[param[1]]);
                    }
                }
                break;
            case 8:
                text = e.nodeValue;
                tag = '!';
                break;
        }
        return {
            tag: tag,
            children: children,
            data: data,
            text: text
        };
    };
    Compiler.prototype.getTokens = function (el, fragment) {
        var _a;
        var nodeType = el.nodeType;
        var tag = undefined;
        var data = undefined;
        var children = undefined;
        var text = undefined;
        switch (nodeType) {
            case 1:
                tag = el.tagName.toLowerCase();
                data = { attr: el.attributes };
                children = this.compile(fragment);
                break;
            case 3:
                text = (_a = el.nodeValue) === null || _a === void 0 ? void 0 : _a.toString().replace(/\s/g, '').replace(/\n/, '');
                if (!text)
                    utils_1.utils.error('文本节点');
                break;
            case 8:
                tag = '!';
                text = el.nodeValue;
                break;
        }
        return {
            tag: tag,
            data: data,
            children: children,
            text: text
        };
    };
    /**
     * 这里应该是收集指令，目前还没有DOM生成，因此后续指令可能需要操作DOM，就得在DOM生成后再执行指令
     */
    Compiler.prototype.collectInstcution = function (tokens, methods) {
        var _a;
        var attrMap = (_a = tokens === null || tokens === void 0 ? void 0 : tokens.data) === null || _a === void 0 ? void 0 : _a.attr;
        if (attrMap && attrMap.length > 0) {
            var needRemoveNameList = [];
            for (var i = 0; i < attrMap.length; i++) {
                var attr = attrMap.item(i);
                var result = this.switchinstructionList(tokens.data, attr === null || attr === void 0 ? void 0 : attr.nodeName, attr === null || attr === void 0 ? void 0 : attr.nodeValue, methods);
                if (result)
                    needRemoveNameList.push(result);
            }
            needRemoveNameList.map(function (e) {
                attrMap === null || attrMap === void 0 ? void 0 : attrMap.removeNamedItem(e);
            });
        }
        if (tokens.children && tokens.children.length > 0) {
            for (var i = 0; i < tokens.children.length; i++) {
                this.collectInstcution(tokens.children[i], methods);
            }
        }
        return tokens;
    };
    /**
     * 判断指令类型和执行函数
     */
    Compiler.prototype.switchinstructionList = function (data, name, value, methods) {
        var _a;
        data['instruction'] = data.instruction ? data.instruction : {};
        data['callback'] = data.callback ? data.callback : {};
        data['bindValue'] = data.bindValue ? data.bindValue : {};
        if ((name === null || name === void 0 ? void 0 : name.indexOf('v-')) !== -1 || [':', '@'].indexOf(name[0]) !== -1) {
            if ((name === null || name === void 0 ? void 0 : name.indexOf('v-')) !== -1) {
                var instructionReg = /v-(.*)/;
                var instruction = (name === null || name === void 0 ? void 0 : name.match(instructionReg))[1];
                if (instruction.indexOf(':') === -1) {
                    data.instruction[instruction] = value;
                }
                else {
                    var innerInstruction = (_a = instruction) === null || _a === void 0 ? void 0 : _a.split(':');
                    if (innerInstruction[0] === 'bind') {
                        // value
                        data.bindValue[innerInstruction[1]] = value;
                    }
                    else if (innerInstruction[0] === 'on') {
                        // function, 绑定methods中的函数
                        data.callback[innerInstruction[1]] = methods[value.replace(/\(\)/g, '')];
                    }
                }
            }
            else if (name[0] === ':') {
                var instructionReg = /:(.*)/;
                var instruction = (name === null || name === void 0 ? void 0 : name.match(instructionReg))[1];
                data.bindValue[instruction] = value;
                // console.log(instruction)
            }
            else if (name[0] === '@') {
                var instructionReg = /@(.*)/;
                var instruction = name.match(instructionReg)[1];
                data.callback[instruction] = methods[value.replace(/\(\)/g, '')];
            }
            return name;
        }
        return null;
    };
    /**
     * 剔除空白的文本节点
     * @param { AstTokens } tokens
     */
    Compiler.prototype.dealWithSpecialTokens = function (tokens, parentTokens) {
        var _a;
        if ((_a = tokens === null || tokens === void 0 ? void 0 : tokens.data) === null || _a === void 0 ? void 0 : _a.instruction['for']) {
            this.dealWithVFor(tokens, parentTokens);
        }
        if (tokens.children && tokens.children.length > 0) {
            for (var i = 0; i < tokens.children.length; i++) {
                this.removeEmptyNode(tokens.children[i], tokens, i);
            }
        }
    };
    Compiler.prototype.removeEmptyNode = function (tokens, parentTokens, i) {
        if (!tokens.tag && !tokens.text) {
            delete (parentTokens === null || parentTokens === void 0 ? void 0 : parentTokens.children)[i];
        }
        this.dealWithSpecialTokens(tokens, parentTokens);
    };
    Compiler.prototype.dealWithVFor = function (tokens, parentTokens) {
        var _a, _b, _c, _d, _e, _f;
        var value = tokens.data.instruction['for'].trim();
        var dataReg = / in (.*)/;
        var paramReg = /(.*)in /;
        var dataStr = value.match(dataReg)[1].replace(/\s/g, '');
        var data = this.vm._data[dataStr];
        var params = value.match(paramReg)[1].replace(/\s/g, '');
        var i;
        if (params.indexOf(',')) {
            params = params.replace(/\(|\)/g, '').split(',');
            i = params[1];
            params = params[0];
        }
        if (!data)
            utils_1.utils.error('can not get data from undefind!');
        var arr = [];
        var index = (_a = parentTokens.children) === null || _a === void 0 ? void 0 : _a.findIndex(function (e) { return e === tokens; });
        // 移除for指令
        (_b = tokens.data) === null || _b === void 0 ? true : delete _b.instruction.for;
        if ([params, i].indexOf((_c = tokens.data.bindValue) === null || _c === void 0 ? void 0 : _c.key) !== -1)
            (_e = (_d = tokens.data) === null || _d === void 0 ? void 0 : _d.bindValue) === null || _e === void 0 ? true : delete _e.key;
        for (var key in data) {
            var element = data[key];
            // 对每个数据都进行绑定
            // 只做最简单的处理
            arr.push(__assign(__assign({}, tokens), { data: __assign(__assign({}, tokens.data), { key: element, index: key }), children: JSON.parse(JSON.stringify(tokens.children).replace(/{{item}}/gims, element)) }));
        }
        (_f = parentTokens.children) === null || _f === void 0 ? void 0 : _f.splice.apply(_f, __spreadArrays([index, 1], arr));
    };
    return Compiler;
}());
exports.default = Compiler;
