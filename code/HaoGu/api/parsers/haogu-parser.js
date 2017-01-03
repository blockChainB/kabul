
// models
function HaoGuItem(data) {

    // this.name = data.secucategoryname
    // this.desp = "沪深两市12月28日涨停" + data.stockCount + "只，初选" + data.selectCount + "只个股"

    // var stocks = []
    // for (let i = 0; i < data.stocklist.length; i++) {
    //     var stock = {
    //         name: data.stocklist[i].SecuAbbr,
    //         code: data.stocklist[i].SecuCode,
    //         type: data.stocklist[i].isSystem,
    //     }
    // }

    // this.stocks = stocks

    this.name = "强者恒强"
    this.desp = "沪深两市12月28日涨停89只，初选8只个股"
    this.time = "07-12 09:00"
    this.stocks = [
        [{
            name: "青岛啤酒",
            code: "600600"
        }, {
            name: "西山煤电",
            code: "000983"
        }, {
            name: "沂蒙股份",
            code: "600600"
        }, {
            name: "江峰磁材",
            code: "600600"
        }], [{
            name: "青岛啤酒",
            code: "600600"
        }, {
            name: "青岛啤酒",
            code: "600600"
        }, {
            name: "合众思壮",
            code: "600600"
        }]
    ]
}

// parse
function parseHaoguData(data) {
    var results = []
    for (let i = 0; i < 4; i++) {
        var item = new HaoGuItem("aaa")
        results.push(item)
    }
    return results

    // for (let i = 0; i < data.length; i++) {
    //     var item = new HaoGuItem(data[i])
    //     results.push(item)
    // }
    // return results
}

module.exports = {
    parseHaoguData: parseHaoguData
}