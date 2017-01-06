
function updateReadNews(newsId) {
    getApp().globalData.readNews.unshift(newsId)

    var newsString = getApp().globalData.readNews.join(',')
    wx.setStorage({
        key: 'NewsReadList',
        data: newsString,
    })
}

function loadReadNews() {
    wx.getStorage({
        key: 'NewsReadList',
        success: function (res) {
            var newsString = res.data
            getApp().globalData.readNews = newsString.split(',')
        },
        fail: function () {
            // fail
        },
        complete: function () {
            // complete
        }
    })
}

function isNewsRead(newsId) {
    var index = getApp().globalData.readNews.indexOf(newsId)
    if (index >= 0) {
        return true
    } else {
        return false
    }
}

module.exports = {
    updateReadNews: updateReadNews,
    loadReadNews: loadReadNews,
    isNewsRead: isNewsRead
}