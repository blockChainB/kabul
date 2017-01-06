var MinuteCanvas = require('./layers/MinuteCanvas.js')
var KLineCanvas = require('./layers/KLineCanvas.js')

function KLineView() {

    this.drawnList = {
        minute: false,
        day: false,
        week: false,
        month: false,
        hour: false
    }

    this.isCanvasDrawn = function(canvasId) {
        var result = false

        switch(canvasId) {
            case 1:
                result = this.drawnList.minute;
                break;
            case 2:
                result = this.drawnList.day;
                break;
            case 3:
                result = this.drawnList.week;
                break;
            case 4:
                result = this.drawnList.month;
                break;
            case 5:
                result = this.drawnList.hour;
                break;
        }
        // console.log('canvasId ' + canvasId + ', result ' + result)
        // console.log(this.drawnList)

        return result;
    }

    this.drawMiniteCanvas = function(array, canvasId) {
        var canvas = new MinuteCanvas()
        canvas.addValues(array)
        canvas.invalidate('' + canvasId)

        this.setCanvasDrawn(canvasId)
    }

    this.drawKLineCanvas = function(array, canvasId, period) {
        var canvas = new KLineCanvas(period)
        canvas.addValues(array)
        canvas.invalidate('' + canvasId)

        this.setCanvasDrawn(canvasId)

        console.log('drawKLineCanvas canvasId ' + canvasId)
    }

    this.setCanvasDrawn = function(canvasId) {
        switch(canvasId) {
            case 1:
                this.drawnList.minute = true;
                break;
            case 2:
                this.drawnList.day = true;
                break;
            case 3:
                this.drawnList.week = true;
                break;
            case 4:
                this.drawnList.month = true;
                break;
            case 5:
                this.drawnList.hour = true;
                break;
        }
        // console.log('setCanvasDrawn',this.drawnList)
    }

}

module.exports = KLineView
