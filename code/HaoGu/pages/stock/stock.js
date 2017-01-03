var Api = require("../../api/api.js")
var KLineView = require('../common/KLineView/KLineView.js')
var NewsItem = require('NewsItem.js')

Page({

    data: {
        // 个股头部数据
        quotation: {
            price: '23.45',
            zd: '10.53',
            zdf: '5.53%',
            open: '21.66',
            high: '21.55',
            low: '50.27',
            hs: '1.50%',
            sy: '1.50',
            sj: '3.59',
            cjl: '21.55',
            jl: '-2796.3万',
            zz: '560亿',
            cje: '50.27',
            lb: '1.59',
            lz: '144.2亿'
        },
        goodsId: 600602,
        quotationColor: '#eb333b',
        currentTimeIndex: 0,
        currentInfoIndex: 0,
        quotePeriod: 1,
        quoteData: {
            canvasIndex: 0
        },
        news: [],
        infoSwiperHeight: 0,
        infoCls: '0'
    },

    onLaunch: function () {

    },

    onReady: function () {
        this.kLineView = new KLineView()
        
    },

    onShow: function () {
        // if (this.data.quotePeriod == 1) {
        //     this.getMinuteData(this.data.goodsId, getCanvasId(this.data.quotePeriod), function () {
        //         wx.hideNavigationBarLoading()
        //     })
        // } else {
        //     this.getKlineData(this.data.goodsId, getCanvasId(this.data.quotePeriod), function () {
        //         wx.hideNavigationBarLoading()
        //     })
        // }
        // this.getNews('600600', '0', function() {
        //     wx.hideNavigationBarLoading()
        // })
    },

    onPullDownRefresh: function (event) {
        // if (this.data.quotePeriod == 1) {
        //     this.getMinuteData(this.data.goodsId, getCanvasId(this.data.quotePeriod), function () {
        //         wx.hideNavigationBarLoading()
        //         wx.stopPullDownRefresh()
        //     })
        // } else {
        //     this.getKlineData(this.data.goodsId, getCanvasId(this.data.quotePeriod), function () {
        //         wx.hideNavigationBarLoading()
        //         wx.stopPullDownRefresh()
        //     })
        // }

        this.getNews(this.data.goodsId + '', this.data.infoCls, function() {
            wx.hideNavigationBarLoading()
        })
    },

    getMinuteData: function (goodsId, canvasId, callback) {
        wx.showNavigationBarLoading()
        var that = this
        Api.stock.getMinutes({
            id: goodsId,
            date: 0,
            time: 0,
            mmp: false,
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            // console.log('stock minute result ', results)
            that.kLineView.drawMiniteCanvas(results, canvasId)

        }, function (res) {
            console.log("------fail----", res)
            wx.hideNavigationBarLoading()
        })
    },

    getKlineData: function (goodsId, canvasId, callback) {
        wx.showNavigationBarLoading()
        var that = this
        Api.stock.getKLines({
            id: goodsId,
            begin: 0,
            size: 200,
            period: that.data.quotePeriod,
            time: 0,
            ma: 7
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            console.log('stock kline result ', results)
            that.kLineView.drawKLineCanvas(results, canvasId)

        }, function (res) {
            console.log("------fail----", res)
            wx.hideNavigationBarLoading()
        })
    },

    getNews: function (goodsId, cls, callback) {
        wx.showNavigationBarLoading()
        var that = this

        Api.stock.getNews({
            id: goodsId,
            cls: cls
        }).then(function (results) {
            console.log('stock news result ', results)

            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            
            that.setData({
                news: results.news
            })
            getInfoHeight(that)
            // console.log('news: ', that.data.news)
        }, function (res) {
            console.log("------fail----", res)
            wx.hideNavigationBarLoading()
        })
    },

    onPeriodSelectorClick: function (e) {
        let index = e.currentTarget.dataset.index
        let period = 1
        var canvasIndex = 0

        switch (index) {
            case "0":
                period = 1;
                canvasIndex = 0
                if (this.kLineView.isCanvasDrawn(1)) break;
                this.getMinuteData(this.data.goodsId, 1, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
            case "1":
                period = 100;
                canvasIndex = 1
                if (this.kLineView.isCanvasDrawn(2)) break;
                this.getKlineData(this.data.goodsId, 2, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
            case "2":
                period = 101;
                canvasIndex = 2
                if (this.kLineView.isCanvasDrawn(3)) break;
                this.getKlineData(this.data.goodsId, 3, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
            case "3":
                period = 102;
                canvasIndex = 3
                if (this.kLineView.isCanvasDrawn(4)) break;
                this.getKlineData(this.data.goodsId, 4, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
            case "4":
                period = 60;
                canvasIndex = 4
                if (this.kLineView.isCanvasDrawn(5)) break;
                this.getKlineData(this.data.goodsId, 5, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
        }

        this.setData({
            currentTimeIndex: e.currentTarget.dataset.index,
            quotePeriod: period,
            quoteData: {
                canvasIndex: canvasIndex
            }
        })
        // console.log('onPeriodSelectorClick',this.data)
    },

    onInfoSelectorClick: function (e) {
        let index = e.currentTarget.dataset.index
        let cls = '0'

        switch (index) {
            case "0":
                cls = '0';
                this.getNews(this.data.goodsId + '', cls, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
            case "1":
                break;
            case "2":
                cls = '1';
                this.getNews(this.data.goodsId + '', cls, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
            case "3":
                cls = '2';
                this.getNews(this.data.goodsId + '', cls, function () {
                    wx.hideNavigationBarLoading()
                })
                break;
        }

        this.setData({
            currentInfoIndex: index,
            infoCls: cls
        })
    },

    onInfoSwiperChange: function (e) {
        var index = e.detail.current
        this.setData({ currentInfoIndex: index })
    }

})

function getCanvasId(period) {
    switch (period) {
        case 1:
            return 1;
            break;
        case 100:
            return 2;
            break;
        case 101:
            return 3;
            break;
        case 102:
            return 4;
            break;
        case 60:
            return 5;
            break;
    }

    return 1;
}

function getInfoHeight(that) {
    var height = 80 * that.data.news.length + 98
    that.setData({
        infoSwiperHeight: height
    })
}
