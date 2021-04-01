export type VNode = {
  type: string | Function;
  props?: any;
  [key: string]: any;
}

export type Map = { [key: string]: any }

export type usualNodeType = HTMLElement | Node