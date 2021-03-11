export interface InstructionMap {
  model: (newVal: any, oldVal: any) => void;
  for: (newVal: any, oldVal: any) => void;
  if: (newVal: any, oldVal: any) => void;
  html: (newVal: any, oldVal: any) => void;
}


/**
 * 双向绑定
 */
function Model(newVal: any, oldVal: any) {
  
}

/**
 * 遍历
 */
function For(newVal: any, oldVal: any) {}

/**
 * 判断函数
 */
function If(newVal: any, oldVal: any) {}

/**
 * 添加Html片段
 */
function Html(newVal: any, oldVal: any) {}

export const instructionMap: InstructionMap = {
  model: Model,
  for: For,
  if: If,
  html: Html
}
