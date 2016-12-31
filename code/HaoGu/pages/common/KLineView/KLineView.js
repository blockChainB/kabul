var MinuteCanvas = require('./layers/MinuteCanvas.js')
var KLineCanvas = require('./layers/KLineCanvas.js')

let NorColorForIndicator = '#888888'
let SelColorForIndicator = '#ffffff'
var windowWidth = 375
let isHasGetWidth = false    // 是否已获取屏幕宽度

function init(that) {
    var tempData = Object.assign({
        kLineData: {
            currentIndex: 0,
            leftIndicatorColor: SelColorForIndicator,
            rightIndicatorColor: NorColorForIndicator,
        }
    }, that.data)
    that.setData(tempData)
    
    if (isHasGetWidth == false) {
        // 手机屏幕宽度不会变，只需获取一次。
        wx.getSystemInfo({
            success: function (res) {
                windowWidth = res.windowWidth
            }
        })

        isHasGetWidth = true
    }

    // console.log(tempData, that.data, windowWidth)
}

// 滑动一次，吊用两次，必须使用e
function onChangedEvent(e, that, callback) {
    var leftColor = NorColorForIndicator
    if (e.detail.current == 0) {
        leftColor = NorColorForIndicator
    } else {
        leftColor = SelColorForIndicator
    }

    changeIndex(leftColor, that, callback)
}

function onTapEvent(that, callback) {
    changeIndex(that.data.kLineData.leftIndicatorColor, that, callback)
}

function drawMiniteCanvas(array) {
    var canvas = new MinuteCanvas(windowWidth)
    canvas.addValues(array)
    canvas.invalidate(1)
}

function drawKLineCanvas(array) {
    var canvas = new KLineCanvas(windowWidth)
    canvas.addValues(array)
    canvas.invalidate(2)
}

function changeIndex(leftColor, that, callback) {

    if (leftColor == SelColorForIndicator) {
        that.setData({
            kLineData: {
                leftIndicatorColor: NorColorForIndicator,
                rightIndicatorColor: SelColorForIndicator,
                currentIndex: 1,
            }
        })
    } else {
        that.setData({
            kLineData: {
                leftIndicatorColor: SelColorForIndicator,
                rightIndicatorColor: NorColorForIndicator,
                currentIndex: 0,
            }
        })
    }

    if (typeof (callback) == 'function') {
        callback()
    }
}


module.exports = {
    init: init,
    onChangedEvent: onChangedEvent,
    onTapEvent: onTapEvent,
    drawMiniteCanvas: drawMiniteCanvas,
    drawKLineCanvas: drawKLineCanvas
}