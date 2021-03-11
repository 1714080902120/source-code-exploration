"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var watcher_1 = require("./watcher");
var observe_1 = require("./observe");
var obj = {
    a: {
        q: {
            w: {
                e: 1
            }
        }
    },
    b: {
        r: {
            t: {
                y: 2
            }
        }
    },
    c: {
        u: {
            i: {
                o: 3
            }
        }
    },
    d: [10, 20, { g: { h: { j: 2 } } }, 60, '3wwwq', false, [5, 7, 2]],
    e: 123
};
observe_1.observe(obj);
// obj.d.push([1, 2, 3, 4, 6])
// obj.d.pop()
// obj.d[0] = 123
// console.log(obj)
new watcher_1.Watcher(obj, 'a.q.w.e', function (a, b) {
    console.log(a, b);
});
obj.a.q.w.e = 5032;
obj.d.push(1234);
