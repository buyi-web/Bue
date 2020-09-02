import { initMinix } from './init.js'
import { renderMinix } from './render.js'
function Bue(options) {
  this._init(options)

  this._render()
}

initMinix(Bue)
renderMinix(Bue)
export default Bue
