import { getObjectVal } from "../util/objectUtil.js"

//通过模板找那些节点用到了该模板
let template2Vnode = new Map()
//通过节点找哪些模板用到了该节点
let vnode2Template = new Map()

export function renderMinix(Bue) {
  Bue.prototype._render = function(){
    renderNode(this, this._vnode)
  }
}

//数据变化后的节点渲染
export function renderData(vm, data){
  let vnodes = template2Vnode.get(data)
  if(vnodes != null){
    for (let i = 0; i < vnodes.length; i++) {
      renderNode(vm, vnodes[i])
    }
  }
}

//渲染节点
function renderNode(vm, vnode){
  if(vnode.nodeType == 3){
    //文本节点
    let templates = vnode2Template.get(vnode)
    if(templates){
      let result = vnode.text
      for (let i = 0; i < templates.length; i++) {
        /**
         *vm._data: 来自Bue里data中的属性
         * vnode.env：来自父级节点中的值 例：v-for:item in list 中的item
         */
        let templateRenderVal = getTemplateRenderVal([vm._data, vnode.env], templates[i])
        if(templateRenderVal != null) {
          let reg = new RegExp('{{[\\s]*'+ templates[i] +'[\\s]*}}', 'g')
          result = result.replace(reg, templateRenderVal) //将{{ }}中的值替换
        }
      }
      vnode.el.nodeValue = result
    }
  } else if(vnode.nodeType == 1 && vnode.tag == 'INPUT'){
    // input标签v-model
    let templates = vnode2Template.get(vnode);
    if(templates){
      for (let i = 0; i < templates.length; i++) {
        let templateRenderVal = getTemplateRenderVal([vm._data, vnode.env], templates[i])
        if(templateRenderVal != null){
          vnode.el.value = templateRenderVal
        }
      }
    }
  } else{
    for (let i = 0; i < vnode.children.length; i++) {
      renderNode(vm, vnode.children[i])
    }
  }
}

// 获取模板中需要渲染的页面上的值
function getTemplateRenderVal(dataObjs, template){
  for (let i = 0; i < dataObjs.length; i++) {
    let temp = getObjectVal(dataObjs[i], template)
    if(temp != null){
      return temp
    }
  }
  return null
}
// 预渲染
export function prepareRender(vm, vnode) {
  if (vnode == null) {
    return
  }
  analysisAttr(vm, vnode)
  if (vnode.nodeType == 3) {
    // 文本节点
    analysisTemplateString(vnode)
  }
  if(vnode.nodeType == 0){
    // 虚拟节点
    setTemplate2Vnode(vnode.data, vnode)
    setVnode2Template(vnode.data, vnode)
  }

  for (let i = 0; i < vnode.children.length; i++) {
    prepareRender(vm, vnode.children[i])
  }

}

function analysisTemplateString(vnode) {
  let templateStrList = vnode.text.match(/{{[\s\w.]+}}/g)
  if (templateStrList) {
    for (let i = 0; i < templateStrList.length; i++) {
      setTemplate2Vnode(templateStrList[i], vnode)
      setVnode2Template(templateStrList[i], vnode)
    }
  }
}

function setTemplate2Vnode(template, vnode) {
  let templateContent = getTemplateContent(template)
  let vnodeSet = template2Vnode.get(templateContent)
  if (vnodeSet) {
    vnodeSet.push(vnode)
  } else {
    template2Vnode.set(templateContent, [vnode])
  }
}

function setVnode2Template(template, vnode) {
  let templateSet = vnode2Template.get(vnode)
  if (templateSet) {
    templateSet.push(getTemplateContent(template))
  } else {
    vnode2Template.set(vnode, [getTemplateContent(template)])
  }
}

// 获取模板内容 {{ content }} --> content
function getTemplateContent(template) {
  if (
    template.slice(0, 2) == '{{' &&
    template.slice(template.length - 2) == '}}'
  ) {
    return template.slice(2, template.length - 2).trim()
  } else {
    return template.trim()
  }
}

export function getTemplate2VnodeMap(){
  return template2Vnode
}

export function getVnode2TemplateMap(){
  return vnode2Template
}

//分析节点中的属性(指令)
function analysisAttr(vm, vnode){
  if(vnode.nodeType == 1){
    let attrs = vnode.el.getAttributeNames()
    if(attrs.includes("v-model")){
      setTemplate2Vnode(vnode.el.getAttribute('v-model'), vnode)
      setVnode2Template(vnode.el.getAttribute('v-model'), vnode)
    }
  }
}

export function getVNodeByTemplate(template){
  return template2Vnode.get(template);
}

export function clearMap(){
  template2Vnode.clear();
  vnode2Template.clear()
}
