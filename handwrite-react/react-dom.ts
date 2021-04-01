import Component from "./component";
import { domApi } from "./dom-api";
import { Map, VNode } from "./type";
import { utils } from "./utils";
export default class ReactDom {
  constructor() {}
  render(vnode: VNode, container: HTMLElement): any {
    const { appendChild, createElement, createTextNode } = domApi;
    const {
      objKeys,
      isListeners,
      isAttributes
    } = utils;
    const { type, props } = vnode;

    const dom: HTMLElement | Text = (() => {
      if (type === "text") {
        return createTextNode(type);
      } else if ((type as any).prototype instanceof Component) {
        // 存储实例对象，下次不用再次创建
        let instance = (type as any)['instance']
        let vnode = null
        // 第一次挂载
        if (!instance) {
          instance = new (type as any)(props);
          (type as any)['instance'] = instance
          vnode = firstRender(props, instance.state, instance)
          // 挂载虚拟DOM到实例上下次不用再重新创建
          instance.vnode = vnode
          return this.render(vnode, container)
        } else {
          vnode = subSequentedRender(props, instance.state, instance)
          // 替换为最新的vnode
          instance.vnode = vnode
        }
        return this.render(vnode, container)
      } else if (isFunctionComponnet(type)) {
        return this.render((type as any)(props), container).childNodes[0];
      }
      return createElement(type as string);
    })();

    const propsArr = objKeys(props);
    // 监听事件
    propsArr
      .filter(isListeners)
      .map((listener: string) =>
        dom.addEventListener(
          listener.toLowerCase().substring(2),
          props[listener]
        )
      );
    // 添加属性
    propsArr.filter(isAttributes).map((attr: string) => {
      const key = attr === "className" ? "class" : attr;
      (dom as any)[key] = props[attr];
    });
    // 处理子元素
    (props?.children || []).map((child: VNode) =>
      this.render(child, dom as HTMLElement)
    );
    container.innerHTML = "";
    appendChild(container, dom);
    
    return dom;
  }
}

const getDerivedStateFromPropsDefault = (props: Map, state: Map) => null;

const componentDidMountDefault = () => {};

const shouldComponentUpdateDefault = () => true;

const getSnapshotBeforeUpdateDefault = (
  props: Map,
  state: Map,
  snapshot: Map
) => {};

const componentDidUpdateDefault = () => {};

/**
 * 第一次挂载
 * @param { Map } props
 * @param { Map } state
 * @param { Component } instance
 * @return { VNode }
 */
const firstRender = (props: Map, state: Map, instance: any) => {
  // 执行生命周期函数
  const { getDerivedStateFromProps, componentDidMount } = instance;
  (getDerivedStateFromProps || getDerivedStateFromPropsDefault)(props, state);
  const vnode = instance.render(
    props,
    state
  )(componentDidMount || componentDidMountDefault)();
  return vnode;
};

/**
 * @param { Map } props
 * @param { Map } state
 * @param { Component } instance
 * @return { VNode }
 */
const subSequentedRender = (props: Map, state: Map, instance: any) => {
  const {
    getDerivedStateFromProps,
    getSnapshotBeforeUpdate,
    componentDidUpdate,
  } = instance;
  (getDerivedStateFromProps || getDerivedStateFromPropsDefault)(props, state);
  const shouldUpdate = (
    instance.shouldComponentUpdate || shouldComponentUpdateDefault
  )(props, state);
  if (!shouldUpdate) return instance.vnode;
  const vnode = instance.render(
    props,
    state
  )(getSnapshotBeforeUpdate || getSnapshotBeforeUpdateDefault)(
    props,
    state,
    {}
  )(componentDidUpdate || componentDidUpdateDefault)();
  return vnode;
};

const isFunctionComponnet = function(v: any) {
  const type = v instanceof Function ? v.name : v;
  return (
    type[0] &&
    type[0].charCodeAt(0) >= "A".charCodeAt(0) &&
    type[0].charCodeAt(0) <= "Z".charCodeAt(0)
  );
};