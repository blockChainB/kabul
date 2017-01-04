// pages/haogu/haogu.js
var Api = require('../../api/api.js');
Page({
  data: {
    array: []
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getData()
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

  onPullDownRefresh: function () {
    this.getData()
  },

  getData: function () {
    var that = this
    Api.haogu.getHaoguList({
      listType: []
    }).then(function (results) {
      wx.stopPullDownRefresh()
      that.data.array = results;
      that.setData(that.data)
    }, function (res) {
      wx.stopPullDownRefresh()
    })
  },

  onStockDetailEvent: function (e) {
    var code = e.currentTarget.id.replace(">", "")
    wx.navigateTo({
      url: '../stock/stock?code=' + code,
    })
  },

  onStockSearchEvent:function(e) {
    wx.navigateTo({
      url: '../search/search'
    })
  }
})