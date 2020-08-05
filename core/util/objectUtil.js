
//获取对象中的属性值
export function getObjectVal(obj, key) {
  // 对象套对象 key == key.a
  if (!obj) return obj
  let keyList = key.split('.')
  let temp = obj
  for (let i = 0; i < keyList.length; i++) {
    if(temp[keyList[i]]){
      temp = temp[keyList[i]]
    }else{
      return undefined
    }
  }
  return temp
}
