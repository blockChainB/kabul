var Service = require('./service.js')
var Promise = Service.Promise
var StaticStrings = Service.StaticStrings

var parser = require('./parsers/kanpan-parser.js')
var StaticStrings = require('../utils/StaticStrings.js')


//热门板块
function getHotBK({uid} = {}) {
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'GET',
        data: {
            uid: uid,
        },
        url: `${Service.BaseHaoGuUrl}27200`,
    }).then(function (res) {
        //console.log("***********getHotBk:", res)
        if (res.statusCode == 200 && res.data.result.code == 0) {
            var results = parser.parseHotBKData(res.data.detail);
            return results
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise
}


//看盘
function getKanPan({secucategory, uid} = {}) {
    // console.log("***********getKanPan request secucategory:", secucategory)
    var promise = Service.requestOfTag({
        showLoading: false,
        showFailMsg: false,
        method: 'POST',
        data: {
            secucategory: secucategory,
            uid: uid,
        },
        url: `${Service.BaseHaoGuUrl}27100`,
    },secucategory).then(function (res) {
        //console.log("***********getKanPan:", res)
        if (res.res_data.statusCode == 200 && res.res_data.data.result.code == 0) {
            var results = parser.parseKanpanData(res.res_data.data.detail);
            return { category: res.res_tag, data: results }
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });

    return promise;
}

//获取系统时间
function getSystemTime({} = {}) {
    console.log("***********getSystemTime request")
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'GET',
        url: `${Service.BaseQuotaUrl}20000`,
    }).then(function (res) {
        console.log("***********getSystemTime:", res)
        if (res.statusCode == 200) {
            return res.data
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });

    return promise;
}

module.exports = {
    getHotBK: getHotBK,
    getKanPan: getKanPan,
    getSystemTime: getSystemTime,
}
