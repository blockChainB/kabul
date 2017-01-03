var Service = require('./service.js')

var parser = require("./parsers/haogu-parser.js")
var Util = require('../utils/util.js')

// 好股列表
function getHaoguList({key = ""} = {}) {

    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'GET',
        data: {
            key: key,
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