var Api = require('../../api/api.js');
var SearchBar = require('../common/SearchBar/SearchBar.js')

var optionalUtil = require('../../utils/optionalUtil.js')
var Util = require('../../utils/util.js')

let viewmodel = require('viewmodel.js')

Page({
    data: {
        stockArray: [],
    },

    onReady: function () {
        var that = this
        SearchBar.init("代码/名称/简拼", that)

        that.setData({
            stockArray: viewmodel.getDefaultData()
        })
    },

    onShareAppMessage: function () {
        return {
            title: '搜索',
            desc: `${getApp().globalData.shareDesc}`,
            path: `/pages/kanpan/kanpan?page=search`
        }
    },

    onSearchBarClearEvent: function (e) {
        var that = this
        SearchBar.onSearchBarClearEvent(e, that)

        that.setData({
            stockArray: viewmodel.getDefaultData()
        })
    },

    onSearchBarChangedEvent: function (e) {
        var that = this
        SearchBar.onSearchBarChangedEvent(e, that)

        if (e.detail.value.length > 0) {
            Api.stock.search({
                key: e.detail.value
            }).then(function (result) {
                that.data.stockArray = result
                that.setData(that.data)

                if (that.data.stockArray.length == 1) {
                    wx.hideKeyboard()
                    var stock = that.data.stockArray[0]
                    Util.gotoQuote(stock.goodsId, stock.name, stock.code)
                }

            }, function (res) {
                console.log("------fail----", res)
            });

        } else {
            that.setData({
                stockArray: viewmodel.getDefaultData()
            })
        }
    },

    onAddOrDelStock: function (e) {
        console.log("onAddOrDelStock", e)
        var that = this
        var stock = that.data.stockArray[e.currentTarget.id]

        Api.stock.commitOptionals({
            goodsId: stock.goodsId
        }).then(function (res) {
            if (res == 0) {
                stock.setOptional(!stock.optional)
                that.setData(that.data)
            }
        }, function (res) {
            console.log("添加自选股失败", res)
        })
    },

    onShowStockDetail: function (e) {
        console.log("onShowStockDetail", e)

        if (e.detail.x < 315) {
            var stock = e.currentTarget.dataset.stock
            Util.gotoQuote(stock.goodsId, stock.name, stock.code)
        }
    }
})