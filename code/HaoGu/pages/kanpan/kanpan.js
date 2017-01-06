const CATEGORY_All = '';//全部模型(""空字符串或null)
const CATEGORY_QZ = '001001';//强者恒强
const CATEGORY_QK = '001014';//缺口模块
const CATEGORY_TC = '001018';//题材领涨
const CATEGORY_HJ = '001022';//黄金K线
const SORT_UP = 1;//升序
const SORT_DOWN = -1;//降序


var Api = require('../../api/api.js');
var util = require('../../utils/util.js')
var intervalId = 0;
var allGoodsArr = [];//全部
var qzGoodsArr = [];//强者
var qkGoodsArr = [];//缺口
var tcGoodsArr = [];//题材
var hjGoodsArr = [];//黄金
var currCategory = CATEGORY_All;

Page({
    data: {
        currIndex: 0,//当前选择的tab
        sortState: -1,//-1降序,1升序
        bkArr: [],
        tabArr: ["全部", "强者", "缺口", "题材", "黄金"],//tab
        goodsArr: [],//列表数据
    },

    onLoad: function (options) {
        // 上次hide是退出hide时，才自动跳转到其它页面
        var page = ''
        if (options.hasOwnProperty('page')) {
            page = options.page

            if (page != '') {
                if (page == 'stock' || page == 'bk') {
                    if (options.hasOwnProperty('id') && options.hasOwnProperty('name') && options.hasOwnProperty('code')) {
                        util.gotoQuote(parseInt(options.id), options.name, options.code)
                    }
                } else if (page == 'search') {
                    wx.navigateTo({
                      url: '/pages/search/search'
                    })
                }
            }
        }
    },

    onReady: function () {
        this.getData()
    },

    onShow: function () {
        this.startTimer();
    },

    onHide: function () {
        //停止计时
        this.stopTimer();
    },

    onUnload: function () {
        console.log('kanpan onUnload')
        // 页面关闭
        //停止计时
        this.stopTimer();
    },

    //分享
    onShareAppMessage: function () {
        return {
            title: `看盘`,
            desc: `${getApp().globalData.shareDesc}`,
            path: `/pages/kanpan/kanpan`
        }
    },

    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },


    //启动计时
    startTimer: function () {
        var that = this;
        var interval = getApp().globalData.netWorkType == 'wifi' ? getApp().globalData.WIFI_REFRESH_INTERVAL : getApp().globalData.MOBILE_REFRESH_INTERVAL;
        intervalId = setInterval(function () {
            that.getData();
        }, interval);
    },

    //停止计时
    stopTimer: function () {
        clearInterval(intervalId)
    },

    getData: function () {
        var that = this

        //板块
        Api.kanpan.getHotBK({
            uid: getApp().globalData.uid
        }).then(function (results) {
            that.setData({
                bkArr: results
            })
        }, function (res) {
        })

        //看盘
        this.getKanpan();
    },

    //请求看盘数据
    getKanpan: function () {
        var that = this
        Api.kanpan.getKanPan({
            secucategory: currCategory,
            uid: getApp().globalData.uid
        }).then(function (results) {
            //console.log('*******************kanpan category:',results.category)
            if (results) {
                //设数据 
                if (results.category == CATEGORY_All) {
                    //全部
                    allGoodsArr = results.data;
                } else if (results.category == CATEGORY_QZ) {
                    //强者
                    qzGoodsArr = results.data;
                } else if (results.category == CATEGORY_QK) {
                    //缺口
                    qkGoodsArr = results.data;
                } else if (results.category == CATEGORY_TC) {
                    //题材
                    tcGoodsArr = results.data;
                } else if (results.category == CATEGORY_HJ) {
                    //黄金
                    hjGoodsArr = results.data;
                }

                if (results.category == currCategory) {
                    //排序和绑定数据 
                    that.sortAndSetData(results.data);
                }
            }
        }, function (res) {
        })
    },

    //BK的点击事件
    onBKItemClickEvent: function (e) {
        var data = e.currentTarget.dataset
        util.gotoQuote(data.item.id, data.item.bkName, data.item.code)
    },

    //tab的点击事件
    onTabItemClickEvent: function (e) {
        var index = e.currentTarget.dataset.index;

        this.setData({
            currIndex: index
        })

        if (index == 0) {
            //全部
            currCategory = CATEGORY_All;
        } else if (index == 1) {
            //强者
            currCategory = CATEGORY_QZ;
        } else if (index == 2) {
            //缺口
            currCategory = CATEGORY_QK;
        } else if (index == 3) {
            //题材
            currCategory = CATEGORY_TC;
        } else if (index == 4) {
            //黄金
            currCategory = CATEGORY_HJ;
        }

        //更新数据并排序
        this.updateData()
    },

    //更新数据
    updateData: function () {
        var currData = [];
        if (currCategory == CATEGORY_All) {
            //全部
            currData = allGoodsArr
        } else if (currCategory == CATEGORY_QZ) {
            //强者
            currData = qzGoodsArr
        } else if (currCategory == CATEGORY_QK) {
            //缺口
            currData = qkGoodsArr
        } else if (currCategory == CATEGORY_TC) {
            //题材
            currData = tcGoodsArr
        } else if (currCategory == CATEGORY_HJ) {
            //黄金
            currData = hjGoodsArr
        }

        if (!currData || currData.length <= 0) {
            this.setData({
                goodsArr: currData
            })

            this.getKanpan()
            return;
        }

        //排序和绑定数据 
        this.sortAndSetData(currData);
    },

    //排序和绑定数据 
    sortAndSetData: function (data) {
        if (!data || data.length <= 0) {
            return;
        }

        var that = this;

        data.sort(function (a, b) {
            var zdf1 = a.zdf
            var zdf2 = b.zdf
            if (!zdf1) {
                zdf1 = that.data.sortState*20000
            }
            if (!zdf2) {
                zdf2 = that.data.sortState*20000
            }
            return that.data.sortState * (zdf1 - zdf2);
        });

        this.setData({
            goodsArr: data
        })
    },

    //listview item的点击事件
    onItemClickEvent: function (e) {
        var data = e.currentTarget.dataset
        util.gotoQuote(data.item.id, data.item.name, data.item.code)
    },

    //涨跌幅排序
    onZDFSort: function (e) {
        var tempSortState = -this.data.sortState;
        this.setData({
            sortState: tempSortState
        })

        //更新数据并排序
        this.updateData()
    },

    onStockSearchEvent: function (e) {
        wx.navigateTo({
            url: '../search/search'
        })
    }
})