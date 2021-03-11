/**
 * 将观察者__ob__设置为不可枚举
 * @param { object } obj
 */
export function def (obj: Object, key: string | number | symbol, enumerable: boolean, value: any) {
  Object.defineProperty(obj, key, {
    enumerable,
    writable: true,
    configurable: true,
    value
  })
}

/**
 * 高阶函数
 * 返回一个函数
 * @param { string } expression
 * @return { Function } (obj: Object) => any
 */
export function parsePath (expression: string): Function {
  const arr = expression.split('.')
  return (obj: any) => {
    try {
      return arr.reduce((before, current) => {
        return before[current]
      }, obj)
    } catch (error) {
      throw new Error('该对象下并没有该属性')
    }
  }
}