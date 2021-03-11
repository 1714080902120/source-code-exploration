import { watcher } from "./watcher"

interface Dependence {
  new (): Dependences
  target: watcher | null
}

export interface Dependences {
  subs: watcher[];
  id: number;
  addSub: (watcher: watcher) => void;
  depend: () => void;
  notify: () => void
}

let uid = 0

function staticImplements<T> () {
  return <U extends T> (constructor: U) => { constructor }
}

@staticImplements<Dependence>()
export class Dep {
  constructor () {
    // 存放订阅者
    this.subs = []
    this.id = ++uid
  }
  static target: watcher | null
  subs: watcher[]
  id: number
  // 添加订阅
  addSub (watcher: watcher) {
    this.subs.push(watcher)
  }
  // 添加依赖
  depend () {
    // 此时使用了这个数据的watcher被放到了全局唯一target，只要调用了watcher就能出发数据的getter
    if (Dep.target) {
      // 访问了该数据, 此时的subs为空，target为第一个watcher，不会发生重复
      this.addSub(Dep.target)
    }
  }
  // 通知更新
  notify () {
    // 遍历更新
    for (let i = 0; i < this.subs.length; i++) {
      console.log('调用了notify')
      console.log(this.subs)
      // return 
      this.subs[i].update()
    }
  }
}