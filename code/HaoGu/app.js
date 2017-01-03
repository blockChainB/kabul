var appUtil = require("./utils/appUtil.js")

App({

  globalData: {
    screenWidth: 0,
    openId: "",
    optionals: ""
  },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    
    try {
      draw.getScreenWidthPx()
    } catch (e) {

    }

    this.getScreenWidth()

    appUtil.getOpenId(this)
  },

  globalData: {
    screenWidth: 0,
    openId: "",
    optionals: []
  },

  getScreenWidth: function () {
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.screenWidth = res.windowWidth;
      }
    })
  }
})