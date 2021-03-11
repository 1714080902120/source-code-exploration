import { Dependences, Dep } from "./dep"
import { observe } from "./observe"

/**
 * 采用闭包环境存储变量值, 给对象的字段添加响应式
 * @param { object } obj 对象
 * @param { string | number | symbol } key 字段
 * @return { void }
 */
export function defineReactive (obj: any, key: string | number | symbol): void {
  // 初始值
  let val: any = obj[key]
  // 这里传入的是子键值
  let childOB = observe(val)
  // Dep
  let dep: Dependences = new Dep()
  // 调用observe确保所有属性都绑定了响应式及观察者对象
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 访问
    get () {
      console.log(`访问了属性${key as string}, 值为：` + val)
      // 此时如果访问该数据发现target不为null，则开始收集依赖
      if (Dep.target) {
        dep.depend()
        if (childOB) {
          childOB.dep.depend()
        }
      }
      return val
    },
    // 赋值
    set (newVal) {
      console.log(`赋值给了属性${key as string}, 值为：` + newVal)
      if (newVal === val) return
      val = newVal
      childOB = observe(newVal)
      // 通知所有watcher更新
      dep.notify()
    }
  })
}