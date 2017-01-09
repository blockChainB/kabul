var Api = require("../../api/api.js")
var KLineView = require('../common/KLineView/KLineView.js')
var NewsItem = require('NewsItem.js')
var fundview = require('../common/FundView/FundView.js');
var Quotation = require('../../models/Quotation.js')

var optionalUtil = require('../../utils/optionalUtil.js')
var Util = require('../../utils/util.js')
var newsUtil = require('../../utils/newsUtil.js')

Page({

    data: {
        // 个股头部数据
        quotation: {},
        goodsId: 1832950,
        goodsName: '益盟股份',
        goodsCode: '832950',
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
        fundViewData: {},
        isInforLoad: {    // 个股新闻等是否已加载
            news: false,
            fund: false,
            notice: false,
            research: false
        },
        isAddToZxg: false    // 是否已添加到自选股
    },

    onLoad: function (option) {
        fundview.reset();
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
        this.kLineView = new KLineView()
        this.timerId = -1             // 循环请求id

        console.log('stock page onLoad ', this.data.goodsId)
        fundview.init(this);
        fundview.show(this);
        fundview.setJLValue(this);

        this.getData()
    },

    onShow: function () {
        this.startAutoRequest()
        this.isCurrentGoodsInZxgList()
        // 刷新资讯列表颜色
        updateItemColor(this)
    },

    onHide: function () {
        fundview.reset();
        this.stopAutoRequest()
    },

    onUnload: function () {
        fundview.reset();
        // 页面退出时，不会调用onHide
        this.stopAutoRequest()
    },

    onShareAppMessage: function () {
        var that = this
        var id = that.data.goodsId
        var name = that.data.goodsName
        var code = that.data.goodsCode

        return {
            title: `${name} (${code})`,
            desc: `${getApp().globalData.shareDesc}`,
            // path: `/pages/stock/stock?id=${id}&name=${name}&code=${code}`
            path: `/pages/kanpan/kanpan?id=${id}&name=${name}&code=${code}&page=stock`
        }
    },

    onPullDownRefresh: function (event) {
        this.getData()
    },

    // 开启循环请求
    startAutoRequest: function () {
        var that = this;
        var data = getApp().globalData
        var interval = data.netWorkType == 'wifi' ? data.WIFI_REFRESH_INTERVAL : data.MOBILE_REFRESH_INTERVAL;
        this.timerId = setInterval(function () {
            that.getData();
        }, interval);
    },

    // 停止循环请求
    stopAutoRequest: function () {
        clearInterval(this.timerId)
    },

    // 循环请求
    getData: function () {
        // 请求行情
        this.getQuotationValue(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        })
        // 请求走势，请求哪个走势，在getQuotationTrend中判断
        this.getQuotationTrend(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        })
        // 请求个股资讯，具体是否请求，在getNews中判断
        this.getNews(function () {
            wx.hideNavigationBarLoading()
        })
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
                fundview.setJLValue(that);
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
            that.kLineView.drawKLineCanvas(results, getCanvasId(that.data.quotePeriod), that.data.quotePeriod)
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

    getNews: function (callback) {
        // 如果数据已请求完成，不再请求
        if (this.getIsInfoLoad()) return

        wx.showNavigationBarLoading()
        var that = this

        Api.stock.getNews({
            id: that.data.goodsId + '',
            cls: that.data.infoCls
        }).then(function (results) {
            // console.log('stock news result ', results)

            if (callback != null && typeof (callback) == 'function') {
                callback()
            }

            if (results.hasOwnProperty('news')) {
                that.setData({
                    news: results.news
                })
                if (results.news != null && results.news.length > 0) {
                    that.setIsInfoLoad('0')
                }
            } else if (results.hasOwnProperty('notices')) {
                that.setData({
                    notices: results.notices
                })
                if (results.notices != null && results.notices.length > 0) {
                    that.setIsInfoLoad('2')
                }
            } else if (results.hasOwnProperty('research')) {
                that.setData({
                    research: results.research
                })
                if (results.research != null && results.research.length > 0) {
                    that.setIsInfoLoad('3')
                }
            }

            // 刷新资讯列表颜色
            updateItemColor(that)
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
            case '0':
                cls = '0';
                break;
            case '2':
                cls = '1';
                break;
            case '3':
                cls = '2';
                break;
        }

        this.setData({
            currentInfoIndex: index,
            infoCls: cls
        })

        if (index != '1') {
            this.getNews(function () {
                wx.hideNavigationBarLoading()
            })
        }
    },

    onInfoEmptyClick: function (e) {
        // 请求股票资讯
        this.getNews(function () {
            wx.hideNavigationBarLoading()
        })
    },

    onNewsDetailEvent: function (e) {
        var newsItem = e.currentTarget.dataset.newsItem
        var newsType = e.currentTarget.dataset.newsType
        
        var data = e.currentTarget.dataset
        var url = Util.urlNavigateEncode(newsItem.url)
        var stockName = this.data.goodsName
        wx.navigateTo({
            url: `../newsdetail/newsdetail?time=${newsItem.time}&from=${newsItem.from}&id=${newsItem.newsId}&url=${url}&type=${newsType}&goodsName=${stockName}`
        })
    },

    // 添加删除自选股
    onZxgTap: function (e) {
        console.log("page stock onZxgTap", e)
        var that = this
        wx.showNavigationBarLoading()
        
        Api.stock.commitOptionals({
            goodsId: that.data.goodsId
        }).then(function (res) {
            console.log("添加自选股", res)
            wx.hideNavigationBarLoading()

            if (res == 0 || res == '0') {
                that.isCurrentGoodsInZxgList()
                // 弹出toast提示成功
                var title = ''
                if (that.data.isAddToZxg) {
                    title = '添加自选成功'
                } else {
                    title = '删除自选成功'
                }
                wx.showToast({
                    title: title,
                    icon: 'none',
                    duration: 500
                })
            }
        }, function (res) {
            console.log("添加自选股", res)
            wx.hideNavigationBarLoading()
        })
    },

    getIsInfoLoad: function () {
        var index = this.data.currentInfoIndex
        var data = this.data.isInforLoad

        switch (index) {
            case '0':
                return data.news
                break;
            case '1':
                return data.fund
                break;
            case '2':
                return data.notice
                break;
            case '3':
                return data.research
                break;
        }

        return false
    },

    setIsInfoLoad: function (index) {
        var data = this.data.isInforLoad

        switch (index) {
            case '0':
                data.news = true
                break;
            case '1':
                data.fund = true
                break;
            case '2':
                data.notice = true
                break;
            case '3':
                data.research = true
                break;
        }

        this.setData({
            isInforLoad: data
        })
    },

    // 查询股票是否在自选股中中
    isCurrentGoodsInZxgList: function () {
        var isIn = optionalUtil.isOptional(this.data.goodsId)
        this.setData({
            isAddToZxg: isIn
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

function initData(that) {
    // 初始化数据显示
    // Quotation(price, zd, zdf, open, high, low, hsl, syl, sjl, cjl, jl, zz, cje, lb, ltsz, date, time, color, goodsId)
    var quota = new Quotation('--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', 0, 0, '#e64340', 0)
    that.setData({
        quotation: quota
    })
}

// 刷新列表颜色
function updateItemColor(that) {
    var inforIndex = that.data.currentInfoIndex
    var array = []
    if (inforIndex == '0') {
        // 新闻
        array = updateItemValues(that.data.news)
        that.setData({ news: array })
    } else if (inforIndex == '2') {
        // 公告
        array = updateItemValues(that.data.notices)
        that.setData({ notices: array })
    } else if (inforIndex == '3') {
        // 研报
        array = updateItemValues(that.data.research)
        that.setData({ research: array })
    }
}

function updateItemValues(array) {
    for (var i = 0; i < array.length; i++) {
        var item = array[i]
        item.isRead = newsUtil.isNewsRead(item.newsId)
    }
    return array
}
