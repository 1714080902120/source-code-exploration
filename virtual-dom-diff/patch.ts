import { VNode, vnode } from './vnode'
import * as is from './is'
import { DOMAPI, domAPI as api } from './domApi';
import { toVnode } from './toVnode';
import { patchVnode } from './init';


/**
 * 判断是否是同一节点
 * @param { VNode } oldNode
 * @param { VNode } newNode
 * @returns { Boolean }
 */
export function isSameNode(oldNode: VNode, newNode: VNode): boolean {
  return oldNode.key === newNode.key && oldNode.sel === newNode.sel
}

/**
 * 专注于生成DOM
 * 对虚拟节点进行判断 纯文本、存在子元素
 * @param { VNode } newNode
 * @param { Element } elm
 * @return { null }
 */
export function createDOM(node: VNode): Node {
  // 生成DOM
  let element: Element | Text | Node
  let text: any = node.text
  let dataSetLength: number = Object.keys(node.data).length
  if (node.sel === '!') {
    // 为注释节点
    element = api.createCommentNode(text)
  } else if (node.sel === undefined) {
    // 为文本节点
    element = api.createTextNode(text)
  } else {
    // 为元素节点
    element = api.createElementNode(node.sel)
    const children: VNode[] = node.children
    element.nodeValue = text ? text : ''
    if (children.length > 0) {
      children.map(e => {
        // 递归处理存在子元素的dom
        api.appendChild(element, createDOM(e))
        return e
      })
    } else {
      api.appendChild(element, api.createTextNode(text))
    }
  }
  if (dataSetLength > 0) {
    let key: any
    for (key in node.data) {
      (element as Element).setAttribute(key, node.data[key])
    }
  }
  // 将elm赋值给dom
  (node.elm as any) = element
  return element
}

/**
 * 添加到DOMTree上
 * @param { Element | Node } parentNode
 * @param { Element | Node } newDOM
 * @param { Element | Node } oldDOM
 */
export function addToDOMTree(parentNode: Node, newDOM: Node, oldNode: Node) {
  // api.insertBefore(parentNode, newDOM, oldNode)
  // api.removeChildNode(parentNode, oldNode)
  api.replaceChildNode(parentNode, newDOM, oldNode)
}


/**
 * 打补丁
 * @param { any } oldNode
 * @param { any } newNode
 * @return { null }
 */

export function patch(oldNode: VNode | Element, newNode: VNode) {
  const parent = api.parentNode(oldNode as any)
  if (!parent) throw new Error('parentNode不能为null')
  // 判断是否为第一次上树
  if (oldNode instanceof Element) oldNode = toVnode(oldNode)
  // 判断是否是同一节点
  // newNode.elm = oldNode.elm
  if (isSameNode(oldNode, newNode)) {
    // diff
    // 判断情况
    const finalVNode = patchVnode(oldNode, newNode)
  } else {
    // 如果是不同的节点，直接替换
    addToDOMTree(parent, createDOM(newNode), oldNode.elm as any)
  }
}
