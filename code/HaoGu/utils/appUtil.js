
var Api = require('../api/api.js')

var Service = require('../api/service.js')
var Promise = Service.Promise
var StaticStrings = Service.StaticStrings

var newsUtil = require('newsUtil.js')

function getUid(app) {
    wx.login({
        success: function (res) {
            // success
            console.log("login sucesss", res)
            var code = res.code

            getUserId(code, "", "")

            // wx.getUserInfo({
            //     success: function (res) {
            //         // success
            //         console.log("========userinfo", res)

            //         getUserId(code, res.encryptedData, res.iv)
            //     },
            //     fail: function () {
            //         // fail
            //         console.log("get user info fail")
            //     },
            //     complete: function () {
            //         // complete
            //     }
            // })

            // wx.request({
            //     url: 'https://api.weixin.qq.com/sns/jscode2session',
            //     data: {
            //         appid: "wxcf49fea1d8e137ba",
            //         secret: "1df1ef42b8060f96d7752fe03569ab97",
            //         js_code: res.code,
            //         grant_type: "authorization_code"
            //     },
            //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            //     success: function (res) {
            //         console.log("=======truususususuususussuussu====res", res)
            //         app.globalData.uid = res.data.uid
            //         requestOptionals()
            //         loadReadNews()
            //     },
            //     fail: function (res) {
            //         console.log("get uid fail", res)
            //     },
            //     complete: function () {

            //     }
            // })
        },
        fail: function (res) {
            // fail
            console.log("login fail", res)
        },
        complete: function () {
            // complete
        }
    })
}


function getUserId(code, encrytedData, iv) {
    wx.request({
        url: 'https://wxapp.emoney.cn/haogu365/web/user/getid',
        data: {
            jsCode: code,
            encryptedData: encrytedData,
            iv: iv
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
            console.log("===============get user id sucess=res", res)

            if (res.statusCode == 200) {
                if (res.data.result.code == 0) {
                    getApp().globalData.uid = res.data.detail
                    requestOptionals()
                    loadReadNews()
                } else {
                    console.log("=========获取UID失败", res)
                }
            } else {
                console.log("=========获取UID失败", res)
            }
        },
        fail: function (res) {
            console.log("=========获取UID失败", res)
        },
    })
}

//网络类型
function getNetWorkType() {
    wx.getNetworkType({
        success: function (res) {
            getApp().globalData.netWorkType = res.networkType
        }
    })
}

function requestOptionals() {
    Api.stock.requestOptionals({

    }).then(function (res) {
        for (let i = 0; i < res.GoodsId.length; i++) {
            if (typeof (res.GoodsId[i]) == 'number') {
                getApp().globalData.optionals.push(res.GoodsId[i])
            }
        }

    }, function (res) {

    })
}

function loadReadNews() {
    newsUtil.loadReadNews()
}

module.exports = {
    getUid: getUid,
    getNetWorkType: getNetWorkType,
}