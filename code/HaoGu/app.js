var appUtil = require("./utils/appUtil.js")

App({
  globalData: {
    screenWidth: 0,
    openId: "",
    optionals: "",
    netWorkType:"",
    WIFI_REFRESH_INTERVAL:5*1000,//wifi网络时刷新间隔 秒
    MOBILE_REFRESH_INTERVAL:30*1000,//手机网络时刷新间隔 秒
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
    //appid
    appUtil.getOpenId(this)
    //网络类型
    appUtil.getNetWorkType()
  },

  // globalData: {
  //   screenWidth: 0,
  //   openId: "",
  //   optionals: []
  // },

  getScreenWidth: function () {
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.screenWidth = res.windowWidth;
      }
    })
  }
})