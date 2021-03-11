import { utils } from './../utils';
import { AstTokens, VNode } from "../type"

export default class Patch {
  constructor(vm: any, tokens: AstTokens, data: any) {
    this.vm = vm
    const vnode: VNode = this.h(tokens)
    if (document.querySelector(this.vm.$el)) {
      const fragment = document.createDocumentFragment()
      const result = this.parse(vnode, fragment)
      utils.appendChild(document.body, fragment.firstChild as Element)
    } else {

    }
  }
  vm: any

  /**
   * 将ASTTokens转换为Vnode
   * @param { AstTokens } tokens
   */
  h(tokens: AstTokens): VNode {
    let key: any = undefined
    if (tokens.data?.bindValue?.key) key = tokens.data.bindValue.key
    return {
      sel: tokens.tag,
      data: tokens.data ? tokens.data : undefined,
      children: tokens.children ? (tokens.children.length > 0 ? tokens.children.map(e => this.h(e)) : []) : undefined,
      text: tokens.text ? tokens.text : undefined,
      elm: undefined,
      key
    }
  }

  /**
   * parse
   * @param { VNode } vnode
   * @param { any } parentNode
   */
  parse(vnode: VNode, parentNode: Node | Element | DocumentFragment) {
    let node: Element | Text | Comment
    switch (vnode.sel) {
      case '!':
        node = utils.createCommentNode(vnode.text ? vnode.text : '')
        break
      case undefined:
        node = utils.createTextNode(vnode.text ? vnode.text : '')
        break
      default:
        node = utils.createElementNode(vnode.sel, vnode.data) as Element;
        if (vnode.children && vnode.children.length > 0) {
          vnode.children = vnode.children.map(e => this.parse(e, vnode.elm ? vnode.elm : node))
        }
        break
    }
    vnode.elm = vnode.elm ? vnode.elm : node
    utils.appendChild(parentNode, node)
    return vnode
  }

  /**
   * 将挂载了的节点转换为虚拟节点
   * @param { Element | null } element
   */
  toVnode(element: Element | null) { }

  /**
   * diff打补丁
   * @param { VNode } oldVnode
   * @param { VNode } newVnode
   */
  patchVnode(oldVNode: VNode, newVnode: VNode) { }

}