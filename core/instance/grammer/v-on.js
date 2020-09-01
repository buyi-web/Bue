
export function checkVOn(vm, vnode){
  if(vnode.nodeType != 1){
    return;
  }
  let attrNames = vnode.el.getAttributeNames()
  for (let i = 0; i < attrNames.length; i++) {
    if ( attrNames[i].indexOf('v-on:') != -1 || attrNames[i].indexOf('@') != -1) {
      let event = attrNames[i].indexOf('v-on:') != -1 ? attrNames[i].split(":")[1] : null
      event = attrNames[i].indexOf('@') != -1 ? attrNames[i].slice(1) : event
      console.log(attrNames[i], event);
      vOn(vm, vnode, event, null)
    }
  }
}

function vOn(vm, vnode, event, name){

}
