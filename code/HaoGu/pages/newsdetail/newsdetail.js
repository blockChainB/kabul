var Api = require('../../api/api.js')
var Util = require('../../utils/util.js')
var newsUtil = require('../../utils/newsUtil.js')

Page({
  data: {
    id: '',
    title: "",
    time: "",
    content: "",
    url: '',
    goodsName: '',
    newsType: '',
    type: ''
  },
  onLoad: function (options) {
    console.log('newsdetail onLoad', options)
    // 更新标题
    var goodsName = '未知股票'
    var newsType = '新闻'
    var type = ''

    if (options.hasOwnProperty('goodsName')) {
      goodsName = options.goodsName
    }
    if (options.hasOwnProperty('type')) {
      type = options.type
      if (type == '0') {
        newsType = '新闻'
      } else if (type == '1') {
        newsType = '公告'
      } else if (type == '2') {
        newsType = '研报'
      }
    }

    wx.setNavigationBarTitle({
      title: `${goodsName} ${newsType}`
    })

    newsUtil.updateReadNews(options.id)

    this.setData({
      time: options.from + " " + options.time,
      url: options.url,
      goodsName: goodsName,
      newsType: newsType,
      id: options.id,
      type: type
    })
    this.getData(options.id, options.type, Util.urlNavigateDecode(options.url))
  },

  onShareAppMessage: function () {
    var that = this
    return {
      title: `${that.data.goodsName} ${that.data.newsType}`,
      desc: `${getApp().globalData.shareDesc}`,
      path: `/pages/newsdetail/newsdetail?time=${that.data.time}&id=${that.data.id}&url=${that.data.url}&type=${that.data.type}&goodsName=${that.data.goodsName}`
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