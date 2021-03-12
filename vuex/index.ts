import Store from "./store"
import { VueConstructor } from 'vue'
import { Map } from './store'

let vue: VueConstructor

export default class vuex {
  constructor() {
    this.Store = Store
  }
  Store: any

  install(_Vue: VueConstructor) {
    vue = _Vue
    vue.mixin({
      beforeCreate() {
        if ((this.$options as any).$store) {
          vue.prototype.$store = (this.$options as any).$store
        }
      }
    })
  }
}


/**
 * ...mapState(['xx']/{ x: state => state.x })
 * @param { string[] | Array }
 * @returns { Map }
 */
function mapState (arg: Map | string[]): Map {
  const smallState: Map = {}
  if (arg instanceof Array) {
    let map: Map = {}
    arg.map(e => {
      map[e] = () => vue.prototype.$store.state[e]
    })
    arg = map
  }
  // 遍历
  for (const key in arg) {
    const func = arg[key]
    smallState[key] = func()
  }
  return smallState
}

/**
 * ...mapGatters(['x']/{ x: xx })
 * @param { string[] | Map } arg
 * @returns { Map } 返回一组computed
 */
function mapGetters(arg: Map | string[]): Map {
  const getters: Map = {}
  if (arg instanceof Array) {
    let map: Map = {}
    arg.map(e => {
      map[e] = e
      return e
    })
    arg = map
  }
  // 遍历处理绑定getters
  for (const key in arg) {
    const element = arg[key]
    getters[key] = () => vue.prototype.$store.state[element]
  }
  return getters
}

/**
 * mapMutations 返回一组函数
 * @param { Map } arg
 * @returns { Map }
 */
function mapMutations (arg: Map | string[]): Map {
  const mutations: Map = {}
  if (arg instanceof Array) {
    let map: Map = {}
    arg.map(e => {
      map[e] = vue.prototype.$store.mutations[e]
      return e
    })
    arg = map
  }
  // 遍历处理绑定getters
  for (const key in arg) {
    const element = arg[key]
    mutations[key] = (state = vue.prototype.$store.state) => vue.prototype.$store.state[element]
  }
  return mutations
}

/**
 * mapActions
 * @param { Map } arg
 * @returns { Map }
 */
 function mapActions (arg: Map | string[]): Map {
  const actions: Map = {}
  if (arg instanceof Array) {
    let map: Map = {}
    arg.map(e => {
      map[e] = vue.prototype.$store.actions[e]
      return e
    })
    arg = map
  }
  // 遍历处理绑定getters
  for (const key in arg) {
    const element = arg[key]
    actions[key] = (context = vue.prototype.$store) => vue.prototype.$store.state[element]
  }
  return actions
}

export {
  Store,
  mapState,
  mapGetters,
  mapMutations,
  mapActions
}