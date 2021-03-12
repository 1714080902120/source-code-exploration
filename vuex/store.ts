import Vue from 'vue'
import utils from './utils'

export interface Map {
  [key: string]: any
}

interface StoreOptions {
  state?: Map;
  mutations?: Map;
  actions?: Map;
  getters?: Map;
  modules?: StoreOptions
}


export default class Store {
  constructor($options: StoreOptions) {
    let { state = {}, mutations = {}, actions = {}, getters = {}, modules = {} } = $options
    // 整合modules
    if (modules && utils.isEmptyMap(modules)) {
      for (const key in modules) {
        const element = (modules as any)[key];
        (state as Map)[key] = element.state
        mutations = concatMap(element.mutations, mutations as Map)
        actions = concatMap(element.actions, actions as Map)
        getters = concatMap(element.getters, getters as Map)
      }
    }
    this.mutations = mutations
    this.actions = actions
    this.getters = getters
    this.app = new Vue({
      data() {
        return {
          state
        }
      }
    })
    // 同一个对象，数据公用，能做到数据响应式变化
    this.state = this.app.$data.state
    // 处理getters
    handleGetters(this.getters, this.state)
  }
  app: Vue
  state: Map
  mutations: Map
  actions: Map
  getters: Map

  /**
   * mutations方法
   * @param { string } name
   * @param { any } payload
   */
  commit(mutationName: string, payload: any) {
    if (this.mutations && this.mutations[mutationName]) {
      this.mutations[mutationName](this.state, payload)
    } else {
      utils.error(`mutations is undefind or do not have ${mutationName} function`)
    }
  }

  /**
   * action方法
   * @param { string } name
   * @param { any } payload
   */
  dispatch(actionName: string, payload: any) {
    if (this.actions && this.actions[actionName]) {
      this.actions[actionName]( this , payload)
    } else {
      utils.error(`mutations is undefind or do not have ${actionName} function`)
    }
  }
}

/**
 * concatMap
 * @param { Map } map1
 * @param { Map } map2
 * @returns { Map }
 */
function concatMap (map1: Map, map2: Map) {
  if (utils.isEmptyMap(map1) || utils.isEmptyMap(map2)) utils.error('something error')
  return Object.assign(map1, map2)
}

/**
 * 处理getters，响应式处理
 * @param { Map } getters
 */
function handleGetters (getters: Map, state: Map) {
  if (utils.isEmptyMap(getters)) utils.error('getters is empty!')
  for (const key in getters) {
    const func = getters[key]
    Object.defineProperty(getters, key, {
      value: true,
      get () {
        return func(state)
      }
    })
  }
}