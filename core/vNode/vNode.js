export default class VNode {
  constructor(
    tag, // 标签类型：DIV,SPAN,INPUT, #TEXT
    ele, // 真实节点
    children, // 当前节点下的子节点
    text, // 当前节点下的文本
    data, // VNodeData，暂时保留，暂无意义
    parent, //  当前节点下的父节点
    nodeType // 节点类型
  ) {
    this.tag = tag
    this.ele = ele
    this.children = children
    this.text = text
    this.data = data
    this.parent = parent
    this.nodeType = nodeType
    this.env = {} // 当前节点的环境变量
    this.instructions = null //存放指令
  }
}
