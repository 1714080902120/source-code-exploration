# 虚拟DOM和diff

## 虚拟DOM生成步骤
+ DOM节点转换为虚拟DOM
  1. 调用toVnode函数将DOM变为虚拟DOM
  2. 比较新旧节点diff
  3. 上树，替换原本的DOM
