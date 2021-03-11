import newArray from './new-array';
import { defineReactive } from "./definereactive";
import { def } from "./utils";
import { Dep } from './dep';
import { observe } from './observe';
/**
 * 观察者给对象添加观察者
 * 
 */
export default class Observer {
  constructor (data: any) {
    this.dep = new Dep()
    def(data, '__ob__', false, this)
    if (Array.isArray(data)) {
      Object.setPrototypeOf(data, newArray(data))
      // data.__proto__ === newArray
      this.walkArray(data)
    } else {
      this.walk(data)
    }
  }
  dep: any
  /**
   * 遍历对象的所有key
   * @param { any } obj
   */
  walk (obj: any) {
    for (const key in obj) {
      // 对子属性逐个添加响应式和观察者对象
      defineReactive(obj, key)
    }
  }
  walkArray (data: any[]) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }
}
