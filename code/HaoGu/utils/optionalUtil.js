// 判断是不是自选股
function isOptional(code) {
    if (getApp().globalData.optionals.indexOf(code) > -1) {
        return true;
    } else {
        return false;
    }
}

// 更新自选股
function updateOptional(code) {
    if (isOptional(code)) {
        getApp().globalData.optionals = getApp().globalData.optionals.replace(code + ",", "")
    } else {
        getApp().globalData.optionals = code + "," + getApp().globalData.optionals
    }

    wx.setStorage({
        key: getApp().globalData.openId,
        data: getApp().globalData.optionals,
    })
}

// 加載自選股
function requestOptional() {
    wx.getStorage({
        key: getApp().globalData.openId,
        success: function (res) {
            getApp().globalData.optionals = res.data
        }
    })
}

// 自选股列表
function optionals() {
    return getApp().globalData.optionals.split(',')
}

module.exports = {
    isOptional: isOptional,
    updateOptional: updateOptional,
    requestOptional: requestOptional,
    optionals: optionals
}