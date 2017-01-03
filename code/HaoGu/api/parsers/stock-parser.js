
var SearchItem = require('../../models/SearchItem.js')

var MinuteData = require('../../models/MinuteData.js')
var KLineData = require('../../models/KLineData.js')
var NewsItem = require('../../pages/stock/NewsItem.js')

var Util = require('../../utils/util.js')

// 解析搜索数据
function parseSearchData(array){
    var results = []

    for (var i = 0; i < array.length; i++) {
        var item = new SearchItem(array[i].n, array[i].c)
        results.push(item)
    }

    return results
}

// 解析分时数据
function parseMinutesData(data) {
    var array = data.trend_line
    var minutes = []
    for (var i = 0; i < array.length; i++) {
        var item = new MinuteData(array[i].time, array[i].price, array[i].ave, array[i].volume, array[i].amount)
        minutes.push(item)
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
    result.cls = data.cls
    result.stock = data.stock
    result.news = array

    return result
}

module.exports = {
    parseSearchData: parseSearchData,
    parseMinutesData: parseMinutesData,
    parseKLinesData: parseKLinesData,
    parseNewsData: parseNewsData
}
