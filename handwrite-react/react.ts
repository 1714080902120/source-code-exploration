import Component from "./component";
import { VNode } from "./type";

export default class React {
  constructor() {}
  Component = Component;
  // 转换为成虚拟DOM
  createElement(type: string, _props: any, ...children: any[]): VNode {
    return {
      type,
      props: {
        ..._props,
        children:
          children.length > 0
            ? children.map((e) =>
                typeof e === "string"
                  ? this.createElement("text", { nodeValue: e })
                  : e
              )
            : [],
      },
    };
  }
  createContext(defaultValue?: string) {
    return {
      Provider: class Provider extends Component {
        currentValue: any;
        render() {
          const currentValue = this.props.value;
          this.currentValue = currentValue || defaultValue;
          return '';
        }
      },
    };
  }
}
