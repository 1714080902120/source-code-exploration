import { observe } from './observe'

export default class Reactive {
  constructor(data: any, vue: any) {
    this.$data = data
    this.$vue = vue
    observe(data)
  }
  $vue: any
  $data: any
}
