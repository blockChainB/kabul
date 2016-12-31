Page({


    onSearchEvent: function (e) {
        console.log("onseachevent")

        wx.navigateTo({
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
    }
})