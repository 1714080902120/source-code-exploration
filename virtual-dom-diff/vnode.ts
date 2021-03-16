export interface VNode {
  sel: string | undefined;
  data?: any | undefined;
  children?: any | undefined;
  text?: string | undefined;
  elm?: Element | Text | undefined;
  key?: any | undefined;
  [key: string]: any;
}

export function vnode (sel: string | undefined, data: any | undefined, children: any[] | undefined, text: string | undefined, elm: Element | Text | undefined): VNode {
  return {
    sel,
    data,
    children,
    text,
    elm,
    key: data === undefined ? undefined : data.key
  }
}
