import { Watcher } from './watcher';
import { observe } from './observe'

const obj = {
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
}

observe(obj)
// obj.d.push([1, 2, 3, 4, 6])
// obj.d.pop()

// obj.d[0] = 123

// console.log(obj)


new Watcher(obj, 'a.q.w.e', (a: any, b: any) => {
  console.log(a, b)
})

obj.a.q.w.e = 5032

obj.d.push(1234)
