import { utils } from './utils';
import { VueOptions, AstTokens, VNode } from "./type"
import Compiler from './compile/compile'
import Reactive from "./reactive"
import Watch from "./watch"
import Patch from "./diff"

export default class Vue {
  constructor($options: VueOptions) {
    const {
      el,
      name,
      data,
      methods,
      computed,
      components,
      watch,
      beforeCreate,
      created,
      beforeMounted,
      mounted,
      beforeUpdate,
      updated,
      beforeDestroy,
      destoryed,
      directives,
      activated,
      filters,
      deactivated,
    } = $options
    try {
      beforeCreate ? beforeCreate() : null

      // 节点
      this.$el = el
      this._data = (data as Function)()
      // 数据初始化响应式
      this.reactive(this._data)

      created ? created() : null

      // AST
      this.compile(this.$el, methods)
      this.watch(watch)

      beforeMounted ? beforeMounted() : null

      // diff
      this.diff(this.tokens, this._data)

      mounted ? mounted() : null
    } catch (error) {
      utils.error(error)
    }

  }
  $el: string = ''
  _data: any = {}
  tokens: any
  /**
   * 上树
   */
  compile(el: string, methods: any) {
    new Compiler(el, this, methods)
  }

  /**
   * 数据响应式
   * @param { Object } _data
   */
  reactive(_data: any) {
    if (!_data) utils.error('数据为空')
    new Reactive(_data, this)
  }

  /**
   * 绑定watch
   */
  watch(watch: any) {
    new Watch(this, watch)
  }

  /**
   * diff
   */
  diff(tokens: any, data: any) {
    if (!tokens) utils.error('模板为空')
    new Patch(this, tokens, data)
  }
}