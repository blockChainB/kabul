
var Util = require('../utils/util.js')
var optionalUtil = require('../utils/optionalUtil.js')

function SearchItem(name, code) {

    this.name = name

    code = code % 1000000
    this.code = Util.formateNumber(code)

    if (this.code.indexOf("60") == 0) {
        this.type = "沪A"
    } else {
        this.type = "深A"
    }

    this.setOptional(optionalUtil.isOptional(this.code))
}

SearchItem.prototype.setOptional = function (optional) {
    this.optional = optional
    if (this.optional) {
        this.optionPath = "../../images/icon_optional_del.png"
    } else {
        this.optionPath = "../../images/icon_optional_add.png"
    }
}


module.exports = SearchItem