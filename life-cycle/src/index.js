"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __importDefault(require("./vue"));
var vue = new vue_1.default({
    el: '#app',
    data: function () {
        return {
            items: [
                'tom', 'jerry', 'marry'
            ],
            inputValue: '123',
            test: true
        };
    },
    methods: {
        changeColor: function () {
            console.log('changeColor');
        },
        goAlert: function () {
            console.log('goAlert');
        }
    },
    watch: {
        test: function (newVal, oldVal) {
            console.log(newVal, oldVal);
        },
        deep: true,
        immediate: true
    },
    computed: {},
    components: {},
    beforeCreate: function () { console.log('beforeCreate'); },
    created: function () { console.log('created'); },
    beforeMounted: function () { console.log('beforeMounted'); },
    mounted: function () { console.log('mounted'); },
    beforeUpdate: function () { console.log('beforeUpdate'); },
    updated: function () { console.log('updated'); },
    beforeDestroy: function () { console.log('beforeDestroy'); },
    destoryed: function () { console.log('destoryed'); }
});
vue._data.test = false;
vue._data.items.push('jack');
console.log(vue);
