
var Service = require('./service.js')
var Promise = Service.Promise
var StaticStrings = Service.StaticStrings

var parser = require("./parsers/news-parser.js")

// 新闻详情
function requestNewsDetail({id = "", url = "", type = ""} = {}) {
    var promise = Service.request({
        showLoading: true,
        showFailMsg: true,
        method: 'GET',
        data: {
            id: id,
            type: type,
            url: url
        },
        // url: url,
        url: `${Service.BaseUrl}web/news/StockHtml`,
        // https://wxapp.emoney.cn/haogu365/web/news/StockHtml?type=&id=&url=
    }).then(function (res) {
        if (res.statusCode == 200) {
            if (res.data.code == 0) {
                if (res.data.data.length > 0) {
                    var result = parser.parseDetailData(res.data.data[0])
                    return result
                } else {
                    return Promise.reject(StaticStrings.kGetDataErrorInfo)
                }
            } else {
                return Promise.reject(StaticStrings.kGetDataErrorInfo)
            }
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });

    return promise;
}

module.exports = {
    requestNewsDetail: requestNewsDetail
}