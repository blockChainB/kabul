// pages/fundinflow/fundinflow.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
    const ctx = wx.createCanvasContext('fundinflow_pie');
    ctx.setStrokeStyle('red');
    ctx.setLineWidth(1);
    ctx.strokeRect(10, 10, 150, 75);
    ctx.draw();

  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})