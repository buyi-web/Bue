//通过模板找那些节点用到了该模板
let template2Vnode = new Map()
//通过节点找哪些模板用到了该节点
let vnode2Template = new Map()

export function renderMinix(Bue) {
  Bue.prototype._render = function(){
    renderNode(this, this._vnode)
  }
}

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
        let templateRenderVal = getTemplateRenderVal([vm._data, vnode.env], template[i])
      }
    }
  }else{
    for (let i = 0; i < vnode.children.length; i++) {
      renderNode(vm, vnode.children[i])
    }
  }
}

function getTemplateRenderVal(dataObjs, template){
  for (let i = 0; i < dataObjs.length; i++) {
    dataObjs[i];

  }
}
// 预渲染
export function prepareRender(vm, vnode) {
  if (vnode == null) {
    return
  }
  if (vnode.nodeType == 3) {
    // 文本节点
    analysisTemplateString(vnode)
  }
  if (vnode.nodeType == 1) {
    // 标签
    for (let i = 0; i < vnode.children.length; i++) {
      prepareRender(vm, vnode.children[i])
    }
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
