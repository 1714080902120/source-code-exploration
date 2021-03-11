
/**
 * compose 替代嵌套函数
 * @param { function[] } funcs
 * @returns { any }
 */
 const compose = (...funcs) => {
  if (funcs.length <= 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/**
 * 中间件容器
 * 在其内部创建store
 * 加强化api
 */
const applyMiddleware = (...middlewares) => (createStore) => (reducer, preloadedState, enhancer) => {
  // 创建store实例对象
  const store = createStore(reducer, preloadedState, enhancer)
  let dispatch = store.dispatch
  let chain = []
  // 简化store
  const middlewareApi = {
    getState: store.getState,
    dispatch: (action) => dispatch(action)
  }
  // func = ({ dispatch, getState }) => (next) => (action) => {}
  // 此时middleware只剩下 next => action => {} 两层
  chain = middlewares.map(middleware => middleware(middlewareApi))
  // 每个中间件的 第三层函数 都将作为下一个中间件的 next 参数
  // compose: funcs.reduce((a, b) => (...args) => a(b(...args)))
  // 返回一个加强后的dispatch,后续调用dispatch都将执行所有func，实现中间件的功能
  dispatch = compose(...chain)(store.dispatch)
  return {
    ...store,
    dispatch
  }
}

/**
 * @param { function } reducer
 * @return { object }
 */

function createStore(reducer, preloadedState, enhancer) {
  // 重载
  if (typeof preloadedState === 'function' && enhancer === undefined) {
    enhancer = preloadedState
    preloadedState = undefined
  }
  if (enhancer) {
    return enhancer(createStore)(reducer, preloadedState)
  }
  let state = preloadedState || null
  const listeners = []
  const getState = () => state
  // 数据修改后的回调
  const subScribe = (listener) => {
    listeners.push(listener)
  }
  const dispatch = (action) => {
    // reducer需要返回值，闭包保存值
    state = reducer(state, action)
    // 执行回调
    listeners.forEach(e => e())
  }
  // 初始化state
  dispatch({})
  return {
    getState,
    subScribe,
    dispatch
  }
}

/**
 * 用于处理异步中间件
 */
const createThunkMiddleware = (extraArgument) => ({
  dispatch,
  getState
}) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState, extraArgument)
  }
  // 如果不是函数,执行next
  return next(action)
}

const thunk = createThunkMiddleware()

thunk.withExtraArgument = createThunkMiddleware

const constantsType = {
  POP: 'pop',
  PUSH: 'push'
}


const arr = [1, 2, 3, 4, 5]

const reducer = (state, action) => {
  const {
    type
  } = action
  switch (type) {
    case 'pop':
      return state.slice(0, state.length - 1)
    case 'push':
      return state.concat(action.data)
    default:
      return arr
  }
}

const store = createStore(reducer, applyMiddleware(thunk))

console.log(store)

console.log(store.getState())

store.dispatch({
  type: constantsType.POP
})

store.subScribe(() => {
  console.log(123)
})

console.log(store.getState())

store.dispatch({
  type: constantsType.PUSH,
  data: 'aastas'
})

console.log(store.getState())

// 异步操作
/**
 * 返回一个函数
 * 函数中默认传入dispatch和getState
 */
function popArrAsync() {
  return (dispatch, getState, extraArgument) => {
    setTimeout(() => {
      dispatch({
        type: constantsType.POP
      })
    }, 500)
  }
}

const result = store.dispatch(popArrAsync)