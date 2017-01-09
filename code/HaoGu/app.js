var appUtil = require("./utils/appUtil.js")
var Api = require('./api/api.js');
var util = require('./utils/util.js')
var StaticStrings = require('./utils/StaticStrings.js')

require('./utils/ArrayExtension.js')
require('./utils/DateExtension.js')

// 兼容Anroid不支持Object.assign的问题
if (!Object.assign) {
  Object.assign = require('./utils/Object-assign.js')
}

var intervalId = 0;

App({
  globalData: {
    screenWidth: 0,
    uid: "",
    optionals: [],
    readNews: [],
    netWorkType: "",
    WIFI_REFRESH_INTERVAL: 5 * 1000,//wifi网络时刷新间隔5秒
    MOBILE_REFRESH_INTERVAL: 30 * 1000,//手机网络时刷新间隔30秒
    shareDesc: '好股365，只选好股票，给有用的提示，做有效的决策。',
    currSystemDate: '',//当前服务器日期,格式：2016-01-01
    currSystemTime: '',//当前服务器时间,格式：133050
  },

  onLaunch: function () {
    this.getScreenWidth()
    //appid
    appUtil.getUid(this)
    //网络类型
    appUtil.getNetWorkType()
    //获取系统时间
    this.getSystemTime()

  },

  onShow: function () {
    //当小程序启动，或从后台进入前台显示，会触发 onShow
    //启动计时
    this.startTimer()
  },

  onHide: function () {
    //当小程序从前台进入后台，会触发 onHide
    //停止计时
    this.stopTimer()
  },

  onError: function (msg) {
    //停止计时
    this.stopTimer()
  },

  //启动计时
  startTimer: function () {
    var that = this;
    intervalId = setInterval(function () {
      //获取系统时间
      that.getSystemTime()
    }, 10 * 60 * 1000);
  },

  //停止计时
  stopTimer: function () {
    clearInterval(intervalId)
  },

  getScreenWidth: function () {
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.screenWidth = res.windowWidth;
      }
    })
  },

  //获取系统时间
  getSystemTime: function () {
    var that = this
    Api.kanpan.getSystemTime({}).then(function (results) {
      that.globalData.currSystemDate = util.formatDateYYYYmmdd(results.cur_sys_date);
      that.globalData.currSystemTime = results.cur_sys_time
    }, function (res) {
    })
  },

})