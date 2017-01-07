
var SearchItem = require('../../models/SearchItem.js')

var MinuteData = require('../../models/MinuteData.js')
var KLineData = require('../../models/KLineData.js')
var NewsItem = require('../../pages/stock/NewsItem.js')
var PbUtil = require('../../utils/PbUtil.js')
var Util = require('../../utils/util.js')
var GoodsParams = require('../../models/GoodsParams.js')
var Quotation = require('../../models/Quotation.js')
var RelativeItem = require('../../pages/bk/RelativeItem.js')
var BkQuotation = require('../../pages/bk/BkQuotation.js')


// 解析搜索数据
function parseSearchData(array) {
    var results = []

    for (var i = 0; i < array.length; i++) {
        var item = new SearchItem(array[i].secuName, array[i].secuId)
        results.push(item)
    }

    return results
}

// 解析分时数据
function parseMinutesData(data) {
    var array = data.trend_line
    var minutes = []

    if (array != null && array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            var item = new MinuteData(array[i].time, array[i].price, array[i].ave, array[i].volume, array[i].amount)
            minutes.push(item)
        }
    }

    var result = {
        close: data.close,
        goods_id: data.goods_id,
        market_date: data.market_date,
        minutes: minutes
    }

    return result
}

// 解析k线数据
function parseKLinesData(array) {
    var results = []
    for (var i = array.length - 1; i >= 0; i--) {
        var item = new KLineData(array[i].datetime, array[i].open, array[i].high, array[i].low, array[i].close, array[i].ma5, array[i].ma10, array[i].ma20, array[i].amount, array[i].price, array[i].volume)
        results.push(item)
    }
    return results
}

// 解析新闻列表
function parseNewsData(data) {
    var news = data.news
    var array = []

    for (var i = 0; i < news.length; i++) {
        var item = news[i]
        var newsItem = new NewsItem(item.content_url, item.from, item.new_id, item.pt, item.sortid, item.title)
        array.push(newsItem)
    }

    var result = {}
    var cls = data.cls
    result.cls = cls
    result.stock = data.stock
    if (cls == '0') {
        result.news = array
    } else if (cls == '1') {
        result.notices = array
    } else if (cls == '2') {
        result.research = array
    }

    return result
}

// 解析个股行情数据
function parseStockQuotationValue(data) {
    console.log('parseStockQuotationValue', data)
    var quotas = data.quota_value
    if (quotas != null && quotas.length > 0) {
        var ids = data.rep_fields
        var values = data.quota_value[0].rep_field_value

        // 是否停牌
        var suspendFlag = PbUtil.getPbValue(ids, values, GoodsParams.SUSPENSION)
        var isSusPend = suspendFlag == '1'

        var price = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZXJ), isSusPend, Util.formatPrice, '停牌')
        var zd = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZHANGDIE), isSusPend, Util.formatZd, '--')
        var zdColor = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZHANGDIE), isSusPend, Util.getColorByZd, '#e64340')
        var zdf = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZDF), isSusPend, Util.formatZdf, '--')
        // console.log(price,zd,zdf, zdColor)

        var open = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.OPEN), isSusPend, Util.formatPrice, '--')
        var high = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.HiGH), isSusPend, Util.formatPrice, '--')
        var low = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.LOW), isSusPend, Util.formatPrice, '--')
        // console.log(open,high,low)

        var hsl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.HSL), isSusPend, Util.formatHsl, '--')
        var syl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.SYL), isSusPend, Util.formatSyl, '--')
        var sjl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.SJL), isSusPend, Util.formatSyl, '--')
        // console.log(hsl, syl, sjl)

        var cjl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.VOLUME) / 100, isSusPend, Util.formatVolumn, '--')
        var jl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.JL), isSusPend, Util.formatJl, '--')
        var zsz = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZSZ), isSusPend, Util.formatAmount, '--')
        // console.log(cjl, jl, zsz)

        var amount = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.AMOUNT) / 1000, isSusPend, Util.formatAmount, '--')
        var lb = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.LB), isSusPend, Util.formatSyl, '--')
        var ltsz = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.LTSZ), isSusPend, Util.formatAmount, '--')
        // console.log(amount, lb, ltsz)

        var date = data.cur_update_market_date
        var time = data.cur_update_market_time
        var id = data.quota_value[0].goods_Id

        //  Quotation(price, zd, zdf, open, high, low, hsl, syl, sjl, cjl, jl, zsz, amount, lb, ltsz, date, time, color, goodsId) 
        return new Quotation(price, zd, zdf, open, high, low, hsl, syl, sjl, cjl, jl, zsz, amount, lb, ltsz, date, time, zdColor, id)
    }

    return null
}

