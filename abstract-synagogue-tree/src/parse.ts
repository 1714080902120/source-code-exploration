import { is } from './is'

interface Attr {
  name: string;
  value: string;
  type: number;
}

interface ParseItem<T> {
  tag: string;
  attrs?: Array<T>;
  children?: ParseItem<T>[];
  text?: string | undefined;
  type: number;
  [key: string]: any
}

/**
 * 将template字符串转换为对象形式
 * @param { string } templateStr
 * @returns { object }
 */

export default function parse(templateStr: string): ParseItem<Attr>[] | Boolean {
  if (templateStr === '') return false
  templateStr.trim()
  templateStr.replace(/\n/gi, '')
  let subStr: string = templateStr
  const copyStr: string = templateStr
  const templateStrLength = copyStr.length - 1
  // 指针
  let e = 0
  const tagReg: RegExp = /<("[^"]*"|'[^']*'|[^'">])*>/
  const dataReg: RegExp = /\/?>(.*?)<\/?/sm
  // 栈空间
  const stack: ParseItem<Attr>[] = []
  // return false
  while (e < templateStrLength) {
    subStr = copyStr.substring(e)
    const letter = templateStr[e]
    if (letter === '<') {
      // 存储tag
      if (templateStr[e + 1] === '!') {
        const commentReg: RegExp = /<!--(.*?)-->/
        const text = (subStr.match(commentReg) as RegExpMatchArray)[1]
        const item: ParseItem<Attr> = {
          tag: '!',
          children: [],
          attrs: [],
          type: 1,
          text
        }
        if (stack[stack.length - 1]?.type !== 1) {
          stack[stack.length - 1]?.children?.push(item)
        } else {
          stack.push(item)
        }
        e = text.length + e + 6
      } else if (templateStr[e + 1] !== '/') {
        if (tagReg.test(subStr)) {
          const tagStart: string = (subStr.match(tagReg) as any)[0]
          e = e + tagStart.length - 1
          // 获取tag和对象
          const item: ParseItem<Attr> = transformToParseItem(tagStart)
          // 判断是否是自闭和标签
          if (stack.length > 0 && item.type === 1) {
            const parent: ParseItem<Attr> = stack[stack.length - 1]
            if (parent.type !== 1) {
              parent.children?.push(item)
            }
          } else {
            // 入栈
            stack.push(item)
          }
        }
      } else {
        // 出栈
        if (stack.length > 1 && stack[stack.length - 2].type !== 1) {
          const item: ParseItem<Attr> = stack.pop() as ParseItem<Attr>
          e = 2 + item.tag.length + e
          stack[stack.length - 1].children?.push(item)
        } else {
          e = e + stack[stack.length - 1].tag.length + 2
        }
      }
    } else if (letter === '>') {
      if (dataReg.test(subStr)) {
        const words = (subStr.match(dataReg) as RegExpMatchArray)[1]
        const varReg: RegExp = /(.*){{(.*)}}(.*)/
        let text = ''
        if (words !== '') {
          text = words
          // ???暂时无法处理
          // if (varReg.test(words)) {
          //   const wordsList = (words.match(varReg) as RegExpMatchArray)
          //   text = `${wordsList[1]}${wordsList[2]}${wordsList[3]}`
          // } else {
          //   text = words
          // }
          stack[stack.length - 1].children?.push({
            tag: '',
            attrs: [],
            children: [],
            type: 2,
            text
          })
          e = e + words.length
        } else {
          e++
        }
      } else {
        if (e + 1 === templateStrLength) {
          e++
        }
      }
    } else {
      e++
    }
  }
  return stack
}

/**
 * 将标签变成对象形式
 * @param { string } tagStr
 * @returns { object }
 */
function transformToParseItem(tagStr: string): ParseItem<Attr> {
  const item: ParseItem<Attr> = { tag: '', children: [], attrs: [], type: 0 }
  const tagReg: RegExp = /\<([a-z]+[1-6]?)/
  const attrReg: RegExp = /\ (.*?)\=\"(.*?)\"/g
  const tagStrLength: number = tagStr.length
  if (tagReg.test(tagStr)) {
    item.tag = (tagStr.match(tagReg) as any)[1]
  }
  if (attrReg.test(tagStr)) {
    const attrs = tagStr.match(attrReg)
    attrs?.forEach(e => {
      const arr: string[] = e.substring(1, e.length - 1).split('=')
      const firstLetter = arr[1][0]
      // 判断标签属性自定义类型
      item.attrs?.push({
        name: arr[0],
        value: arr[1].substring(1),
        type: firstLetter === ':' ? 1 : (firstLetter === '@' ? 2 : 0)
      })
    })
  }
  // 自闭和标签
  if ((tagStr[tagStrLength - 1] === '>' && tagStr[tagStrLength - 2] === '/') || is.isSelfClosingTag(item.tag)) {
    item.type = 1
  }
  return item
}
