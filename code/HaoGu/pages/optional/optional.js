Page({


    onSearchEvent: function (e) {
        wx.navigateTo({
            // url: '../newsdetail/newsdetail',
            url: '../search/search',
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },

    onFundflowEvent: function (e) {
        console.log("onFundflowEvent");
        wx.navigateTo({
            url:'../fundinflow/fundinflow',
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    }
})