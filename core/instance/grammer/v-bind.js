import { getObjectVal, getEnvAttr } from '../../util/objectUtil.js'
import { generateCode, expressionIsTrue } from '../../util/code.js'

export function checkVBind(vm, vnode) {
  if (vnode.nodeType != 1) {
    return
  }
  let attrNames = vnode.el.getAttributeNames()
  for (let i = 0; i < attrNames.length; i++) {
    if (
      attrNames[i].indexOf('v-bind:') != -1 ||
      attrNames[i].indexOf(':') != -1
    ) {
      vBind(vm, vnode, attrNames[i], vnode.el.getAttribute(attrNames[i]))
    }
  }
}

function vBind(vm, vnode, name, value) {
  let k = name.split(':')[1]

  if (/^{[\w\W]+}$/.test(value)) {
    //带{}
    let str = value.slice(1, value.length - 1).trim()
    let expressionList = str.split(',')
    let result = analysisExpression(vm, vnode, expressionList)
    vnode.el.setAttribute(k, result)
  } else {
    let v = getObjectVal(vm._data, value)
    vnode.el.setAttribute(k, v)
  }
}

function analysisExpression(vm, vnode, expressionList) {
  // 获取当前环境变量
  let envAttr = getEnvAttr(vm, vnode)
  // 判断表达式是否成立
  let envCode = generateCode(envAttr)
  // 拼接result
  let result = ''
  for (let i = 0; i < expressionList.length; i++) {
    let site = expressionList[i].indexOf(':')
    if (site > -1) {
      let code = expressionList[i].slice(site + 1)
      if (expressionIsTrue(code, envCode)) {
        result += expressionList[i].slice(0, site) + ' '
      }
    } else {
      //没有设置判断属性值
      // result += expressionList[i] + " "
      result += ''
    }
  }
  if (result.length > 0) {
    result = result.slice(0, -1) //去掉最后的","
  }
  return result
}
