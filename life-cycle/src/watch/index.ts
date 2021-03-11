import { Watcher } from '../reactive/watcher';

export default class Watch {
  constructor(vm: any, watch: any) {
    this.vm = vm
    if (watch && Object.keys(watch).length > 0) {
      this.createWatcher(watch)
    }
  }
  vm: any
  createWatcher(obj: any) {
    for (const key in obj) {
      const element = obj[key]
      if (element instanceof Function) {
        new Watcher(this.vm._data, key, element)
      }
    }
  }
}