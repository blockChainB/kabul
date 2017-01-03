// 判断是不是自选股
function isOptional(code) {
    if (getApp().globalData.optionals.indexOf(code) > -1) {
        return true;
    } else {
        return false;
    }
}

// 更新自选股
function updateOptional(goodsId) {
    if (isOptional(goodsId)) {
        var index = getApp().globalData.optionals.indexOf(goodsId);
        if (index > -1) {
            getApp().globalData.optionals.splice(index, 1);
        }
    } else {
        getApp().globalData.optionals.unshift(goodsId)
    }
}

module.exports = {
    isOptional: isOptional,
    updateOptional: updateOptional,
}