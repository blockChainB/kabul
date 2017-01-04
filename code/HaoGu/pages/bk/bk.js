var Quotation = require('../../models/Quotation.js')
var Api = require("../../api/api.js")
var KLineView = require('../common/KLineView/KLineView.js')

Page({

  data: {
    quotation: {},
    relatives: [],
    goodsId: 2002004,
    goodsName: '煤炭',
    goodsCode: 'BK2004',
    cls: '0',
    currentPeriodIndex: 0,
    quotePeriod: 1,
    quoteData: {
      canvasIndex: 0
    },
    isSortOrderDown: true
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
        this.kLineView = new KLineView()
    },

  onShow: function () {
    this.getQuotationValue(function () {
      wx.hideNavigationBarLoading()
    })
    this.getQuotationTrend(function () {
      wx.hideNavigationBarLoading()
    })
    this.getRelatives(function () {
      wx.hideNavigationBarLoading()
    })
  },

  onReady: function () {
  },

  onHide: function () {
  },

  onUnload: function () {
  },

  onPullDownRefresh: function (event) {
    this.getQuotationValue(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
    this.getQuotationTrend(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
    this.getRelatives(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
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
      currentPeriodIndex: index,
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

  onSortClick: function(event) {
    var order = !this.data.isSortOrderDown
    this.setData({
      isSortOrderDown: order
    })

    this.getRelatives(function () {
      wx.hideNavigationBarLoading()
    })
  },

  openStock: function(e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: `../stock/stock?id=${data.goodsId}&name=${data.goodsName}&code=${data.goodsCode}`
    })
  },

  // 获取行情数据
  getQuotationValue: function (callback) {
    wx.showNavigationBarLoading()
    var that = this

    Api.stock.getBkQuotation({
      id: that.data.goodsId
    }).then(function (results) {
      if (callback != null && typeof (callback) == 'function') {
        callback()
      }
      // console.log('bk quotation value result ', results)
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

  // 获取关联个股/版块
  getRelatives: function (callback) {
    wx.showNavigationBarLoading()
    var that = this

    Api.stock.getRelatives({
      id: that.data.goodsId,
      order: that.data.isSortOrderDown
    }).then(function (results) {
      if (callback != null && typeof (callback) == 'function') {
        callback()
      }
      console.log('stock relative value result ', results)
      if (results != null) {
        that.setData({ relatives: results.relatives })
      }
    }, function (res) {
      console.log("------fail----", res)
      if (callback != null && typeof (callback) == 'function') {
        callback()
      }
    })
  },

})

function initData(that) {
  // 初始化数据显示
  // Quotation(price, zd, zdf, open, high, low, hsl, syl, sjl, cjl, jl, zz, cje, lb, ltsz, date, time, color, goodsId)
  var quota = new Quotation('--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', 0, 0, '#e64340', 0)
  that.setData({
    quotation: quota
  })
}

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
