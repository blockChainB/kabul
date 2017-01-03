var Api = require("../../api/api.js")
var KLineView = require('../common/KLineView/KLineView.js')
var NewsItem = require('NewsItem.js')
var fundview = require('../common/FundView/FundView.js');
var Quotation = require('../../models/Quotation.js')

Page({

    data: {
        // 个股头部数据
        quotation: {},
        goodsId: 600600,
        quotationColor: '#eb333b',
        currentTimeIndex: 0,
        currentInfoIndex: 0,
        quotePeriod: 1,
        quoteData: {
            canvasIndex: 0
        },
        news: [],
        infoSwiperHeight: 0,
        infoCls: '0',
        fundViewData: {}
    },

    onLoad: function (option) {
        console.log('onLoad ', this.data.goodsId)
        this.setData({goodsId: parseInt(option.id)})
        console.log('onLoad ', this.data.goodsId)
        initData(this)
    },

    onShow: function () {
        this.kLineView = new KLineView()
        this.getQuotationTrend(function () {
            wx.hideNavigationBarLoading()
        })
        this.getQuotationValue(function () {
            wx.hideNavigationBarLoading()
        })
        this.getNews('600600', '0', function() {
            wx.hideNavigationBarLoading()
        })

        
       fundview.init(this);
        fundview.show(this);
        fundview.setJLValue(this, '1.52', '亿元');
    },

    onReady: function () {
         
    },

    onPullDownRefresh: function (event) {
        this.getQuotationTrend(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        })
        this.getQuotationValue(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        })

        // this.getNews(this.data.goodsId + '', this.data.infoCls, function() {
        //     wx.hideNavigationBarLoading()
        // })
    },

    // 获取行情数据
    getQuotationValue: function (callback) {
        wx.showNavigationBarLoading()
        var that = this

        Api.stock.getQuotation({
            id: that.data.goodsId
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            // console.log('stock quotation value result ', results)
            that.setData({quotation: results})
            // console.log('canvas id ' + getCanvasId(that.data.quotePeriod))
            // that.kLineView.drawMiniteCanvas(results, getCanvasId(that.data.quotePeriod))
        }, function (res) {
            console.log("------fail----", res)
            wx.hideNavigationBarLoading()
        })
    },

    getMinuteData: function (callback) {
        wx.showNavigationBarLoading()
        var that = this

        Api.stock.getMinutes({
            id: that.data.goodsId,
            date: 0,
            time: 0,
            mmp: false,
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            // console.log('stock minute result ', results)
            // console.log('canvas id ' + getCanvasId(that.data.quotePeriod))
            that.kLineView.drawMiniteCanvas(results, getCanvasId(that.data.quotePeriod))
        }, function (res) {
            console.log("------fail----", res)
            wx.hideNavigationBarLoading()
        })
    },

    getKlineData: function (callback) {
        wx.showNavigationBarLoading()
        var that = this

        Api.stock.getKLines({
            id: that.data.goodsId,
            begin: 0,
            size: 200,
            period: that.data.quotePeriod,
            time: 0,
            ma: 7
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            // console.log('stock kline result ', results)
            that.kLineView.drawKLineCanvas(results, getCanvasId(that.data.quotePeriod))
        }, function (res) {
            console.log("------fail----", res)
            wx.hideNavigationBarLoading()
        })
    },

    // 获取行情走势
    getQuotationTrend: function (callback) {
        if (this.data.quotePeriod == 1) {
            // 获取分时走势
            this.getMinuteData(callback)
        } else {
            // 获取K线走势
            this.getKlineData(callback)
        }
    },

    getNews: function (goodsId, cls, callback) {
        wx.showNavigationBarLoading()
        var that = this

        Api.stock.getNews({
            id: goodsId,
            cls: cls
        }).then(function (results) {
            // console.log('stock news result ', results)

            if (callback != null && typeof (callback) == 'function') {
                callback()
            }

            that.setData({
                news: results.news
            })
            getInfoHeight(that)
            console.log('news: ', that.data.news)
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
                break;
            case "1":
                period = 100;
                canvasIndex = 1
                break;
            case "2":
                period = 101;
                canvasIndex = 2
                break;
            case "3":
                period = 102;
                canvasIndex = 3
                break;
            case "4":
                period = 60;
                canvasIndex = 4
                break;
        }

        this.setData({
            currentTimeIndex: index,
            quotePeriod: period,
            quoteData: {
                canvasIndex: canvasIndex
            }
        })

        if (this.kLineView.isCanvasDrawn(canvasIndex + 1)) return;

        this.getQuotationTrend(function () {
            wx.hideNavigationBarLoading()
        })
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

function initData(that) {
    // 初始化数据显示
    // Quotation(price, zd, zdf, open, high, low, hsl, syl, sjl, cjl, jl, zz, cje, lb, ltsz, date, time, color, goodsId)
    var quota = new Quotation('--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', 0, 0, '#e64340', 0)
    that.setData({
        quotation: quota
    })
}
