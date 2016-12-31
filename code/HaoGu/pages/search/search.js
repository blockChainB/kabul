var Api = require('../../api/api.js');
var SearchBar = require('../common/SearchBar/SearchBar.js')

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
                that.setData({
                    stockArray: result
                })
            }, function (res) {
                console.log("------fail----")
            });

        } else {
            that.setData({
                stockArray: []
            })
        }
    },

    onAddOrDelStock: function (e) {

    },

    onShowStockDetail: function (e) {

    },
})