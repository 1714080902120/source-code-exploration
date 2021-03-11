# 流程

1. 创建vue实例，传入初始参数
2. 借助vue-loader和webpack将.vue文件转换为style, template, scripts 三部分
3. template => AST转换为Tokens 抽取指令 数据和方法存储在{}['data']里，同时如果该节点已挂载则获取该节点
4. 数据响应式处理 observe(_data)
   1. 监测数据，给每个数据都绑定数据劫持
   2. 收集指令放入到tokens里的data里
5. h: (Tokens: Object<astTokens>) => VNode h函数转换为Vnode
6. patchVnode: (oldVnode: VNode, newVnode: VNode) => VNode 新旧节点对比，打补丁，同时根据data里的指令创建watcher实例执行回调

