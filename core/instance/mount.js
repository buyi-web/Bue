import VNode from '../vNode/vNode.js'
import { prepareRender, getTemplate2VnodeMap, getVnode2TemplateMap } from './render.js'

export function ininMount(Bue) {
  Bue.prototype.$mount = function (el) {
    let vm = this
    let root = document.getElementById(el.slice(1))
    mount(vm, root)
  }
}

export function mount(vm, el) {
  vm._vNode = constructVNode(vm, el, null)
  // 进行预备渲染
  prepareRender(vm, vm._vNode)
  console.log(getTemplate2VnodeMap());
  console.log(getVnode2TemplateMap());
}

// 构建虚拟节点
function constructVNode(vm, el, parent) {
  //深度优先搜索
  // 定义虚拟节点及基本属性
  let vNode = null,
    children = [],
    text = getNodeText(el),
    data = null,
    nodeType = el.nodeType,
    tag = el.nodeName
  vNode = new VNode(tag, el, children, text, data, parent, nodeType)

  let childNodes = vNode.el.childNodes // 当前节点下的子节点
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
