import Observer from './observer'
/**
 * 判断是否有观察者，没有则创建
 * @param { any } data
 */

export function observe (data: any) {
  if (typeof data !== 'object') {
    return
  }
  return data.__ob__ ? data.__ob__ : new Observer(data)
}