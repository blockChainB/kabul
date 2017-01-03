var Api = require('../../api/api.js');

Page({
    data: {
        currIndex: 0,//当前选择的tab
        isDownSort:true,//是否降序
        bkArr: [1, 2, 3],
        bkzdf:1.22,
        tabArr: ["全部", "强者", "缺口", "题材", "黄金"],//tab
        goodsArr: [10.00,8.12,3.22,0.00,-0.66,-2.30,-2.30,-2.30,-2.30,-2.30,-2.30],
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

    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    getData: function () {
        var that = this
        Api.kanpan.getHotBK({

        }).then(function (results) {
            console.log(results);
            that.data.array = results;
            that.setData(that.data)
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
    onZDFSort:function(e){
      var tempSort=this.data.isDownSort?false:true;
       this.setData({
           isDownSort:tempSort
       })
    },

    //启动个股页面
    startStockPage: function (e) {
        wx.navigateTo({
            url: '../stock/stock?id=600600'
        })
    },
})