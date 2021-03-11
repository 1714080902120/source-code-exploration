import { Watcher } from './../../../observer-reactive/src/watcher';
import { AstTokens, VNodeData } from "../type"
import { utils } from '../utils'
import { instructionMap } from '../instructionMap';

export default class Compiler {
  constructor(el: string, vm: any, methods: any) {
    this.$el = el
    this.vm = vm
    const element: Element | null = document.querySelector(el)
    if (!element) utils.error('未找到节点，请确定输入的el是否正确！')
    const fragment: DocumentFragment = this.node2Fragment(element as Element)
    const tokens = this.getTokens(element as Element, fragment)
    this.collectInstcution(tokens, methods)
    // 处理不同的元素
    this.dealWithSpecialTokens(tokens)
    this.vm['tokens'] = tokens
  }
  $el: string = ''
  vm: any
  /**
   * 将真实节点转换为fragment片段, 模拟AST
   * @param { Element } el
   */
  node2Fragment(el: Element): DocumentFragment {
    const fragment: DocumentFragment = document.createDocumentFragment()
    let firstChild: Element | Node | Text | Comment | Attr | null
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }

  /**
   * 解析
   * @param { DocumentFragment } fragment
   */
  compile(fragment: DocumentFragment): AstTokens[] {
    const childrenList = Array.from(fragment.childNodes)
    return childrenList.map(e => {
      return this.parse(e)
    })
  }
  parse(e: Node): AstTokens {
    const attr = (e as Element).attributes
    let children: AstTokens[] | undefined = undefined
    const nodeType = e.nodeType
    let tag: any = undefined
    let data: any = undefined
    let text: any = undefined
    const mustacheReg: RegExp = /{{(.*)}}/
    switch (nodeType) {
      case 1:
        tag = (e as Element).tagName.toLocaleLowerCase()
        data = { attr }
        children = Array.from(e.childNodes).map(ee => this.parse(ee))
        break
      case 3:
        tag = undefined
        text = e.nodeValue?.toString().replace(/\s/g, '').replace(/\n/, '')
        if (mustacheReg.test(text)) {
          const param = text.match(mustacheReg)
          if (this.vm._data[param[1]]) {
            text = text.replace(param[0], this.vm._data[param[1]])
          }
        }
        break
      case 8:
        text = e.nodeValue
        tag = '!'
        break
    }
    return {
      tag,
      children,
      data,
      text
    }
  }
  getTokens (el: Element, fragment: DocumentFragment) {
    const nodeType = el.nodeType
    let tag: any = undefined
    let data: any = undefined
    let children: any = undefined
    let text: any = undefined
    switch (nodeType) {
      case 1:
        tag = el.tagName.toLowerCase()
        data = { attr: el.attributes }
        children = this.compile(fragment)
        break
      case 3:
        text = el.nodeValue?.toString().replace(/\s/g, '').replace(/\n/, '')
        if (!text) utils.error('文本节点')
        break
      case 8:
        tag = '!'
        text = el.nodeValue
        break
    }
    return {
      tag,
      data,
      children,
      text
    }
  }
  /**
   * 这里应该是收集指令，目前还没有DOM生成，因此后续指令可能需要操作DOM，就得在DOM生成后再执行指令
   */
  collectInstcution(tokens: AstTokens, methods: any) {
    const attrMap: NamedNodeMap | undefined = tokens?.data?.attr
    if (attrMap && attrMap.length > 0) {
      const needRemoveNameList: string[] = []
      for (let i = 0; i < attrMap.length; i++) {
        const attr: Attr | null = attrMap.item(i)
        const result = this.switchinstructionList(tokens.data, attr?.nodeName, attr?.nodeValue, methods)
        if (result) needRemoveNameList.push(result)
      }
      needRemoveNameList.map(e => {
        attrMap?.removeNamedItem(e)
      })
    }
    if (tokens.children && tokens.children.length > 0) {
      for (let i = 0; i < tokens.children.length; i++) {
        this.collectInstcution(tokens.children[i], methods)
      }
    }
    return tokens
  }
  /**
   * 判断指令类型和执行函数
   */
  switchinstructionList(data: VNodeData, name: string | undefined, value: any, methods: any): string | null {
    data['instruction'] = data.instruction ? data.instruction : {}
    data['callback'] = data.callback ? data.callback : {}
    data['bindValue'] = data.bindValue ? data.bindValue : {}
    if (name?.indexOf('v-') !== -1 || [':', '@'].indexOf(name[0]) !== -1) {
      if (name?.indexOf('v-') !== -1) {
        const instructionReg: RegExp = /v-(.*)/
        const instruction = (name?.match(instructionReg) as any)[1]
        if (instruction.indexOf(':') === -1) {
          data.instruction[instruction] = value
        } else {
          const innerInstruction: string[] = (instruction as string)?.split(':')
          if (innerInstruction[0] === 'bind') {
            // value
            data.bindValue[innerInstruction[1]] = value
          } else if (innerInstruction[0] === 'on') {
            // function, 绑定methods中的函数
            data.callback[innerInstruction[1]] = methods[value.replace(/\(\)/g, '')]
          }
        }
      } else if (name[0] === ':') {
        const instructionReg: RegExp = /:(.*)/
        const instruction = (name?.match(instructionReg) as any)[1]
        data.bindValue[instruction] = value
        // console.log(instruction)
      } else if (name[0] === '@') {
        const instructionReg: RegExp = /@(.*)/
        const instruction = (name.match(instructionReg) as any)[1]
        data.callback[instruction] = methods[value.replace(/\(\)/g, '')]
      }
      return name as string;
    }
    return null
  }

