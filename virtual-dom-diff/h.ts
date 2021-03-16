import { VNode, vnode } from './vnode'
import * as is from './is';

declare type ChildrenType = Array<VNode | string> | VNode | undefined
declare type DataType = {} | null


export function h(sel: string): VNode
export function h(sel: string, data: DataType): VNode
export function h(sel: string, children: ChildrenType): VNode
export function h(sel: string, data: DataType, children: ChildrenType): VNode
export function h(sel: string, b?: any, c?: any): VNode {
  let data: DataType = {}
  let children: ChildrenType = []
  let text: any
  // 第四种情况 当第三个参数不为undefined时
  if (c !== undefined) {
    // 判断C类型
    if (is.isPrimitive(c)) {
      // 当C为text时
      text = c
    } else if (is.isArray(c)) {
      // C为数组
      children = c
    } else if (c && c.sel !== undefined) {
      children = [c]
    }
    // 判断第二个参数
    if (b !== null) {
      // b不为null时
      data = b
    }
  } else if (b !== undefined && b !== null) {
    if (is.isArray(b)) {
      children = b
    } else if (b && b.sel !== undefined) {
      children = [b]
    } else if (is.isPrimitive(b)) {
      text = b
    } else {
      data = b
    }
  }
  // 获取完数据后对数据进行处理
  // 如果children里的元素是一个字符串或者数字，对他进行vnode包装
  if (children) {
    children = children.map(e => {
      if (is.isPrimitive(e)) {
        return vnode(undefined, undefined, undefined, e, undefined)
      }
      return e
    })
  }
  return vnode(sel, data, children, text, undefined)
}
