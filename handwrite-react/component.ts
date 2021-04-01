import { diff } from "./diff";
import { patch } from "./patch";
import { Map, VNode } from "./type";

export default class Component {
  constructor(props: any, state: any) {
    this.props = props;
    this.state = state || {};
    this.context = (this.constructor as any).contextType && (this.constructor as any).contextType.Provider.currentValue;
    // 绑定事件
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getSnapshotBeforeUpdate = this.getSnapshotBeforeUpdate.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }
  props: any;
  state: Map = {};
  nextState: Map = {};
  context: any
  shouldComponentUpdate() {}
  componentDidMount() {}
  getSnapshotBeforeUpdate() {}
  componentDidUpdate() {}
  render(props: any, state: any) {
    return;
  }
  setState(set: Function, callback: Function) {
    this.nextState = {
      ...this.state,
      ...set(this.state, this.props),
    };
    const Window = window as any
    this.reRender(Window.vnode, Window.ovnode, Window.el)
    this.state = this.nextState;
    callback();
  }
  /**
   * 更新vnode，采用先获取差异再打补丁
   * @param { VNode } vnode
   * @param { VNode } ovnode
   * @param { HTMLElement } container
   */

  reRender = (
    vnode: VNode,
    ovnode: VNode,
    container: HTMLElement
  ) => {
    const diffInfo = diff(vnode, ovnode);

    patch(container, diffInfo);
  };
}
