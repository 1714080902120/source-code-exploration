import { domAPI as api } from './domApi';
import { VNode, vnode } from "./vnode";

export function toVnode(element: Element): VNode {
  let data: any
  let sel: any
  let attr: any
  let children: any
  let text: any
  const elmAttrs = element.attributes
  const childrenNodes: NodeListOf<ChildNode> = element.childNodes
  // console.log(element.nodeType)
  // 判断节点的类型
  switch (element.nodeType) {
    // 元素节点
    case 1:
      sel = element.tagName.toLowerCase()
      children = []
      data = {}
      attr = {}
      if (childrenNodes.length > 0) {
        for (let i = 0; i < childrenNodes.length; i++) {
          children.push(toVnode(childrenNodes[i] as Element))
        }
      }
      for (const key in elmAttrs) {
        attr[key] = elmAttrs[key]
      }
      for (let i = 0; i < elmAttrs.length; i++) {
        attr[elmAttrs[i].nodeName] = elmAttrs[i].nodeValue
      }
      data = { attr }
      break
    // 文本节点
    case 3:
      text = api.getNodeText(element)
      break
    // 注释节点
    case 8:
      sel = '!'
      text = api.getNodeComment(element)
      break
    default:
      console.log('节点为非可接受节点' + JSON.stringify(element))
  }
  return vnode(sel, data, children, text, element)
}