// pages/newsdetail/newsdetail.js

var Api = require('../../api/api.js')
var Util = require('../../utils/util.js')
var newsUtil = require('../../utils/newsUtil.js')

Page({
  data: {
    title: "",
    time: "",
    content: "",
    url: ''
  },
  onLoad: function (options) {
    newsUtil.updateReadNews(options.id)

    this.setData({
      time: options.time,
      url: options.url
    })
    this.time = options.time
    this.getData(options.id, options.type, Util.urlNavigateDecode(options.url))
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  onShareAppMessage: function () {
    var that = this
    return {
      title: '自稳定',
      desc: `${getApp().globalData.shareDesc}`,
      path: `/pages/newsdetail/newsdetail?time=${that.data.time}&url=${that.data.url}`
    }
  },

  getData: function (id, type, url) {
    var that = this
    Api.news.requestNewsDetail({
      id: id,
      type: type,
      url: url
    }).then(function (result) {
      console.log("新闻详情获取数据成功", result)
      that.data.title = result.title
      that.data.content = result.content
      that.setData(that.data)
    }, function (res) {
      console.log("新闻详情获取数据失败", res)
    })
  }
})