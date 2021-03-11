import { ParentNode, VNode } from './type'

export interface Utils {
  error: (errStr: string) => void
  appendChild: (parentNode: ParentNode, childNode: ChildNode | ParentNode ) => void
  removeChild: (parentNode: ParentNode, childNode: ChildNode | ParentNode ) => void
  insertBefore: (parentNode: ParentNode, newChildNode: ChildNode | ParentNode, oldChildNode: ChildNode | ParentNode) => void
  createElementNode: (sel: string, data: any) => Element | Node
  createTextNode: (text: string) => Text
  createCommentNode: (text: string) => Comment
  isArray: (value: any) => value is []
}

/**
 * 判断是否是Array
 * @param { any } value
 * @returns
 */
function isArray (value: any): value is [] {
  return Array.isArray(value)
}

/**
 * 抛出错误
 * @param { string } errStr
 */
function error(errStr: string) {
  throw new Error(errStr)
}

/**
 * appendChild
 * @param { Node } parentNode
 * @param { Node } childNode
 */
function appendChild (parentNode: ParentNode, childNode: ChildNode | ParentNode ) {
  parentNode.appendChild(childNode)
}

/**
 * removeChild
 * @param { Node } parentNode
 * @param { Node } childNode
 */
function removeChild (parentNode: ParentNode, childNode: ChildNode | ParentNode ) {
  parentNode.removeChild(childNode)
}

/**
 * insertBefore
 * @param { Node } parentNode
 * @param { Node } newChildNode
 * @param {  Node } oldChildNode
 */
function insertBefore (parentNode: ParentNode, newChildNode: ChildNode | ParentNode, oldChildNode: ChildNode | ParentNode) {
  parentNode.insertBefore(newChildNode, oldChildNode)
}

/**
 * @param { string } sel
 * @param { any } data
 * @param { VNode[] } children
 * @param { VNode } vnode
 * @returns
 */
function createElementNode (sel: string, data: any): Element | Node {
  const element: Element = document.createElement(sel as string)
  if (data.attr.length > 0) {
    for (let i = 0; i < (data.attr as NamedNodeMap).length; i++) {
      const attr = (data.attr as NamedNodeMap)[i]
      const { nodeName, nodeValue } = attr
      element.setAttribute(nodeName, nodeValue as string)
    }
  }
  return element
}

/**
 * @param { Text } text
 * @returns
 */
function createTextNode (text: string): Text {
  return document.createTextNode(text)
}

/**
 * @param { Text } text
 * @returns
 */
function createCommentNode (text: string): Comment {
  return document.createComment(text)
}

export const utils: Utils = {
  isArray,
  error,
  appendChild,
  removeChild,
  insertBefore,
  createElementNode,
  createTextNode,
  createCommentNode,
}
