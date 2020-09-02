import { getObjectVal } from '../../util/objectUtil.js'

export function checkVOn(vm, vnode){
  if(vnode.nodeType != 1){
    return;
  }
  let attrNames = vnode.el.getAttributeNames()
  for (let i = 0; i < attrNames.length; i++) {
    if ( attrNames[i].indexOf('v-on:') != -1 || attrNames[i].indexOf('@') != -1) {
      let event = attrNames[i].indexOf('v-on:') != -1 ? attrNames[i].split(":")[1] : null
      event = attrNames[i].indexOf('@') != -1 ? attrNames[i].slice(1) : event
      vOn(vm, vnode, event, vnode.el.getAttribute(attrNames[i]))
    }
  }
}

function vOn(vm, vnode, event, name){
  let method = getObjectVal(vm._methods, name)
  if(method){
    vnode.el.addEventListener(event, proxyEvecute(vm, method))
  }
}

function proxyEvecute(vm, method){
  return function(){
    method.call(vm)
  }
}

