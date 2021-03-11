export type ParentNode = Node | Element

export interface VueOptions {
  el: string;
  name?: string;
  data?: Function | Object;
  methods?: Object;
  computed?: Object;
  components?: Object;
  watch?: Object;
  beforeCreate?: Function;
  created?: Function;
  beforeMounted?: Function;
  mounted?: Function;
  beforeUpdate?: Function;
  updated?: Function;
  beforeDestroy?: Function;
  destoryed?: Function;
  directives?: Object;
  activated?: Function;
  filters?: Object;
  deactivated?: Function;
}

export interface AstTokens {
  tag: string | undefined;
  data?: any;
  children?: AstTokens[];
  text?: string;
  [key: string]: any;
}

export interface VNode {
  sel: string | undefined;
  data?: any;
  children?: VNode[] | undefined;
  text?: string;
  elm: Element | Node | undefined;
  key?: any;
  [key: string]: any;
}

export interface VNodeData {
  attr?: NamedNodeMap | undefined | null;
  instruction?: any;
  bindValue?: any;
  callback?:any;
  key?: any;
}

// export interface InstructionType {
//   instruction: string;
//   value: any;
// }

// export interface FunctionType {
//   event: string;
//   function: any;
// }

// export interface bindValue {
//   name: string;
//   value: any;
// }