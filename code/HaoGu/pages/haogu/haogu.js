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

  getData: function () {
    var that = this
    Api.haogu.getHaoguList({

    }).then(function (results) {
      that.data.array = results;
      that.setData(that.data)
    }, function (res) {

    })
  },

  onStockDetailEvent: function (e) {
    var code = e.currentTarget.id.replace(">", "")
    wx.navigateTo({
      url: '../stock/stock?code=' + code,
      success: function (res) {
        // success
        console.log("res=====", res)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})