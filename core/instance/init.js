import { constructProxy } from './proxy.js'
import { mount } from './mount.js'
let uid = 0
export function initMinix(Bue) {
  Bue.prototype._init = function (options) {
    const vm = this
    this.uid = uid++
    this.isBue = true
    // 初始化created
    if (options && options.created) {
      vm._created = options.created
    }
    //初始化mounted
    if (options && options.mounted) {
      vm._mounted = options.mounted
    }
    // 初始化data
    if (options && options.data) {
      vm._data = constructProxy(vm, options.data, '')
      if(vm._created != null){
        vm._created.call(vm)
      }
    }
    // 初始化methods
    if (options && options.methods) {
      vm._methods = options.methods
      for (const func in options.methods) {
        vm[func] = options.methods[func]
      }
    }
    // 初始化computed
    if (options && options.computed) {
      vm._computed = options.computed
    }
    // 初始化el并挂载
    if (options && options.el) {
      let root = document.getElementById(options.el.slice(1))
      mount(vm, root)
      if(vm._mounted != null){
        vm._mounted.call(vm)
      }
    }
  }
}
