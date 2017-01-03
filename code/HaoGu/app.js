var draw = require('utils/canvasUtil.js')
var appUtil = require("./utils/appUtil.js")

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    try {
      draw.getScreenWidthPx()
    } catch (e) {}

    appUtil.getOpenId(this)
  },

  globalData: {
    screenWidth: 0,
    openId: "",
    optionals: ""
  }
})