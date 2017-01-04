// pages/newsdetail/newsdetail.js

var Api = require('../../api/api.js')
var Util = require('../../utils/util.js')

Page({
  data: {
    title: "",
    time: "",
    content: "",
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.time = options.time
    this.getData(Util.urlNavigateDecode(options.url))
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

  getData: function (url) {
    var that = this
    Api.news.requestNewsDetail({
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