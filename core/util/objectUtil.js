
//获取对象中的属性值
export function getObjectVal(obj, key) {
  // 对象套对象 key == key.a
  if (!obj) return obj
  let keyList = key.split('.')
  let temp = obj
  for (let i = 0; i < keyList.length; i++) {
    if(temp[keyList[i]] != null){
      temp = temp[keyList[i]]
    }else{
      return undefined
    }
  }
  return temp
}

//设置对象中的属性值 包括data.obj.x
export function setObjectVal(obj, data, value){
  if(!obj){
    return
  }
  let attrList = data.split('.');
  let temp = obj;
  for(let i = 0; i < attrList.length - 1; i++){
    if(temp[attrList[i]]){
      temp = temp[attrList[i]]
    }else{
      return
    }
  }
  if(temp[attrList[attrList.length-1]] != null){
    temp[attrList[attrList.length-1]] = value
  }
}

export function mergeAttr(obj1, obj2){
  if(obj1 == null){
    return clone(obj2)
  }
  if(obj2 == null){
    return clone(obj1)
  }
  let result = {}
  let obj1Attrs = Object.getOwnPropertyNames(obj1)
  let obj2Attrs = Object.getOwnPropertyNames(obj2)
  for (let i = 0; i < obj1Attrs.length; i++) {
    result[obj1Attrs[i]] = obj1[obj1Attrs[i]];
  }
  for (let j = 0; j < obj2Attrs.length; j++) {
    result[obj2Attrs[j]] = obj2[obj2Attrs[j]];
  }
  return result
}

function clone(obj){
  if(obj instanceof Array){
    cloneArray(obj)
  }else if(obj instanceof Object){
    return cloneObject(obj)
  }else{
    return obj
  }
}

function cloneObject(obj){
  let result = {}
  let names = Object.getOwnPropertyNames(obj)
  for (let i = 0; i < names.length; i++) {
    result[names[i]] = clone(obj[names[i]]);
  }
  return result
}

function cloneArray(obj){
  let result = new Array(obj.length)
  for (let i = 0; i < obj.length; i++) {
    result[i] = clone(obj[i])
  }
  return result
}

export function getEnvAttr(vm, vnode){
  let result = mergeAttr(vm._data, vnode.env)
  result = mergeAttr(result, vm._computed)
  return result
}
