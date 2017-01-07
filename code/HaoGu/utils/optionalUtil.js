// 判断是不是自选股
function isOptional(goodsId) {
    if (getApp().globalData.optionals.indexOf(goodsId) > -1) {
        return true;
    } else {
        return false;
    }
}

// 更新自选股
function updateOptional(goodsId) {
    if (isOptional(goodsId)) {
        getApp().globalData.optionals.removeObject(goodsId)
    } else {

        if (typeof (goodsId) == 'number') {
            getApp().globalData.optionals.unshift(goodsId)
        } else {
            console.log("========自选股ID类型不对")
        }
    }
}

// 
function tempOptionals(goodsId) {
    var optionals = []
    for (let i = 0; i < getApp().globalData.optionals.length; i++) {
        optionals.push(getApp().globalData.optionals[i])
    }

    if (goodsId < 0) {
        return optionals
    }

    if (isOptional(goodsId)) {
        optionals.removeObject(goodsId)
    } else {
        optionals.unshift(goodsId)
    }

    return optionals
}

module.exports = {
    isOptional: isOptional,
    updateOptional: updateOptional,
    tempOptionals: tempOptionals
}