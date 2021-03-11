export interface IS {
  isArray: (value: any) => value is []
  isSelfClosingTag: (tagName: string) => Boolean
}

const selfClosingTag = ['meta', 'link', 'base', 'br', 'hr', 'input', 'img']

/**
 * 判断是否是字符串或者数字
 * @param { any } value
 * @returns { boolean }
 */
function isArray (value: any): value is [] {
  return Array.isArray(value)
}

/**
 * 判断是否是自闭和标签
 * @param { string } tagName
 * @returns { boolean }
 */
function isSelfClosingTag (tagName: string): boolean {
  return selfClosingTag.indexOf(tagName) !== -1
}

export const is: IS = {
  isArray,
  isSelfClosingTag
}
