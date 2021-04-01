/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
 function Diff (oldList: any[], newList: any[], key: any) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves: any[] = []

  // a simulate list to manipulate
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    if (itemKey) {
      // 判断旧节点是否存在于新列表
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        // 占位
        children.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  var simulateList = children.slice(0)

  // remove items no longer exist
  // 删除不存在的旧节点
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      // 判断头结点是否是同一个节点, 是则忽略
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // 不是则判断是否存在于旧列表中
        // 不存在则直接插入
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          // 当节点存在于旧列表中时
          // 如果旧节点列表下一个节点正好是新列表的当前节点，直接移除旧列表中的当前节点， 此时正好匹配， j+1
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }
    i++
  }

  function remove (index: number) {
    var move = {index: index, type: 0}
    moves.push(move)
  }

  function insert (index: number, item: any) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  function removeSimulate (index: number) {
    simulateList.splice(index, 1)
  }

  // 返回 一组有变化的节点列表 [{ tpye: 1, item, index }]
  // type表示操作类型是移除还是插入还是移动
  // item则是节点对象
  // index表示节点的下标
  // children是一组集合新旧列表的数组，已经将不存在的节点换成null的旧节点列表，最终操作也是操作在旧列表中
  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list: any[], key: any) {
  var keyIndex: any = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item: any, key: any) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

export {
  makeKeyIndexAndFree,
  Diff
}
