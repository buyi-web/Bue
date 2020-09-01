import VNode from '../vNode/vNode.js'
import { prepareRender, getVNodeByTemplate, clearMap} from './render.js'
import { vmodel } from './grammer/vmodel.js'
import { vforInit } from './grammer/v-for.js'
import { mergeAttr } from '../util/objectUtil.js'
import { checkVBind } from './grammer/v-bind.js'
import { checkVOn } from './grammer/v-on.js'

export function ininMount(Bue) {
  Bue.prototype.$mount = function (el) {
    let vm = this
    let root = document.getElementById(el.slice(1))
    mount(vm, root)
  }
}

export function mount(vm, el) {
  vm._vnode = constructVNode(vm, el, null)
  // 进行预备渲染
  prepareRender(vm, vm._vnode)
}

// 构建虚拟节点
function constructVNode(vm, el, parent) { // 深度优先搜索
  let vNode = analysisAttr(vm, el, parent); // 分析虚拟节点属性
    if(vNode == null){
       // 定义虚拟节点及基本属性
      let children = [],
          text = getNodeText(el),
          data = null,
          nodeType = el.nodeType,
          tag = el.nodeName
      vNode = new VNode(tag, el, children, text, data, parent, nodeType)
      if(el.nodeType == 1 && el.getAttribute("env")){
        vNode.env = mergeAttr(vNode.env, JSON.parse(el.getAttribute("env")))
      }else{
        vNode.env = mergeAttr(vNode.env, parent ? parent.env : {})
      }
    }
  checkVBind(vm, vNode)
  checkVOn(vm, vNode)
  let childNodes = vNode.nodeType == 0 ? vNode.parent.el.children : vNode.el.childNodes // 当前节点下的子节点
  for (let i = 0; i < childNodes.length; i++) {
    let childVNodes = constructVNode(vm, childNodes[i], vNode) // 构建子虚拟节点
    if (childVNodes instanceof VNode) {
      // 返回单一节点的时候
      vNode.children.push(childVNodes)
    } else {
      // 返回节点数组的时候 v-for
      vNode.children = vNode.concat(childNodes)
    }
  }
  return vNode
}

function getNodeText(el) {
  if (el.nodeType == 3) {
    return el.nodeValue
  } else {
    return ''
  }
}

//分析节点属性（指令）
function analysisAttr(vm, el, parent){
  if(el.nodeType == 1){
    let attrs = el.getAttributeNames()
    if(attrs.includes("v-model")){ // 处理v-model指令
      vmodel(vm, el, el.getAttribute("v-model"))
    }else if(attrs.includes("v-for")){
      return vforInit(vm, el, parent, el.getAttribute("v-for"))
    }
  }
}

export function rebuild(vm, template){

  let vnode = getVNodeByTemplate(template)
  for (let i = 0; i < vnode.length; i++) {
    vnode[i].parent.el.innerHTML = ""
    vnode[i].parent.el.appendChild(vnode[i].el)
    let result = constructVNode(vm, vnode[i].el, vnode[i].parent)
    vnode[i].parent.children = [result];
    clearMap()
    prepareRender(vm, vm._vnode)
  }
}
