
export function ininMount(Bue){
  Bue.prototype.$mount = function(el){
    let vm = this
    let root = document.getElementById(el.slice(1))
    mount(vm, root)
  }
}

export function mount(vm, el){
  vm._vNode = constructVNode(vm, el, null)
}

function constructVNode(vm, el, parent){

}
