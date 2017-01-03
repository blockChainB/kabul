var Api = require('../../api/api.js');
var SearchBar = require('../common/SearchBar/SearchBar.js')

var optionalUtil = require('../../utils/optionalUtil.js')

Page({
    data: {
        stockArray: [],
    },

    onReady: function () {
        var that = this
        SearchBar.init("代码/名称/简拼", that)
    },

    onSearchBarClearEvent: function (e) {
        var that = this
        SearchBar.onSearchBarClearEvent(e, that)

        that.setData({
            stockArray: []
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
            goodsId:stock.code
        }).then(function (res) {
            console.log("添加自选股", res)
        }, function (res) {
            console.log("添加自选股", res)
        })

        // Api.stock.requestOptionals({
            
        // }).then(function (res) {
        //     console.log("添加自选股", res)
        // }, function (res) {
        //     console.log("添加自选股", res)
        // })
    },

    onShowStockDetail: function (e) {
        console.log("onShowStockDetail", e)

        if (e.detail.x < 315) {
            var code = e.currentTarget.id.replace(">", "")
            wx.navigateTo({
                url: '../stock/stock?code=' + code,
            })
        }
    }
})