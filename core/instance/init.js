import { constructProxy } from './proxy.js'
import {mount} from './mount.js'
let uid = 0
export function initMinix(Bue) {
  Bue.prototype._init = function (options) {
    const vm = this
    this.uid = uid++
    this.isBue = true

    // 初始化data
    if (options && options.data) {
      vm._data = constructProxy(vm, options.data, '')
    }
    // 初始化created
    // 初始化methods
    // 初始化computed
    // 初始化el并挂载
    if (options && options.el) {
      let root = document.getElementById(options.el.slice(1))
      mount(vm, root)
    }
  }
}
