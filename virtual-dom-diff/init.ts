import { domAPI as api } from './domApi';
import { VNode } from './vnode';
import { createDOM, isSameNode, addToDOMTree } from "./patch";
import * as is from './is'

/**
 * 判断data的长度是否大于0
 * @param obj 
 * @returns { Boolean }
 */
export function judgeObjLength(obj: Object): number {
  return Object.keys(obj).length
}

/**
 * 判断新旧虚拟节点不同之处
 * @param oldNode 
 * @param newNode
 * @return { Node }
 */
export function patchVnode(oldNode: VNode, newNode: VNode): any {
  // 三种类型的节点分别都需要处理
  // elm元素需要特殊处理,如果没变则直接赋值
  if (oldNode.sel === undefined || oldNode.sel === '!') {
    // 当文本内容不想同时，直接创建新的元素并添加到原来的元素中
    if (oldNode.text !== newNode.text) {
      const childNode = createDOM(newNode)
      const parentNode = (oldNode.elm as Node).parentNode
      if (parentNode) addToDOMTree(parentNode, childNode, oldNode.elm as any)
      return newNode
    }
  } else {
    let oldChildren = oldNode.children
    let newChildren = newNode.children
    let oldS = 0
    let oldE = oldChildren.length - 1
    let newS = 0
    let newE = newChildren.length - 1
    // 元素标签data, children, text进行判断
    if (oldNode.text !== newNode.text || !is.isSameStr(oldNode.data, newNode.data)) {
      // 当text不同时候直接返回
      const childNode = createDOM(newNode)
      const parentNode = (oldNode.elm as Node).parentNode
      if (parentNode) addToDOMTree(parentNode, childNode, oldNode.elm as any)
      return newNode
    }
    // 判断children属性
    if (oldE <= 0 && newE <= 0) {
      return oldNode
    } else if (oldE <= 0) {
      // 添加子元素
      newChildren.map((e: VNode) => {
        api.appendChild((oldNode.elm as Node), createDOM(e))
        oldNode.children = newChildren
        return e
      })
    } else if (newE <= 0) {
      // 删除子元素
      ((oldNode.elm as any).children as Node[]).map(e => {
        api.removeChildNode(oldNode.elm as Node, e)
        oldNode.children = []
        return e
      })
    } else {
      // 情况四：都有子节点
      // 看新旧哪个短
      let children = new Array(newE + 1)
      while (oldS < oldE && newS < newE) {
        const oldStartChild = oldNode.children[oldS]
        const oldEndChild = oldNode.children[oldE]
        const newStartChild = newNode.children[newS]
        const newEndChild = newNode.children[newE]
        // 头头同一个
        if (isSameNode(newStartChild, oldStartChild)) {
          children[newS] = patchVnode(oldStartChild, newStartChild)
          // 尾尾是同一个
          if (isSameNode(newEndChild, oldEndChild)) {
            children[newE] = patchVnode(oldEndChild, newEndChild)
            oldE -= 1
            newE -= 1
          }
          oldS += 1
          newS += 1
          // 头尾
        } else if (isSameNode(newStartChild, oldEndChild)) {
          children[newS] = patchVnode(oldEndChild, newStartChild)
          // 尾头
          if (isSameNode(newEndChild, oldStartChild)) {
            children[newE] = patchVnode(oldStartChild, newEndChild)
            oldS += 1
            newE -= 1
          }
          newS += 1
          oldE -= 1
        } else {
          // 头尾都不是同一个,遍历旧节点查找
          let foundStart = false
          for (let i = 0; i < oldNode.children.length; i++) {
            const element = oldNode.children[i]
            if (isSameNode(newStartChild, element)) {
              children[newS] = patchVnode(element, newStartChild)
              foundStart = true
              break
            }
          }
          // 没找到直接插入元素
          if (!foundStart) {
            createDOM(newStartChild)
            children[newS] = newStartChild
            // 插入到上个元素的后面
            api.insertAfter(oldNode.elm, newS === 0 ? null : newNode.children[newS - 1], newStartChild)
          }
          newS += 1
        }
      }
      // 接下来判断是否有多余的元素
      if (oldE > oldS) {
        for (let i = oldS; i <= oldE; i++) {
          api.removeChildNode(oldNode.elm as Node, oldNode.children[i])
        }
      } else if (newE > newS) {
        // 当新节点多于旧节点数量时，没有匹配到的将被依次放入末尾
        for (let i = newS; i <= newE; i++) {
          api.appendChild(oldNode.elm as Node, createDOM(newNode))
        }
      }
      oldNode.children = children
    }
  }
  return oldNode
}