var Api = require("../../api/api.js")
var KLineView = require('../common/KLineView/KLineView.js')
var NewsItem = require('NewsItem.js')
var fundview = require('../common/FundView/FundView.js');
var Quotation = require('../../models/Quotation.js')

var Util = require('../../utils/util.js')

Page({

    data: {
        // 个股头部数据
        quotation: {},
        goodsId: 600600,
        goodsName: '青岛啤酒',
        goodsCode: '600600',
        quotationColor: '#eb333b',
        currentTimeIndex: 0,
        currentInfoIndex: 0,
        quotePeriod: 1,
        quoteData: {
            canvasIndex: 0
        },
        news: [],               // 新闻列表数据
        notices: [],            // 公告列表数据
        research: [],           // 研报列表数据
        infoSwiperHeight: 0,    // 新闻列表、资金图高度
        infoCls: '0',
        fundViewData: {}
    },

    onLoad: function (option) {
        if (option.hasOwnProperty('id') && option.hasOwnProperty('name') && option.hasOwnProperty('code')) {
            this.setData({
                goodsId: parseInt(option.id),
                goodsName: option.name,
                goodsCode: option.code
            })
        }

        wx.setNavigationBarTitle({
            title: `${this.data.goodsName} (${this.data.goodsCode})`
        })

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
        this.getNews('600600', '0', function () {
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
            if (results != null) {
                that.setData({ quotation: results })
            }
        }, function (res) {
            console.log("------fail----", res)
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
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

        getInfoHeight(this)
    },

    onInfoSwiperChange: function (e) {
        var index = e.detail.current
        this.setData({ currentInfoIndex: index })
    },

    onNewsDetailEvent: function (e) {
        var item = this.data.news[parseInt(e.currentTarget.id)]
        wx.navigateTo({
            url: '../newsdetail/newsdetail?time=' + item.time + '&url=' + Util.urlNavigateEncode(item.url)
        })
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

// 单位: rpx
function getInfoHeight(that) {
    var height = 0
    var index = parseInt(that.data.currentInfoIndex)

    switch (index) {
        case 0:    // 新闻
            height = 80 * that.data.news.length
            break;
        case 1:    // 资金
            height = 900
            break;
        case 2:    // 公告
            height = 80 * that.data.notices.length
            break;
        case 3:    // 研报
            height = 80 * that.data.research.length
            break;
    }

    // 添加自选Bottom的高度
    height += 98

    console.log('height', height, index)

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
