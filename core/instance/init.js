
let uid = 0
export function initMinix (Bue) {
    Bue.prototype._init = function () {
        const vm = this
        this.uid = uid ++
        this.isBue = true
    }
}

