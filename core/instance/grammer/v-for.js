import { getObjectVal } from '../../util/objectUtil.js'
import VNode from '../../vNode/vNode.js'

export function vforInit(vm, el, parent, instructions){
  let vnodeTemplate = new VNode(el.nodeName, el, [], '', getInstructionsData(instructions)[2], parent, 0)
  vnodeTemplate.instructions = instructions
  //删除指令元素
  parent.el.removeChild(el)
  parent.el.appendChild(document.createTextNode(""));
  let resultSet = analysisInstructions(vm, instructions, el, parent)
  return vnodeTemplate // 返回虚拟节点
}

// 指令转化数组 '(key,index) in list' ==> ['(key,index)', 'in', 'list]
function getInstructionsData(instructions){
  let insSet = instructions.trim().split(' ')
  if(insSet.length != 3 || insSet[1] != 'in' && insSet[1] != 'of'){
    throw new Error(instructions + " error")
  }
  return insSet
}

// 分析指令创建节点
function analysisInstructions(vm, instructions, el, parent){
  let insSet = getInstructionsData(instructions)
  let dataSet = getObjectVal(vm._data, insSet[2])
  if(!dataSet){
    throw new Error(dataSet + "is not define")
  }
  let resultSet = []
  //由vnodeTemplate生成节点
  for (let i = 0; i < dataSet.length; i++) {
    let itemDom = document.createElement(el.nodeName)
    itemDom.innerHTML = el.innerHTML
    let env = analysisKV(insSet[0], dataSet[i], i) // 获取局部变量
    itemDom.setAttribute('env',JSON.stringify(env));// 将变量设置到dom中
    parent.el.appendChild(itemDom) // 插入到父节点中
    resultSet.push(itemDom)
  }
  return resultSet // 将创捷的节点返回
}

//获取局部变量
function analysisKV(partVar, value, index){
  // 检测是否有括号
  if(/\([A-Za-z0-9_$,]+\)/.test(partVar)){
    partVar = partVar.trim().slice(1,partVar.length-1 )
  }
  let keys = partVar.split(',')
  if(keys.length == 0){
    throw new Error(keys + " error")
  }
  let obj = {}
  if(keys.length >= 1){
    obj[keys[0].trim()] = value
  }
  if(keys.length >= 2){
    obj[keys[1].trim()] = index
  }
  return obj
}
