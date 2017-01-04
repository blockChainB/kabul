import Promise from './lib/es6-promise-min';
var Service = require('./service.js')

var parser = require("./parsers/news-parser.js")

// 新闻详情
function requestNewsDetail({url = ""} = {}) {
    var promise = new Promise(function (resolve, reject) {
        Service.request({
            showLoading: false,
            showFailMsg: false,
            method: 'GET',
            data: {},
            url: url,
        }).then(function (res) {
            if (res.statusCode == 200) {
                if (res.data.code == 0) {
                    if (res.data.data.length > 0) {
                        var result = parser.parseDetailData(res.data.data[0])
                        resolve(result)
                    } else {
                        reject("请求失败0")
                    }
                } else {
                    reject("请求失败1")
                }
            } else {
                reject("请求失败2")
            }
        }, function (res) {
            reject("请求失败3")
        });
    })

    // var promise = Service.request({
    //     showLoading: false,
    //     showFailMsg: false,
    //     method: 'GET',
    //     data: {},
    //     url: url,
    // }).then(function (res) {
    //     if (res.statusCode == 200) {
    //         if (res.data.code == 0) {
    //             return res.data.data
    //         }
    //     } else {
    //         return {}
    //     }
    // }, function (res) {
    //     return res
    // });

    return promise;
}

module.exports = {
    requestNewsDetail: requestNewsDetail
}