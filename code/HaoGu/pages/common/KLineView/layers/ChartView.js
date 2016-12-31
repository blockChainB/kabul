
var RectF = require('RectF.js')

function ChartView(left, top, right, bottom) {
	this.layers = []

	this.mLeft = left
	this.mTop = top
	this.mRight = right
	this.mBottom = bottom
	this.mAreaRectF = null

	this.mPaddingLeft = 0
	this.mPaddingTop = 0
	this.mPaddingRight = 0
	this.mPaddingBottom = 0

	this.addLayer = function(layer) {
		this.layers.push(layer)
	}

	this.onDraw = function(context) {
		if (this.mAreaRectF == null) {
			this.forceAdjustLayers()
		}
		this.rePrepareWhenDrawing(this.mAreaRectF)
		this.doDraw(context)
	}

	/**
	 * 只执行一次，用于确定各子layer绘图区域
	*/
	this.forceAdjustLayers = function() {
		this.mAreaRectF = new RectF(this.mLeft, this.mTop, this.mRight, this.mBottom)

		var usedHeight = 0

		// 获取固定高度的子layer占用的高度
		for (var i = 0; i < this.layers.length; i++) {
			var layer = this.layers[i]
			
			layer.prepareBeforeDraw(this.mAreaRectF)
			if (layer.getHeightPercent() == 0) {
				usedHeight += layer.getHeight()
			}
		}

		var leftHeight = this.getAvailHeight() - usedHeight

		// 确定各子layer绘图区域，当前情况下，上下区域共享边界那个像素
		var top = this.mTop + this.mPaddingTop
		for (var i = 0; i < this.layers.length; i++) {
			var layer = this.layers[i]
			if (layer.getHeightPercent() == 0) {
				var height = layer.getHeight()
				layer.layout(layer.mLeft, top, layer.mRight, top + height)
				top += height
			} else {
				var height = leftHeight * layer.getHeightPercent()
				layer.layout(layer.mLeft, top, layer.mRight, top + height)
				top += height
			}
		}
	}

	/**
	* 修改每次绘制时可能会动态变化的内容
	*/
	this.rePrepareWhenDrawing = function(rectF) {
		for (var i = 0; i < this.layers.length; i++) {
			var layer = this.layers[i]
			layer.rePrepareWhenDrawing(rectF)
		}
	}

	/**
	* 调用子 layer 执行绘制操作
	*/
	this.doDraw = function(context) {
		for (var i = 0; i < this.layers.length; i++) {
			var layer = this.layers[i]
			if (layer.isShow()) {
				layer.doDraw(context)
			}
		}
	}

	/**
	* 确定布局位置
	*/
	this.layout = function(left, top, right, bottom) {
		this.mLeft = left
		this.mTop = top
		this.mRight = right
		this.mBottom = bottom
	}

	this.setPaddings = function(left, top, right, bottom) {
		this.mPaddingLeft = left
		this.mPaddingTop = top
		this.mPaddingRight = right
		this.mPaddingBottom = bottom
	}

	this.getAvailHeight = function() {
		return this.mBottom - this.mTop - this.mPaddingTop - this.mPaddingBottom
	}

}

module.exports = ChartView