  /**
   * 剔除空白的文本节点
   * @param { AstTokens } tokens
   */
  dealWithSpecialTokens (tokens: AstTokens, parentTokens?: AstTokens) {
    if (tokens?.data?.instruction['for']) {
      this.dealWithVFor(tokens, parentTokens as AstTokens)
    }
    if (tokens.children && tokens.children.length > 0) {
      for (let i = 0; i < tokens.children.length; i++) {
        this.removeEmptyNode(tokens.children[i], tokens, i)
      }
    }
  }
  removeEmptyNode (tokens: AstTokens, parentTokens: AstTokens, i: number) {
    if (!tokens.tag && !tokens.text) {
      delete (parentTokens?.children as [])[i]
    }
    this.dealWithSpecialTokens(tokens, parentTokens)
  }
  dealWithVFor (tokens: AstTokens, parentTokens: AstTokens) {
    const value = tokens.data.instruction['for'].trim()
    const dataReg: RegExp = / in (.*)/
    const paramReg: RegExp = /(.*)in /
    const dataStr = value.match(dataReg)[1].replace(/\s/g, '')
    const data = this.vm._data[dataStr]
    let params = value.match(paramReg)[1].replace(/\s/g, '')
    let i: any
    if (params.indexOf(',')) {
      params = params.replace(/\(|\)/g, '').split(',')
      i = params[1]
      params = params[0]
    }
    if (!data) utils.error('can not get data from undefind!')
    const arr: AstTokens[] = []
    const index: number = parentTokens.children?.findIndex(e => e === tokens) as number
    // 移除for指令
    delete tokens.data?.instruction.for
    if ([params, i].indexOf(tokens.data.bindValue?.key) !== -1) delete tokens.data?.bindValue?.key
    for (const key in data) {
      const element = data[key]
      // 对每个数据都进行绑定
      // 只做最简单的处理
      arr.push({
        ...tokens,
        data: {
          ...tokens.data,
          key: element,
          index: key
        },
        children: JSON.parse(JSON.stringify(tokens.children).replace(/{{item}}/gims, element))
      })
    }
    parentTokens.children?.splice(index, 1, ...arr)
  }
}
