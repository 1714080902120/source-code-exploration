import { Dep } from "./dep"
import { parsePath } from "./utils"

export interface watcher {
  id: number;
  obj: Object | any[];
  getter: Function;
  callback: Function | null;
  value: any;
  update: () => void;
  get: () => any
}

let uid = 0

export class Watcher {
  constructor (obj: Object | any[], expression: string, callback: Function | null) {
    this.id = uid++
    this.obj = obj
    this.getter = parsePath(expression)
    this.callback = callback
    Dep.target = this
    this.value = this.get()
    Dep.target = null
  }
  id: number
  obj: Object | []
  getter: Function
  callback: Function | null
  value: any
  update () {
    // 触发更新，执行回调
    this.run()
  }
  get () {
    // 当需要更新时，将全局的target指向当前这个watcher
    // 初始化时获取该值并将全局target指向null
    return this.getter(this.obj)
  }
  run () {
    this.getAndInvoke(this.callback)
  }
  /**
   * 唤起回调
   * 调用属性的getter获取最新的值, 对比前后两个数据，如果不同将执行回调
   * 对象一律执行回调
   * @param { Function | null } cb
   */
  getAndInvoke(cb: Function | null) {
    const value = this.get()
    if (value !== this.value || typeof value === 'object') {
      const oldValue = this.value
      this.value = value;
      (cb as Function).call(this.obj, this.value, oldValue)
    }
  }
}