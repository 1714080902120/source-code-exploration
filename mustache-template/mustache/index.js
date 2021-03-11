// mustache
export class Mustache {
  constructor() {
    this.tokens = []
  }
  render(templateStr, data) {
    const str = templateStr
    const tokens = this.parseTemplateStrToTokens(str, [])
    const strDomTree = this.renderTemplate(tokens, data)
    console.log(strDomTree)
    return strDomTree
  }

  /**
   * 获取tokens
   * @return { Array }
   */
  parseTemplateStrToTokens(str, array) {
    const scanner = new Scanner(str)

    // 循环获取匹配的字符串
    while (scanner.eos()) {
      const text = scanner.scanUntil('{{')

      if (text) {
        array.push(['text', text])
      }

      scanner.scan('{{')

      const name = scanner.scanUntil('}}')

      if (name) {
        if (name[0] === '#') {
          array.push(['#', name.slice(1)])
        } else if (name[0] === '/') {
          array.push(['/', name.slice(1)])
        } else {
          array.push(['name', name])
        }
      }

      scanner.scan('}}')
    }
    return this.nestTokens(array)
  }

  /**
   * 折叠token
   * @param tokens
   * @return { Array } nestTokens
   */
  nestTokens(tokens) {
    let nestTokens = []
    // 收集器引用地址
    let selectors = nestTokens
    let track = []
    for (let i = 0; i < tokens.length; i++) {
      let element = tokens[i]
      switch (element[0]) {
        case '#':
          // element入栈
          selectors.push(element)
          // 压栈
          track.push(element)
          // 收集器引用改为最新的地址
          selectors = element[2] = []
          break
        case '/':
          // 出栈
          let pop = track.pop()
          // 收集器地址指向上一层
          selectors = track.length === 0 ? nestTokens : track[track.length - 1][2]
          break
        default:
          selectors.push(element)
      }
    }
    return nestTokens
  }

  /**
   * 模板引擎转换为DOM
   * @param { array } token
   * @param { any } data
   * @return { string } stringDomTree
   */
  renderTemplate(tokens, data) {
    let str = ''
    for (let i = 0; i < tokens.length; i++) {
      const element = tokens[i]
      switch (element[0]) {
        case 'text':
          str += element[1]
          break
        case 'name':
          str += this.lookup(data, element[1])
          break
        default:
          str += this.loopArray(element[2], data instanceof Array ? data : this.lookup(data, element[1]))
      }
    }
    return str
  }

  /**
   * 遍历数组，给数组里的元素添加数据
   * @param { array } tokens
   * @param { array } data
   * @return { string } str
   */
  loopArray(tokens, data) {
    let str = ''
    for (let i = 0; i < data.length; i++) {
      str += this.renderTemplate(tokens, data[i])
    }
    return str
  }

  /**
   * 在dataObj对象中，寻找用连续点符号的keyName属性
   * @param { array || object } obj
   * @param { string } key
   * @return { any } any
   */
  lookup(obj, key) {
    console.log(obj)
    console.log(key)
    let temp = obj[key]
    if (key.indexOf('.') !== -1) {
      if (key === '.') {
        console.log(key)
        temp = obj
      } else {
        let arr = key.split('.')
        for (let i = 0; i < arr.length; i++) {
          temp = obj[arr[i]]
        }
      }
    }
    console.log('temp:')
    console.log(temp)
    return temp
  }
}

// 获取template并查找特定字符
export class Scanner {
  constructor(templateStr) {
    this.str = templateStr
    this.pos = 0
    this.tail = templateStr
  }

  /**
   * 找到“{{”或“}}”并跳过
   * @param tag
   * @return  { void } undefind
   */
  scan(tag) {
    if (this.tail.indexOf(tag) === 0) {
      this.pos += tag.length
      this.resetTail()
    }
  }

  resetTail() {
    this.tail = this.str.substring(this.pos)
  }

  /**
   * 直到找到“{{”， “}}”
   * @param endTag
   * @return { string } scanStr
   */
  scanUntil(endTag) {
    // 需要保存当前指针
    const pos_backup = this.pos
    // 循环直到当前指针找到特殊字符
    while (this.eos() && this.tail.indexOf(endTag) != 0) {
      this.pos++
      this.resetTail()
    }
    // 最终会返回当前获取的字符串
    return this.str.substring(pos_backup, this.pos)
  }

  /**
   * 判断指针是否到头
   * @return { Boolean }
   */
  eos() {
    return this.pos < this.str.length
  }
}