var ColumnarAtom = require('ColumnarAtom.js')
var LineLayer = require('LineLayer.js')
var StackLayer = require('StackLayer.js')
var RectF = require('RectF.js')
var ChartView = require('ChartView.js')
var ColumnarLayer = require('ColumnarLayer.js')
var YAxisLayer = require('YAxisLayer.js')
var XAxisLayer = require('XAxisLayer.js')
var GroupLayer = require('GroupLayer.js')
var draw = require('../../../../utils/canvasUtil.js')

function MinuteCanvas() {
	this.mIsInit = false;    // 是否已初始化分时绘图区域布局结构和设置

	this.lineLayer = null
	this.avgLayer = null
	this.stackLayer = null
	this.columnarLayer = null
	this.priceLayer = null
	this.rightAxisLayer = null
	this.groupLayer = null
	this.bottomGroupLayer = null
	this.chartView = null
	this.mXAxisLayer = null

	this.canvasWidth = 750    // 画布宽度，单位rpx
	this.canvasHeight = 412    // 画布高度，单位rpx

	this.mClose = 0    // 昨收价
}

// 初始化分时绘图布局
MinuteCanvas.prototype.initLayers = function () {
	if (this.mIsInit == false) {

		var that = this
		var widthPerRpx = draw.getLengthByRpx(1)
		// console.log('width per ' + widthPerRpx)

		this.lineLayer = new LineLayer()
		this.lineLayer.setMaxCount(240)
		this.lineLayer.setStrokeWidth(widthPerRpx)    // 分时线宽度
		this.lineLayer.setColor('#379be9')            // 分时线颜色
		this.lineLayer.setShowShadow(true)
		this.lineLayer.setShadowColor('rgba(231, 241, 253, 0.5)')

		this.avgLayer = new LineLayer()
		this.avgLayer.setMaxCount(240)
		this.avgLayer.setStrokeWidth(widthPerRpx)               // 均线宽度
		this.avgLayer.setColor('#fbb040')

		this.priceLayer = new YAxisLayer()
		this.priceLayer.setAxisCount(3)
		this.priceLayer.setLengthPerRpx(widthPerRpx)
		this.priceLayer.setPaddings(2, 2, 2, 2)
		this.priceLayer.setOnFormatDataListener(function (data) {
			return data.toFixed(2)
		})

		this.rightAxisLayer = new YAxisLayer()
		this.rightAxisLayer.setAxisCount(2)
		this.rightAxisLayer.setBorderWidth(0);
		this.rightAxisLayer.setAlign(2);
		this.rightAxisLayer.setMinWidthString("-99.99%");
		this.rightAxisLayer.setLengthPerRpx(widthPerRpx)
		this.rightAxisLayer.setPaddings(2, 2, 2, 2)
		this.rightAxisLayer.setOnFormatDataListener(function (data) {
			return (data * 100).toFixed(2) + '%'
		})

		this.stackLayer = new StackLayer()
		this.stackLayer.addLayer(this.lineLayer)
		this.stackLayer.addLayer(this.avgLayer)
		this.stackLayer.setBorderWidth(widthPerRpx)    // 分隔线宽度
		this.stackLayer.setBorderColor('#dddddd')      // 分隔线颜色
		this.stackLayer.showHGrid(3)
		// this.stackLayer.showVGrid(3)
		this.stackLayer.setIsMiddleHLineSolid(true)
		this.stackLayer.setShowSide(this.stackLayer.SIDE_LEFT_V | this.stackLayer.SIDE_TOP_H | this.stackLayer.SIDE_RIGHT_V | this.stackLayer.SIDE_BOTTOM_H)

		this.groupLayer = new GroupLayer()
		this.groupLayer.setLeftLayer(this.priceLayer);
		this.groupLayer.setCenterLayer(this.stackLayer);
		this.groupLayer.setRightLayer(this.rightAxisLayer);
		this.groupLayer.setHeightPercent(0.7);

		this.columnarLayer = new ColumnarLayer()
		this.columnarLayer.setColumnarWidth(0.8)
		this.columnarLayer.setMaxCount(240)
		this.columnarLayer.setOnDrawCallback(function (context, pos) {
			// console.log('pos: ' + pos)
			var color = '#e64340'
			var currentPrice = that.lineLayer.getValue(pos)
			var prePrice = that.lineLayer.getValue(pos > 0 ? pos - 1 : 0)
			if (currentPrice >= prePrice) {
				color = '#e64340'
			} else {
				color = '#09bb07'
			}
			context.setStrokeStyle(color)
			context.setFillStyle(color)
		})

		this.bottomGroupLayer = new GroupLayer()
		this.bottomGroupLayer.setCenterLayer(this.columnarLayer)
		this.bottomGroupLayer.setHeightPercent(0.3)
		this.bottomGroupLayer.setBorderWidth(0.5)
		this.bottomGroupLayer.setBorderColor('#676872')
		this.bottomGroupLayer.setShowSide(this.stackLayer.SIDE_BOTTOM_H)

		this.mXAxisLayer = new XAxisLayer()
		this.mXAxisLayer.addValue("9:30");
		this.mXAxisLayer.addValue("11:30 13:00");
		this.mXAxisLayer.addValue("15:00");
		this.mXAxisLayer.setLengthPerRpx(widthPerRpx)

		var width = draw.getLengthByRpx(this.canvasWidth)
		var height = draw.getLengthByRpx(this.canvasHeight)
		// console.log('width: ' + width + ', height: ' + height)
		this.chartView = new ChartView(0, 0, width * 1.0, height * 1.0)
		this.chartView.addLayer(this.groupLayer)
		this.chartView.addLayer(this.bottomGroupLayer)
		this.chartView.addLayer(this.mXAxisLayer)

		this.mIsInit = true;
	}
}

