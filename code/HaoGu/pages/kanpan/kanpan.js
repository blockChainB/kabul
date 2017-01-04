var Api = require('../../api/api.js');

Page({
    data: {
        intervalId: 0,
        currIndex: 0,//当前选择的tab
        isDownSort: true,//是否降序
        bkArr: [],
        bkzdf: 9.22,
        tabArr: ["全部", "强者", "缺口", "题材", "黄金"],//tab
        goodsArr: [10.00, 8.12, 3.22, 0.00, -0.66, -2.30, -2.30, -2.30, -2.30, -2.30, -2.30],
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
        this.startTimer();
    },

    onHide: function () {
        // 页面隐藏
        this.stopTimer();
    },

    onUnload: function () {
        // 页面关闭
    },

    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },


    //启动计时
    startTimer: function () {
        console.log('************startTimer');
        var interval = getApp().globalData.netWorkType == 'wifi' ? getApp().globalData.WIFI_REFRESH_INTERVAL : getApp().globalData.MOBILE_REFRESH_INTERVAL;
        var tempIntervalId = setInterval(function () {
            console.log('************xie')
        }, interval);

        this.setData({
            intervalId: tempIntervalId
        });
    },

    //停止计时
    stopTimer: function () {
        console.log('************stopTimer');
        clearInterval(this.data.intervalId)
    },

    getData: function () {
        var that = this

        //板块
        Api.kanpan.getHotBK({
            key:getApp().globalData.openId
        }).then(function (results) {
            console.log('xie page:',results);
            that.setData({
                bkArr:results
            })
        }, function (res) {

        })
    },

    //BK的点击事件
    onBKItemClickEvent: function (e) {
        this.startStockPage();
        this.getData();
        console.log(e)
    },

    //tab的点击事件
    onTabItemClickEvent: function (e) {
        this.setData({
            currIndex: e.currentTarget.dataset.index
        })
    },

    //listview item的点击事件
    onItemClickEvent: function (e) {
        this.startStockPage();
    },

    //涨跌幅排序
    onZDFSort: function (e) {
        var tempSort = this.data.isDownSort ? false : true;
        this.setData({
            isDownSort: tempSort
        })
    },

    //启动个股页面
    startStockPage: function (e) {
        wx.navigateTo({
            url: '../stock/stock?id=600600'
        })
    },

    onStockSearchEvent: function (e) {
        wx.navigateTo({
            url: '../search/search'
        })
    }
})