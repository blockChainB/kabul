var Api = require("../../api/api.js")
var KLineView = require('../common/KLineView/KLineView.js')

Page({
    
    data: {
        // 个股头部数据
        quotation: {
            price: '23.45',
            zd: '10.53',
            zdf: '5.53%',
            open: '21.66',
            high: '21.55',
            low: '50.27',
            hs: '1.50%',
            sy: '1.50',
            sj: '3.59',
            cjl: '21.55',
            jl: '-2796.3万',
            zz: '560亿',
            cje: '50.27',
            lb: '1.59',
            lz: '144.2亿'
        },
        goodsId: 600000,
        quotationColor: '#eb333b'
    },

    onReady: function () {
        KLineView.init(this)
    },

    onPullDownRefresh: function(event) {
        this.data.goodsId++
        this.getMinuteData(this.data.goodsId, function() {
            wx.stopPullDownRefresh()
        })
        this.getKlineData(this.data.goodsId, function() {
            wx.stopPullDownRefresh()
        })

        Api.stock.getNews({
            id: '600600',
            cls: '0'
        }).then(function (results) {
            // console.log(' result ', results)
            // KLineView.drawMiniteCanvas(results)
            // if (callback != null && typeof (callback) == 'function') {
            //     callback()
            // }
        }, function (res) {
            console.log("------fail----", res)
        })
    },

    getMinuteData: function (goodsId, callback) {
        Api.stock.getMinutes({
            id: goodsId,
            date: 0,
            time: 0,
            mmp: false,
        }).then(function (results) {
            console.log('stock minute result ', results)
            KLineView.drawMiniteCanvas(results)
            // if (callback != null && typeof (callback) == 'function') {
            //     callback()
            // }
        }, function (res) {
            console.log("------fail----", res)
        })
    },

	getKlineData: function (goodsId, callback) {
        Api.stock.getKLines({
            id: goodsId,
            begin: 0,
            size: 200,
            period: 100,
            time: 0,
            ma: 7
        }).then(function (results) {
            console.log('stock kline result ', results)
            KLineView.drawKLineCanvas(results)
            // if (callback != null && typeof (callback) == 'function') {
            //     callback()
            // }
        }, function (res) {
            console.log("------fail----", res)
        })
    },

    // 滑动切换分时线/k线切换
    onKLineChangedEvent: function (e) {
        KLineView.onChangedEvent(e, this)
    },

    // 点击切换分时线/k线切换
    onKLineTapEvent: function (e) {
        KLineView.onTapEvent(this)
    }

})
