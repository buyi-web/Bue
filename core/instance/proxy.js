const arrayProto = Array.prototype

/**
 * 代理data
 * @param {*} vm Bue对象
 * @param {*} obj 代理的对象
 * @param {*} namespace
 */
export function constructProxy(vm, obj, namespace) {
  let proxyObj = null
  if (obj instanceof Array) {
    proxyObj = new Array(obj.length)
    // 对数组中的每一项进行代理
    for (let i = 0; i < obj.length; i++) {
      proxyObj[i] = constructProxy(vm, obj[i], namespace)
    }
    //对数组进行代理
    proxyObj = constructArrayProxy(vm, obj, namespace)
  } else if (obj instanceof Object) {
    proxyObj = constructObjectProxy(vm, obj, namespace)
  } else {
    throw new Error(obj + ' type error')
  }
  return proxyObj
}

//代理Object类型
function constructObjectProxy(vm, obj, namespace) {
  let proxyObj = {}
  for (const prop in obj) {
    Object.defineProperty(proxyObj, prop, {
      enumerable: true,
      get() {
        return obj[prop]
      },
      set(val) {
        console.log(getNameSpace(namespace, prop))
        obj[prop] = val
      },
    })

    //data中的属性代理到vm上
    !namespace && Object.defineProperty(vm, prop, {
      enumerable: true,
      get() {
        return obj[prop]
      },
      set(val) {
        console.log(prop)
        obj[prop] = val
      }
    })
    if (obj[prop] instanceof Object) {
      proxyObj[prop] = constructProxy(
        vm,
        obj[prop],
        getNameSpace(namespace, prop)
      )
    }
  }
  return proxyObj
}

// 代理数组
function constructArrayProxy(vm, arr, namespace) {
  let obj = {
    push() {},
    shift() {},
    pop() {},
    unshift() {},
  }
  defArrayFunc(obj, 'push', namespace, vm)
  defArrayFunc(obj, 'shift', namespace, vm)
  defArrayFunc(obj, 'pop', namespace, vm)
  defArrayFunc(obj, 'unshift', namespace, vm)
  arr.__proto__ = obj
  return arr
}

//代理数组方法
function defArrayFunc(obj, func, namespace, vm) {
  Object.defineProperty(obj, func, {
    enumerable: true,
    configurable: true,
    value(...arg) {
      let original = arrayProto[func]
      const result = original.apply(this, arg)
      console.log(namespace, '')
      return result
    },
  })
}
/**
 * 获取命名空间 vm.obj.x
 * @param {*} namespace obj
 * @param {*} prpo x
 */
function getNameSpace(namespace, prop) {
  if (namespace == null || namespace == '') {
    return prop
  } else if (prop == null || prop == '') {
    return namespace
  } else {
    return namespace + '.' + prop
  }
}
