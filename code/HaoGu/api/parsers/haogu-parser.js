
var Util = require('../../utils/util.js')

// models
function HaoGuSelectItem(desp, time, stocks) {
    this.desp = desp
    this.time = time

    var groups = []
    var array = []
    for (let i = 0; i < stocks.length; i++) {
        var code = Util.formatCode(stocks[i].stock_code)
        var stock = {
            goodsId: stocks[i].stock_code,
            name: stocks[i].stock_name,
            code: code
        }
        array.push(stock)
        if (i % 4 == 3 || i == stocks.length - 1) {
            groups.push(array)
            array = []
        }
    }

    this.stocks = groups
}

function HaoGuItem(data) {
    this.name = data.secucategoryName
    this.type = data.secucategory
    this.desp = data.describe

    this.items = []

    if (data.ultimateList.length > 0) {
        var desp = "终选个股  "// + data.ultimateList.length + "只"
        // var time = data.ultimateTime

        var date = new Date(Date.parse(data.ultimateTime.replace(/-/g, "/")))
        var formate = date.today() ? "HH:mm" : "MM月dd日"
        var time = Util.formateTime(date, formate)
        var finalItem = new HaoGuSelectItem(desp, time, data.ultimateList)

        this.items.push(finalItem)
    }

    var desp = "初选个股  "// + data.primaryList.length + "只"
    var date = new Date(Date.parse(data.primaryTime.replace(/-/g, "/")))
    var formate = date.today() ? "HH:mm" : "MM月dd日"
    var time = Util.formateTime(date, formate)
    var originalItem = new HaoGuSelectItem(desp, time, data.primaryList)

    this.items.push(originalItem)
}

// parse
function parseHaoguData(data) {
    var results = []
    for (let i = 0; i < data.length; i++) {
        var item = new HaoGuItem(data[i])
        results.push(item)
    }

    return results
}

module.exports = {
    parseHaoguData: parseHaoguData
}