// 分时布局添加数据
// {
// close
// goods_id
// market_date
// minutes
// }
MinuteCanvas.prototype.addValues = function (obj) {
	if (this.mIsInit == false) {
		this.initLayers();
	}

	if (this.mIsInit && obj != null) {
		var values = obj.minutes
		this.mClose = obj.close / 1000.0
		// console.log('addValues ----> close ', this.mClose)

		this.lineLayer.clear()
		this.avgLayer.clear()
		this.columnarLayer.clear()

		for (var i = 0; i < values.length; i++) {
			if (this.lineLayer.getValueCount() > 240)
				break

			this.addValue(values[i])
		}
	}
}

// 分时布局添加数据
MinuteCanvas.prototype.addValue = function (value) {
	if (this.mIsInit == false) {
		this.initLayers();
	}

	if (this.mIsInit && value != null) {
		var pos = minuteTimeToPos(value.time)
		var price = value.price / 1000
		var avg = value.avg / 1000
		var column = value.column

		if (pos >= 0 && pos <= this.lineLayer.getValueCount()) {
			this.lineLayer.setValue(pos, price)
			this.avgLayer.setValue(pos, avg)
			this.columnarLayer.setValue(pos, new ColumnarAtom(0, 0, 0, column))
			// console.log('pos: ' + pos + ', price: ' + price)
		} else if (pos > this.lineLayer.getValueCount()) {
			var lastPrice = this.lineLayer.getLastValue()
			var lastAvg = this.lineLayer.getLastValue()
			if (lastPrice == 0) {
				lastPrice = this.mClose
				lastAvg = this.mClose
			}

			for (var j = 0; j < pos - this.lineLayer.getValueCount(); j++) {
				this.lineLayer.addValue(lastPrice)
				this.avgLayer.addValue(lastAvg)
				this.columnarLayer.addValue(new ColumnarAtom(0, 0, 0, 0))
			}

			this.lineLayer.setValue(pos, price)
			this.avgLayer.setValue(pos, avg)
			this.columnarLayer.setValue(pos, new ColumnarAtom(0, 0, 0, column))
			// console.log('pos: ' + pos + ', price: ' + price)
		}
	}
}

// 计算最大最小值
MinuteCanvas.prototype.calculate = function () {
	var minValue = 0
	var maxValue = 0
	var zdf = 0.1

	var minAndMax = this.stackLayer.calMinAndMaxValue()
	minValue = minAndMax[0]
	maxValue = minAndMax[1]
	// console.log('min: ' + minValue + ', maxValue: ' + maxValue)

	if (minValue == this.mClose && maxValue == this.mClose) {
		// 开盘前
		minValue = this.mClose * 0.9
		maxValue = this.mClose * 1.1
		zdf = 0.1
	} else {
		var offsetMax = Math.abs(maxValue - this.mClose)
		var offsetMin = Math.abs(minValue - this.mClose)
		var offset = offsetMax > offsetMin ? offsetMax : offsetMin
		minValue = this.mClose - offset
		maxValue = this.mClose + offset

		if (this.mClose > 0) {
			zdf = Math.abs(offset / this.mClose)
		}
	}

	this.lineLayer.setMinValue(minValue)
	this.lineLayer.setMaxValue(maxValue)
	this.avgLayer.setMinValue(minValue)
	this.avgLayer.setMaxValue(maxValue)
	this.priceLayer.setMinValue(minValue)
	this.priceLayer.setMaxValue(maxValue)
	this.rightAxisLayer.setMaxValue(zdf)
	this.rightAxisLayer.setMinValue(-zdf)
	// console.log('minute canvas min: ' + minValue + ', max: ' + maxValue + ', zdf' + zdf + ', -zdf: ' + -zdf)
	this.columnarLayer.calMinAndMaxValue()
}

// 分时布局开始绘制
MinuteCanvas.prototype.invalidate = function (id) {
	if (this.mIsInit == true) {
		this.calculate()

		const context = wx.createCanvasContext(id)
		this.chartView.onDraw(context)
		context.draw()
	}
}

MinuteCanvas.prototype.setHeight = function (height) {
	this.canvasHeight = height
}

MinuteCanvas.prototype.setWidth = function (width) {
	this.canvasWidth = width
}

module.exports = MinuteCanvas

function minuteTimeToPos(time) {
	var ret = 0

	var h = parseInt(time / 100)
	var m = time % 100

	if (h >= 9 && h <= 11) {
		ret = (h * 60 + m) - 570;  // 9 * 60 + 30
		ret = ret > 120 ? 120 : ret
	} else if (h >= 13 && h <= 15) {
		ret = (h * 60 + m) - 780; // 13 * 60
		ret = ret > 120 ? 240 : ret + 120;
	}

	ret = ret > 0 ? ret - 1 : 0

	return ret
}
