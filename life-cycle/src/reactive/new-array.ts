/**
 * 继承Array, 让数据中是数组的元素的原型链指向newArray
 */

import { observe } from "./observe"
import { def } from "./utils"

const ArrayProto = Array.prototype
const someNewArrayMethods: string[] = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

export default function (data: any[]) {
  // newArray.__proto__ === Array.prototype
  const newArray = Object.create(ArrayProto)
  someNewArrayMethods.forEach((method: string) => {
    const originalMethod = ArrayProto[method as any]
    def(newArray, method, false, function () {
      console.log('监听到数组变化', arguments)
      if (new Array('push', 'unshift', 'splice').includes(method)) {
        for (let i: number = method === 'splice' ? 2 : 0; i < arguments.length; i++) {
          observe(arguments[i])
        }
        const result = originalMethod.apply(data, arguments);
        (data as any).__ob__.dep.notify()
        return result
      }
      return originalMethod.apply(data, arguments)
    })
  })
  return newArray
}


