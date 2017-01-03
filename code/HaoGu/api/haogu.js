var Service = require('./service.js')

var parser = require("./parsers/haogu-parser.js")
var Util = require('../utils/util.js')

let BaseHaoguUrl = "http://192.168.8.189:1131/?X-Protocol-Id="

// 好股列表 listType:[]、全部，001001、强者恒强，001014、缺口模块，001018、题材领涨，001022、黄金K线
function getHaoguList({listType = []} = {}) {

    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'GET',
        data: {
            secucategory: listType,
            openid: getApp().globalData.openId
        },
        url: 'http://m.emoney.cn/getinfo/search.aspx',
    }).then(function (res) {
        var results = parser.parseHaoguData(res.detail)
        return results
        
        // if (res.result.code == 0) {
        //     var results = parser.parseHaoguData(res.detail)
        //     return results
        // } else {
        //     return []
        // }

    }, function (res) {
        return res
    });
    return promise;
}

module.exports = {
    getHaoguList: getHaoguList
}