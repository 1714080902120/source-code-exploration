/**
 * 1. Promise内置属性： { state: pending | fullfilled | rejected, result: any, callbacks: <Promise>[] }
 * 2. @param excutor(resolve(value: any): TFunction extends Function, reject(value: any): TFunction extends Function): Promise<Object>
 * 3. @returns <Promise>Object
 */

export default class MyPromise {
  constructor(excutor) {
    this.state = 'pending'
    this.result = ''
    this.callbacks = []
    try {
      excutor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  /**
   * @param value: any
   * @returns <Promise>Object
   */ 
  static _resolve(value) {
    return new MyPromise((resolve, reject) => {
      this.judgeCallBack(value, resolve, reject)
    })
  }

  /**
   * @param value: any
   * @returns <Promise>Object
   */ 
  static _reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value)
    })
  }

    /**
   * @param arr: <Promise>[]
   * @returns <Promise>[] | <Promise>{}
   */ 
  static _all(arr) {
    return new MyPromise((resolve, reject) => {
      let successArr = []
      arr.forEach((e, i) => {
        e.then(res => {
          successArr[i] = res
          if (successArr.length === arr.length) {
            resolve(successArr)
          }
        }, err => {
          reject(err)
        })
      })
    })
  }

  static _race(arr) {
    return new MyPromise((resolve, reject) => {
      arr.forEach(e => {
        e.then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  }

  resolve(value) {
    if (this.state !== 'pending') return false
    this.state = 'fullfilled'
    this.result = value
    // 如果有，则执行
    if (this.callbacks.length > 0) {
      setTimeout(() => {
        this.callbacks.forEach(e => {
          e.success(value)
        })
      })
    }
  }
  reject(value) {
    if (this.state !== 'pending') return false
    this.state = 'rejected'
    this.result = value
    if (this.callbacks.length > 0) {
      setTimeout(() => {
        this.callbacks.forEach(e => {
          e.error(value)
        })
      })
    }
  }

  judgeCallBack(callBack, resolve, reject) {
    try {
      if (callBack instanceof MyPromise) {
        // 当返回的值是一个promise对象，直接then执行函数获取结果然后resolve/reject
        callBack.then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else {
        // 当返回值不为promise对象时，判断是否是undefined或者null，如果不是则resolve
        resolve(callBack)
      }
    } catch (error) {
      reject(error)
    }
  }

  then(success, error) {
    return new MyPromise((resolve, reject) => {
      let callBack = null
      if (typeof error !== 'function') {
        error = err => {
          throw err
        }
      }
      if (typeof success !== 'function') {
        success = res => res
      }
      if (this.state === 'fullfilled') {
        callBack = success(this.result)
      } else if (this.state === 'rejected') {
        callBack = error(this.result)
      } else {
        // 多个异步存放回调
        this.callbacks.push({
          success: () => {
            setTimeout(() => {
              this.judgeCallBack(success(this.result), resolve, reject)
            })
          },
          error: () => {
            setTimeout(() => {
              this.judgeCallBack(error(this.result), resolve, reject)
            })
          }
        })
      }
      this.judgeCallBack(callBack, resolve, reject)
    })
  }
  catch (func) {
    return this.then(undefined, func)
  }
}