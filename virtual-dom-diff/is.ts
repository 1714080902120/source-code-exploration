
/**
 * 判断是否为数组
 * @param { any } arr
 * @return { Boolean }
 */
export const isArray = Array.isArray


/**
 * 判断一个变量是否为基础类型string或者number
 * @param { any } s
 * @return { boolean }
 */
export function isPrimitive(s: any): s is (string | number) {
  return typeof s === 'string' || typeof s === 'number'
}

/**
 * 判断是否是相同的str
 * @param { any } before
 * @param { any } current
 * @return { Boolean }
 */
export function isSameStr (before: any, current: any): Boolean {
  return JSON.stringify(before) === JSON.stringify(current)
}
