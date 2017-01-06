
var Service = require('./service.js')
var Promise = Service.Promise
var StaticStrings = Service.StaticStrings

var parser = require("./parsers/haogu-parser.js")
var Util = require('../utils/util.js')

// 好股列表 listType:[]、全部，001001、强者恒强，001014、缺口模块，001018、题材领涨，001022、黄金K线
function getHaoguList({listType = []} = {}) {

    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'POST',
        data: {
            secucategory: listType,
            uid: getApp().globalData.uid
        },
        url: `${Service.BaseHaoGuUrl}27000`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            if (res.data.result.code == 0) {
                var results = parser.parseHaoguData(res.data.detail)
                return results
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
    getHaoguList: getHaoguList
}