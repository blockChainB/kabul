var util = require('../../utils/util.js')

Page({

  data: {},

  onLoad: function (options) {
    console.log('bk 2003893', util.isBK(2003893))
    console.log('jijin 600600', util.isJiJin(600600))
  }

})
