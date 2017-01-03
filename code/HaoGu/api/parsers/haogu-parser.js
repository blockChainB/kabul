
// models

function testData() {
    return [
        {
            "tradedate": "2016-12-28",       //--入选时间  
            "stockCount": 39,                //--总共股票只数
            "selectCount": 5,                //--入选股票只数
            "secucategoryname": "强者恒强",    // --名称
            "secucategory": "001001",        //--类型（强者恒强001001、缺口模块001014、题材领涨001018、黄金K线）
            "stocklist": [
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 2            //--类型（1初选2终选）
                },
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 1            //--类型（1初选2终选）
                },
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 1            //--类型（1初选2终选）
                },
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 2            //--类型（1初选2终选）
                },
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 2            //--类型（1初选2终选）
                },
            ]
        },
        {
            "tradedate": "2016-12-28",       //--入选时间  
            "stockCount": 39,                //--总共股票只数
            "selectCount": 5,                //--入选股票只数
            "secucategoryname": "强者恒强",    // --名称
            "secucategory": "001001",        //--类型（强者恒强001001、缺口模块001014、题材领涨001018、黄金K线）
            "stocklist": [
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 1            //--类型（1初选2终选）
                },
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 2            //--类型（1初选2终选）
                },
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 2            //--类型（1初选2终选）
                },
            ]
        },
        {
            "tradedate": "2016-12-28",       //--入选时间  
            "stockCount": 39,                //--总共股票只数
            "selectCount": 5,                //--入选股票只数
            "secucategoryname": "强者恒强",    // --名称
            "secucategory": "001001",        //--类型（强者恒强001001、缺口模块001014、题材领涨001018、黄金K线）
            "stocklist": [
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 1            //--类型（1初选2终选）
                }
            ]
        },
        {
            "tradedate": "2016-12-28",       //--入选时间  
            "stockCount": 39,                //--总共股票只数
            "selectCount": 5,                //--入选股票只数
            "secucategoryname": "强者恒强",    // --名称
            "secucategory": "001001",        //--类型（强者恒强001001、缺口模块001014、题材领涨001018、黄金K线）
            "stocklist": [
                {
                    "SecuCode": "000737",    //--股票代码
                    "SecuAbbr": "南风化工",   //--股票名称
                    "isSystem": 1            //--类型（1初选2终选）
                },
            ]
        }
    ]
}

function HaoGuSelectItem(desp, time, stocks) {
    this.desp = desp
    this.time = time

    var groups = []
    var array = []
    for (let i = 0; i < stocks.length; i++) {
        array.push(stocks[i])
        if (i % 4 == 3 || i == stocks.length - 1) {
            groups.push(array)
            array = []
        }
    }

    console.log("groups", groups, stocks)

    this.stocks = groups
}

function HaoGuItem(data) {
    this.name = data.secucategoryname

    var originals = []
    var finals = []
    for (let i = 0; i < data.stocklist.length; i++) {
        let item = data.stocklist[i]
        var stock = {
            name: item.SecuAbbr,
            code: item.SecuCode,
            selectType: item.isSystem
        }

        originals.push(stock)
        if (stock.selectType == 2) {
            finals.push(stock)
        }
    }

    var desp = "沪深两市12月28日涨停" + data.stockCount + "只，初选" + data.selectCount + "只个股"
    var time = "09:00"
    var originalItem = new HaoGuSelectItem(desp, time, originals)

    this.items = [originalItem]

    if (finals.length > 0) {

        var desp = "今日终选" + finals.length + "只股票"
        var time = "09:00"
        var finalItem = new HaoGuSelectItem(desp, time, finals)

        this.items.push(finalItem)

    }

    this.originalSelect = originals.length
    this.lineHeight1 = parseInt(this.originalSelect / 4) * 80 + 40
    this.finalSelect = finals.length
    this.lineHeight2 = parseInt(this.finalSelect / 4) * 80 + 40
}

// parse
function parseHaoguData(data) {

    // test
    data = testData()

    var results = []
    for (let i = 0; i < data.length; i++) {
        var item = new HaoGuItem(data[i])
        results.push(item)
    }

    console.log("haogu======", results)

    return results
}

module.exports = {
    parseHaoguData: parseHaoguData
}