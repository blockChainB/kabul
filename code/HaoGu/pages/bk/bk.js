var Quotation = require('../../models/Quotation.js')

Page({

  data:{
    quotation: {},
    relatives: [
      {name: '青岛啤酒', code: '600600', zxj: '29.38', zdf: '1.25%'},
      {name: '青岛啤酒', code: '600600', zxj: '29.38', zdf: '1.25%'},
      {name: '青岛啤酒', code: '600600', zxj: '29.38', zdf: '1.25%'},
      {name: '青岛啤酒', code: '600600', zxj: '29.38', zdf: '1.25%'},
      {name: '青岛啤酒', code: '600600', zxj: '29.38', zdf: '1.25%'},
      {name: '青岛啤酒', code: '600600', zxj: '29.38', zdf: '1.25%'}
    ]
  },

  onLoad:function(options){
    initData(this)
  },

  onShow:function(){
  },

  onReady:function(){
  },

  onHide:function(){
  },

  onUnload:function(){
  }

})

function initData(that) {
    // 初始化数据显示
    // Quotation(price, zd, zdf, open, high, low, hsl, syl, sjl, cjl, jl, zz, cje, lb, ltsz, date, time, color, goodsId)
    var quota = new Quotation('--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', 0, 0, '#e64340', 0)
    that.setData({
        quotation: quota
    })
}
