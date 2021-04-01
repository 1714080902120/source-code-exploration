import { Map, VNode } from "./type";
import { Diff } from "./list-diff";
import { utils } from "./utils";
const { isString } = utils;

const REPLACE = 0; // 替换
const ORDER = 1; // children顺序变更
const PROP = 2; // 属性变更
const TEXT = 3; // 文本变更

// 这个是最复杂的
function diffChildren(
  vnodeChildren: VNode[],
  ovnodeChildren: VNode[],
  index: number,
  diffInfo: any[],
  currentDiffInfo: any[]
) {
  // 这里的最小编辑问题，采用动态规划解决，为了项目复杂度考虑直接引入了一个开源库list-diff2
  // see more: https://github.com/livoras/list-diff
  const diffs = Diff(ovnodeChildren, vnodeChildren, "key");
  // 替换children为处理过的children
  vnodeChildren = diffs.children;

  if (diffs.moves.length) {
    currentDiffInfo.push({ type: ORDER, moves: diffs.moves });
  }

  ovnodeChildren.forEach((child, i) => {
    const newChild = vnodeChildren[i];
    // 递归处理子节点，采用栈结构，最顶层为最小子节点
    dfs(child, newChild, ++index, diffInfo);
  });
}

function diffProps(vnode: VNode, ovnode: VNode) {
  const oldProps = ovnode.props;
  const newProps = vnode.props;

  const diffInfo: Map = {};

  for (const key in newProps) {
    if (!oldProps.hasOwnProperty(key)) {
      // 新增属性
      diffInfo[key] = newProps[key];
    }
  }

  for (const key in oldProps) {
    if (newProps[key] !== oldProps[key]) {
      // 属性不同
      diffInfo[key] = newProps[key];
    }
  }

  return diffInfo;
}

function dfs(vnode: VNode, ovnode: VNode, index: number, diffInfo: any[]) {
  // 当前这个节点（有编号的）的diff信息
  const currentDiffInfo: any[] = [];

  // 删除节点
  if (vnode === null) {
  } else if (isString(ovnode) && isString(vnode)) {
    // textContent
    if (vnode !== ovnode) {
      currentDiffInfo.push({ type: TEXT, content: vnode });
    }
  } else if (ovnode && ovnode.type === vnode.type && ovnode.key === vnode.key) {
    // Diff props
    const propsPatches = diffProps(vnode, ovnode);
    if (propsPatches) {
      currentDiffInfo.push({ type: PROP, props: propsPatches });
    }

    diffChildren(
      ovnode.children,
      vnode.children,
      index,
      diffInfo,
      currentDiffInfo // children需要将其diffInfo插入到currentDiffInfo中
    );
  } else {
    currentDiffInfo.push({ type: REPLACE, node: vnode });
  }

  diffInfo[index] = currentDiffInfo;
}

export const diff = (vnode: VNode, ovnode: VNode) => {
  // 当前的节点的标志。采用DFS算法。
  let index = 0;

  // 将每个节点的差异（如果有）记录在下面的对象中。
  const diffInfo: any[] = [];

  dfs(vnode, ovnode, index, diffInfo);
  // 最终diff算法返回的是一个两棵树的差异。
  return diffInfo;
}
