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
            // path: `/pages/search/search`
            path: `/pages/kanpan/kanpan?page=search`
        }
    },

    onSearchBarClearEvent: function (e) {
        var that = this
        SearchBar.onSearchBarClearEvent(e, that)

        that.data.stockArray = []
        that.setData(that.data)
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
                that.data.stockArray = []
                that.setData(that.data)
                that.data.stockArray = result
                that.setData(that.data)
            }, function (res) {
                console.log("------fail----", res)
            });

        } else {
            that.data.stockArray = []
            that.setData(that.data)
            that.setData({
                stockArray: viewmodel.getDefaultData()
            })
        }
    },

    onAddOrDelStock: function (e) {
        console.log("onAddOrDelStock", e)
        var that = this

        var stocks = that.data.stockArray

        that.data.stockArray = []
        that.setData(that.data)

        var stock = stocks[e.currentTarget.id]
        stock.setOptional(!stock.optional)

        that.data.stockArray = stocks

        that.setData(that.data)

        Api.stock.commitOptionals({
            goodsId: stock.goodsId
        }).then(function (res) {
            console.log("添加自选股", res)
        }, function (res) {
            console.log("添加自选股", res)
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