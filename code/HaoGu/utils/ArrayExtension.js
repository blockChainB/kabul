
// 数组删除元素
Array.prototype.removeObject = function (obj) {
    if (this != undefined && this.constructor == Array) {
        var index = this.indexOf(obj)
        if (index > -1) {
            this.splice(index, 1);
        }
    }
}
