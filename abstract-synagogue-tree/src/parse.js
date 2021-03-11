"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_1 = require("./is");
/**
 * 将template字符串转换为对象形式
 * @param { string } templateStr
 * @returns { object }
 */
function parse(templateStr) {
    var _a, _b, _c, _d, _e, _f;
    if (templateStr === '')
        return false;
    templateStr.trim();
    templateStr.replace(/\n/gi, '');
    var subStr = templateStr;
    var copyStr = templateStr;
    var templateStrLength = copyStr.length - 1;
    // 指针
    var e = 0;
    var tagReg = /<("[^"]*"|'[^']*'|[^'">])*>/;
    var dataReg = /\/?>(.*?)<\/?/sm;
    // 栈空间
    var stack = [];
    // return false
    while (e < templateStrLength) {
        subStr = copyStr.substring(e);
        var letter = templateStr[e];
        if (letter === '<') {
            // 存储tag
            if (templateStr[e + 1] === '!') {
                var commentReg = /<!--(.*?)-->/;
                var text = subStr.match(commentReg)[1];
                var item = {
                    tag: '!',
                    children: [],
                    attrs: [],
                    type: 1,
                    text: text
                };
                if (((_a = stack[stack.length - 1]) === null || _a === void 0 ? void 0 : _a.type) !== 1) {
                    (_c = (_b = stack[stack.length - 1]) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c.push(item);
                }
                else {
                    stack.push(item);
                }
                e = text.length + e + 6;
            }
            else if (templateStr[e + 1] !== '/') {
                if (tagReg.test(subStr)) {
                    var tagStart = subStr.match(tagReg)[0];
                    e = e + tagStart.length - 1;
                    // 获取tag和对象
                    var item = transformToParseItem(tagStart);
                    // 判断是否是自闭和标签
                    if (stack.length > 0 && item.type === 1) {
                        var parent_1 = stack[stack.length - 1];
                        if (parent_1.type !== 1) {
                            (_d = parent_1.children) === null || _d === void 0 ? void 0 : _d.push(item);
                        }
                    }
                    else {
                        // 入栈
                        stack.push(item);
                    }
                }
            }
            else {
                // 出栈
                if (stack.length > 1 && stack[stack.length - 2].type !== 1) {
                    var item = stack.pop();
                    e = 2 + item.tag.length + e;
                    (_e = stack[stack.length - 1].children) === null || _e === void 0 ? void 0 : _e.push(item);
                }
                else {
                    e = e + stack[stack.length - 1].tag.length + 2;
                }
            }
        }
        else if (letter === '>') {
            if (dataReg.test(subStr)) {
                var words = subStr.match(dataReg)[1];
                var varReg = /(.*){{(.*)}}(.*)/;
                var text = '';
                if (words !== '') {
                    text = words;
                    // ???暂时无法处理
                    // if (varReg.test(words)) {
                    //   const wordsList = (words.match(varReg) as RegExpMatchArray)
                    //   text = `${wordsList[1]}${wordsList[2]}${wordsList[3]}`
                    // } else {
                    //   text = words
                    // }
                    (_f = stack[stack.length - 1].children) === null || _f === void 0 ? void 0 : _f.push({
                        tag: '',
                        attrs: [],
                        children: [],
                        type: 2,
                        text: text
                    });
                    e = e + words.length;
                }
                else {
                    e++;
                }
            }
            else {
                if (e + 1 === templateStrLength) {
                    e++;
                }
            }
        }
        else {
            e++;
        }
    }
    return stack;
}
exports.default = parse;
/**
 * 将标签变成对象形式
 * @param { string } tagStr
 * @returns { object }
 */
function transformToParseItem(tagStr) {
    var item = { tag: '', children: [], attrs: [], type: 0 };
    var tagReg = /\<([a-z]+[1-6]?)/;
    var attrReg = /\ (.*?)\=\"(.*?)\"/g;
    var tagStrLength = tagStr.length;
    if (tagReg.test(tagStr)) {
        item.tag = tagStr.match(tagReg)[1];
    }
    if (attrReg.test(tagStr)) {
        var attrs = tagStr.match(attrReg);
        attrs === null || attrs === void 0 ? void 0 : attrs.forEach(function (e) {
            var _a;
            var arr = e.substring(1, e.length - 1).split('=');
            var firstLetter = arr[1][0];
            // 判断标签属性自定义类型
            (_a = item.attrs) === null || _a === void 0 ? void 0 : _a.push({
                name: arr[0],
                value: arr[1].substring(1),
                type: firstLetter === ':' ? 1 : (firstLetter === '@' ? 2 : 0)
            });
        });
    }
    // 自闭和标签
    if ((tagStr[tagStrLength - 1] === '>' && tagStr[tagStrLength - 2] === '/') || is_1.is.isSelfClosingTag(item.tag)) {
        item.type = 1;
    }
    return item;
}
