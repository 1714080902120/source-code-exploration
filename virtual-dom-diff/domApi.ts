import { VNode } from "./vnode";
import { createDOM } from "./patch";

export interface DOMAPI {
  tagName: (elm: Element) => string;
  createElementNode: (tagName: string) => Element;
  createTextNode: (text: string) => Text;
  createCommentNode: (content: string) => Node
  parentNode: (elm: Element | Text | null) => Node | null;
  insertBefore: (parentNode: Node, newNode: Node, oldNode: Node | null) => void;
  removeChildNode: (parentNode: Node, node: Node) => void;
  appendChild: (parentNode: Element | Node, childNode: Element | Node) => void;
  getNodeText: (node: Node) => string | null;
  replaceChildNode: (parentNode: Node, oldNode: Node, newNode: Node) => void;
  getNodeComment: (node: Node) => string | null;
  insertAfter: (parentNode: any, lastNode: VNode, nowNode: VNode) => void;
}

/**
 * 获取dom元素的tagName
 * @param { Element } elm
 * @return { string }
 */
function tagName(elm: Element): string {
  return elm.tagName.toLowerCase()
}

/**
 * 生成Element元素
 * @param { string } tagName
 * @return { Element }
 */
function createElementNode(tagName: string): Element {
  return document.createElement(tagName)
}

/**
 * 生成TextNode元素
 * @param { string } text
 * @return { Text }
 */
function createTextNode(text: string): Text {
  return document.createTextNode(text)
}

/**
 * 生成注释节点
 * @param content
 * @return { Element | Node }
 */
function createCommentNode(content: string): Node {
  return document.createComment(content)
}

/**
 * 获取父元素
 * @param { Element | Text } elm
 * @return { Element }
 */
function parentNode(elm: Element | Text | null): Node | null {
  return elm === null ? null : elm.parentNode
}

/**
 * 插入到父元素中
 * @param { Node } parentNode
 * @param { Element | Text } newNode
 */
function insertBefore(parentNode: Node, newNode: Node, oldNode: Node | null) {
  parentNode.insertBefore(newNode, oldNode)
}

/**
 * 插入到元素后面
 * @param { Node } parentNode
 * @param { Node } lastNode
 * @param { Node } nowNode
 */
function insertAfter(parentNode: any, lastNode: any, nowNode: VNode) {
  if (parentNode.children && parentNode.children.length > 0) {
    let childrenList = parentNode.children
    const nowElement = nowNode.elm as Node
    // 判断是否是第一个元素
    if (!lastNode) {
      insertBefore(parentNode, nowElement, childrenList[0])
    } else {
      for (let i = 0; i < childrenList.length; i++) {
        const element = childrenList[i]
        // 找到上一个节点的index
        if (lastNode.elm === element) {
          // 判断 i++是否存在,不存在添加到最后，存在插入到之前
          if (i < childrenList.length - 1) {
            insertBefore(parentNode, nowElement, childrenList[i + 1])
          } else {
            appendChild(parentNode, nowElement)
          }
          break
        }
      }
    }
  }
}

/**
 * 替换元素
 * @param { Node } parentNode 
 * @param { Node } oldNode
 * @param { Node } newNode
 */
function replaceChildNode(parentNode: Node, newNode: Node, oldNode: Node) {
  parentNode.replaceChild(newNode, oldNode)
}

/**
 * 删除DOM
 * @param { Node } parentNode
 * @param { Node | null } node
 */
function removeChildNode(parentNode: Node, node: Node) {
  parentNode.removeChild(node)
}

/**
 * 增加元素
 * @param { Node | Element } parentNode
 * @param { Node | Element } childNode
 */
function appendChild(parentNode: Element | Node, childNode: Element | Node) {
  parentNode.appendChild(childNode)
}

/**
 * 获取文本节点的内容
 * @param { Node } node
 * @return { string }
 */
function getNodeText(node: Node): string | null {
  return node.nodeValue
}

/**
 * 获取注释节点内容
 * @param { Node } node
 * @return { string }
 */
function getNodeComment(node: Node): string | null {
  return node.textContent
}

export const domAPI: DOMAPI = {
  tagName,
  createElementNode,
  createTextNode,
  createCommentNode,
  parentNode,
  insertBefore,
  removeChildNode,
  appendChild,
  getNodeText,
  getNodeComment,
  replaceChildNode,
  insertAfter
}