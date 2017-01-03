Page({
    data: {
        currIndex: 0,
        bkArr: [1, 2, 3],
        tabArr: ["全部", "强者", "缺口", "题材", "黄金"],
        goodsArr: [],
        goodsArr1: ["goods全部1", "goods全部2", "goods全部3", "goods全部4", "goods全部5", "goods全部6", "goods全部7", "goods全部8", "goods全部7", "goods全部8"],
        goodsArr2: ["goods强者1", "goods强者2", "goods强者3", "goods强者4", "goods强者5", "goods强者6", "goods强者7", "goods强者8", "goods全部7", "goods全部8"],
        goodsArr3: ["goods缺口1", "goods缺口2", "goods缺口3", "goods缺口4", "goods缺口5", "goods缺口6", "goods缺口7", "goods缺口8", "goods全部7", "goods全部8"],
        goodsArr4: ["goods题材1", "goods题材2", "goods题材3", "goods题材4", "goods题材5", "goods题材6", "goods题材7", "goods题材8", "goods全部7", "goods全部8"],
        goodsArr5: ["goods黄金1", "goods黄金2", "goods黄金3", "goods黄金4", "goods黄金5", "goods黄金6", "goods黄金7", "goods黄金8", "goods全部7", "goods全部8"],
    },


    onReady: function () {
        this.setData({
            goodsArr: this.data.goodsArr1
        })
    },


    //BK的点击事件
    onBKItemClickEvent: function (e) {
        console.log(e)
    },

    //tab的点击事件
    onTabItemClickEvent: function (e) {
        this.setData({
            currIndex: e.currentTarget.dataset.index
        })

        if (e.currentTarget.dataset.index == 0) {
            this.setData({
                goodsArr: this.data.goodsArr1
            })
        } else if (e.currentTarget.dataset.index == 1) {
            this.setData({
                goodsArr: this.data.goodsArr2
            })
        } else if (e.currentTarget.dataset.index == 2) {
            this.setData({
                goodsArr: this.data.goodsArr3
            })
        } else if (e.currentTarget.dataset.index == 3) {
            this.setData({
                goodsArr: this.data.goodsArr4
            })
        } else if (e.currentTarget.dataset.index == 4) {
            this.setData({
                goodsArr: this.data.goodsArr5
            })
        }
    },

    //listview item的点击事件
    onItemClickEvent:function(e){
        console.log('********xie:',e)
    },
})