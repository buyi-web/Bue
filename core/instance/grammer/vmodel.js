import {setObjectVal} from '../../util/objectUtil.js'


export function vmodel(vm, el, data){
  el.oninput = function(e){
    setObjectVal(vm, data, el.value) //
  }
}
