import { Map, usualNodeType } from "./type";
import { domApi } from "./dom-api";
import ReactDOM from "./react-dom";

const { createTextNode, removeChild, replaceChild, insertBefore } = domApi;
const REPLACE = 0; // 替换
const ORDER = 1; // children顺序变更
const PROP = 2; // 属性变更
const TEXT = 3; // 文本变更

function setAttr(node: any, key: string, value: any) {
  switch (key) {
    case "style":
      node.style.cssText = value;
      break;
    case "value":
      const tagName = (node.type || "").toLowerCase();
      if (tagName === "input" || tagName === "textarea") {
        node.value = value;
      } else {
        node.setAttribute(key, value);
      }
      break;
    default:
      node.setAttribute(key, value);
      break;
  }
}

/**
 * 深度递归至最小子节点，然后进行打补丁
 * @param { usualNodeType } el
 * @param { Map } walker 用于存储index值
 * @param { any[] } 差异数组
 */
function dfs(el: usualNodeType, walker: Map, diffInfo: any[]) {
  const currentDiffInfos = diffInfo[walker.index];

  const len = el.childNodes ? el.childNodes.length : 0;
  for (let i = 0; i < len; i++) {
    const child = el.childNodes[i];
    walker.index++;
    dfs(child, walker, diffInfo);
  }

  // 执行打补丁操作
  if (currentDiffInfos) {
    apply(el, currentDiffInfos);
  }
}

function apply(el: usualNodeType, currentDiffInfos: any[]) {
  currentDiffInfos.forEach((currentDiffInfo) => {
    switch (currentDiffInfo.type) {
      case REPLACE:
        const newNode =
          typeof currentDiffInfo.node === "string"
            ? createTextNode(currentDiffInfo.node)
            : ReactDOM.prototype.render(
                currentDiffInfo.node,
                // 复制引用地址
                el.parentNode?.cloneNode(false) as HTMLElement
              );
        // 替换当前节点
        replaceChild(
          el.parentNode?.cloneNode(false) as usualNodeType,
          newNode,
          el
        );
        break;
      case ORDER:
        reorderChildren(el, currentDiffInfo.moves);
        break;
      case PROP:
        setProps(el, currentDiffInfo.props);
        break;
      case TEXT:
        if (el.textContent !== undefined) {
          el.textContent = currentDiffInfo.content;
        } else {
          el.nodeValue = currentDiffInfo.content;
        }
        break;
      default:
        throw new Error("未知类型 " + currentDiffInfo.type);
    }
  });
}

function setProps(el: usualNodeType, props: NamedNodeMap) {
  for (const key in props) {
    if (!!!props[key]) {
      (el as HTMLElement).removeAttribute(key);
    } else {
      const value = props[key];
      setAttr(el, key, value);
    }
  }
}

/**
 * 删除/插入子节点
 * @param { usualNodeType }
 * @param { any[] } moves
 */
function reorderChildren(el: usualNodeType, moves: any[]) {
  moves.forEach((move) => {
    const index = move.index;
    if (move.type === 0) {
      removeChild(el, el.childNodes[index]);
    } else if (move.type === 1) {
      const insertNode =
        typeof move.item === "object"
          ? move.item.render()
          : createTextNode(move.item)

      insertBefore(el, insertNode, el.childNodes[index] || null);
    }
  });
}

/**
 * 打补丁
 * @param { HTMLElement } 父节点
 * @param { any[] } 需要处理节点的列表
 */
export const patch = (el: HTMLElement, diffInfo: any[]) => {
  // 对象是引用传递
  const walker = { index: 0 };
  dfs(el, walker, diffInfo);
};
