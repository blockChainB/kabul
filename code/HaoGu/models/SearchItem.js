
var Util = require('../utils/util.js')
var optionalUtil = require('../utils/optionalUtil.js')

function SearchItem(name, goodsId) {

    this.name = name
    this.goodsId = goodsId
    this.code = Util.formateNumber(goodsId % 1000000, 6)

    // console.log("===========name, coee", name, goodsId, this.code)

    if (Util.isZS(goodsId)) {
        this.type = "指数"
    } else if (Util.isJiJin(goodsId)) {
        this.type = "基金"
    } else {
        if (this.code.indexOf("60") == 0) {
            this.type = "沪A"
        } else if (this.code.indexOf("000") == 0 || this.code.indexOf("002") == 0 || this.code.indexOf("300") == 0) {
            this.type = "深A"
        } else {
            this.type = ""
        }
    }

    this.setOptional(optionalUtil.isOptional(this.goodsId))
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