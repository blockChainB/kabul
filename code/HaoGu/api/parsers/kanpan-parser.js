var Kanpan = require('../../models/Kanpan.js')
var Util = require('../../utils/util.js')

// 解析热门版块
function parseHotBKData(data) {
    //数组
    var bkArr = [];

    var size = data.length
    if (size > 0) {
        for (var i = 0; i < size; i++) {
            var bkId = data[i].goods_id
            var code = Util.formatCode(data[i].goods_id)
            var bkName = data[i].rep_field_value[0]
            var zxj = Util.formatPrice(data[i].rep_field_value[1])
            var zdf = data[i].rep_field_value[2]
            var zdfDisplay = Util.formatZdf(data[i].rep_field_value[2])
            var goodsName = data[i].rep_field_value[3]

            bkArr.push(new Kanpan.BKInfo(bkId, code, bkName, goodsName, zxj, zdf, zdfDisplay))
        }
    }
    return bkArr;
}

// 解析看盘
function parseKanpanData(data) {
    //数组
    var goodsArr = [];
    var size = data.length
    if (size > 0) {
        for (var i = 0; i < size; i++) {
            var id = data[i].stock_code
            var code = Util.formatCode(data[i].stock_code)
            var name = data[i].stock_name
            var price = Util.formatPrice(data[i].rep_field_value[0])
            var zdf = data[i].rep_field_value[1]
            var zdfDisplay = Util.formatZdf(data[i].rep_field_value[1])
            var date = new Date(Date.parse(data[i].date_time.replace(/-/g, "/")))
            var formate = date.today() ? "HH:mm" : "MM-dd"
            var time = Util.formateTime(date, formate)
            var suspension = data[i].rep_field_value[2];
            if (suspension == 1) {
                zdf = 0;
            }
            goodsArr.push(new Kanpan.Goods(id, code, name, price, zdf, zdfDisplay, time, suspension))
        }
    }

    return goodsArr;
}

module.exports = {
    parseHotBKData: parseHotBKData,
    parseKanpanData: parseKanpanData
}