// 解析版块行情数据
function parseBkQuotationValue(data) {
    var quotas = data.quota_value
    if (quotas != null && quotas.length > 0) {
        var ids = data.rep_fields
        var values = data.quota_value[0].rep_field_value

        // 是否停牌
        var suspendFlag = PbUtil.getPbValue(ids, values, GoodsParams.SUSPENSION)
        var isSusPend = suspendFlag == '1'

        var price = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZXJ), isSusPend, Util.formatPrice, '停牌')
        var zd = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZHANGDIE), isSusPend, Util.formatZd, '--')
        var zdColor = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZHANGDIE), isSusPend, Util.getColorByZd, '#e64340')
        var zdf = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZDF), isSusPend, Util.formatZdf, '--')
        // console.log(price,zd,zdf, zdColor)

        var open = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.OPEN), isSusPend, Util.formatPrice, '--')
        var high = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.HiGH), isSusPend, Util.formatPrice, '--')
        var low = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.LOW), isSusPend, Util.formatPrice, '--')
        // console.log(open,high,low)

        var hsl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.HSL), isSusPend, Util.formatHsl, '--')
        var zs = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.RISE), isSusPend, null, '--')
        var ds = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.FALL), isSusPend, null, '--')
        // console.log(hsl, zs, ds)

        var cjl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.VOLUME), isSusPend, Util.formatVolumn, '--')
        var jl = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.JL), isSusPend, Util.formatJl, '--')
        var pj = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.EQUAL), isSusPend, null, '--')
        // console.log(cjl, jl, pj)

        var amount = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.AMOUNT) / 1000, isSusPend, Util.formatAmount, '--')
        var lb = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.LB), isSusPend, Util.formatSyl, '--')
        var zf = formatQuota(PbUtil.getPbValue(ids, values, GoodsParams.ZHENFU), isSusPend, Util.formatZdf, '--')
        // console.log(amount, lb, zf, PbUtil.getPbValue(ids, values, GoodsParams.AMOUNT))

        var date = data.cur_update_market_date
        var time = data.cur_update_market_time
        var id = data.quota_value[0].goods_Id

        //  BkQuotation(price, zd, zdf, open, high, low, hsl, syl, sjl, cjl, jl, zsz, amount, lb, ltsz, date, time, color, goodsId) 
        return new BkQuotation(price, zd, zdf, open, high, low, hsl, zs, ds, cjl, jl, pj, amount, lb, zf, date, time, zdColor, id)
    }

    return null
}

// 是否格式化数据
function isformatData(value, isSusPend) {
    // 如果停牌且值为0，显示--，否则显示本值
    if (isSusPend && (value == 0 || value == '0')) {
        return false
    } else {
        return true
    }
}

function formatQuota(value, isSusPend, formatFunction, defaultValue) {
    if (isformatData(value, isSusPend)) {
        if (formatFunction == null) {
            return value
        } else {
            return formatFunction(value)
        }
    } else {
        return defaultValue
    }
}

// 解析关联item
function parseRelativeItem(data) {
    var quotas = []

    var size = data.total_size
    if (size > 0) {
        for (var i = 0; i < size; i++) {
            var fields = data.rep_fields
            var values = data.quota_value[i].rep_field_value

            var goodsId = data.quota_value[i].goods_Id
            var goodsName = PbUtil.getPbValue(fields, values, GoodsParams.GOODS_NAME)
            var goodsCode = Util.formatCode(goodsId)
            var price = Util.formatPrice(PbUtil.getPbValue(fields, values, GoodsParams.ZXJ))
            var zdf = Util.formatZdf(PbUtil.getPbValue(fields, values, GoodsParams.ZDF))
            var zdfColor = Util.getColorByZd(PbUtil.getPbValue(fields, values, GoodsParams.ZHANGDIE))

            // RelativeItem(name, code, price, zdf, color)
            quotas.push(new RelativeItem(goodsId, goodsName, goodsCode, price, zdf, zdfColor))
        }
    }

    return {
        date: data.cur_update_market_date,
        time: data.cur_update_market_time,
        relatives: quotas
    };
}

//解析自选股详情
function parseCustomDetail(data) {
    var quotas = [];

    var size = data.total_size;
    if (size > 0) {
        for (var i = 0; i < size; i++) {
            var fields = data.rep_fields;
            var values = data.quota_value[i].rep_field_value;

            var tGoodsId = data.quota_value[i].goods_Id;
            var tCode = Util.formatCode(tGoodsId);
            var tName = PbUtil.getPbValue(fields, values, GoodsParams.GOODS_NAME);
            var tZxj = Util.formatPrice(PbUtil.getPbValue(fields, values, GoodsParams.ZXJ));
            var tZdf =  Util.formatZdf(PbUtil.getPbValue(fields, values, GoodsParams.ZDF));
            var tZdfValue=PbUtil.getPbValue(fields, values, GoodsParams.ZDF);
            var tZd_original = PbUtil.getPbValue(fields, values, GoodsParams.ZHANGDIE);
            var tIntZd = parseInt(tZd_original);
            var tZd = Util.formatPrice(tZd_original);
            var tsuspension=PbUtil.getPbValue(fields, values, GoodsParams.SUSPENSION);
            if(tsuspension==1){
                tZd=0;
            }

            var tGoods = {
                goodsid: tGoodsId,
                name: tName,
                code: tCode,
                zxj: tZxj,
                zdf: tZdf,
                zd: tZd,
                intZd: tIntZd,
                suspension:tsuspension,
                zdfValue:tZdfValue
            }


            quotas.push(tGoods);
        }
    }

    return {
        // date: data.cur_update_market_date,
        // time: data.cur_update_market_time,
        customDetail: quotas
    };
}

module.exports = {
    parseSearchData: parseSearchData,
    parseMinutesData: parseMinutesData,
    parseKLinesData: parseKLinesData,
    parseNewsData: parseNewsData,
    parseStockQuotationValue: parseStockQuotationValue,
    parseBkQuotationValue: parseBkQuotationValue,
    parseRelativeItem: parseRelativeItem,
    parseCustomDetail: parseCustomDetail
}
