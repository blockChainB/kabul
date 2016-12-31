
var ChartLayer = require('ChartLayer.js')

function YAxisLayer() {

	var mAxisValues = []
	var mAxisCount = 2    // Y轴坐标数量
	var mMaxValue = 0
	var mMinValue = 0
	var mAlign = 0    // Y轴坐标中文字靠左、中、右侧对齐，分别用0/1/2表示
	var mMinWidth = 0
	var mStartX = 0
	var mSpace = 0
	var mMinWidthStr = ''
	var mFormatDataCallback = null
	var mTextHeight = 0

	this.prepareBeforeDraw = function(rectF) {
		this.mTop = rectF.top
		this.mBottom = rectF.bottom
		if (mAlign == 0) {
			// 靠左对齐
			this.mLeft = rectF.left
		} else if (mAlign == 2) {
			// 靠右对齐
			this.mRight = rectF.right
		} else if (mAlign == 1) {
			// 居中对齐
			this.mLeft = rectF.left
			this.mRight = rectF.right
		}

		mTextHeight = this.measureTextHeight()

		mAxisValues =  new Array(mAxisCount)
		var perValue = (mMaxValue - mMinValue) / (mAxisCount - 1)
		
		for (var i = 0; i < mAxisValues.length; i++) {
			// 首先，确定当前位置的数值。然后，格式化数据。接着，保存格式化数值。
			var value = 0
			if (i == 0) {
				value = mMaxValue
			} else if (i == mAxisValues.length - 1) {
				value = mMinValue
			} else {
				value = mMaxValue - perValue * i
			}

			if (mFormatDataCallback != null) {
				value = mFormatDataCallback(value)
			}
			value = value + ''

			mAxisValues[i] = value
		}
	}

	this.doDraw = function(context) {
		this.onDrawSide(context)

		this.drawGridLine(context)

		var startY = this.getContentTop() + mTextHeight

		context.beginPath()
		context.setFontSize(this.getTextSize())
		context.setFillStyle('#828282')
		for (var i = 0; i < mAxisCount; i++) {
			var text = mAxisValues[i]

			// 获取X位置
			var width = this.measureTextWidth(text)
			if (mAlign == 2) {
				// 靠右对齐
				mStartX = this.getContentRight() - width
			} else if (mAlign == 0) {
				// 靠左对齐
				mStartX = this.getContentLeft()
			}

			if (i == 0) {
				startY = startY += mTextHeight
				context.fillText(text, mStartX, startY)
			} else if (i == mAxisCount - 1) {
				startY = this.getContentBottom()
				context.fillText(text, mStartX, startY)
			} else {
				context.fillText(text, mStartX, startY)
			}

			startY += mSpace
		}
		context.stroke()
		context.closePath()
	}

	this.rePrepareWhenDrawing = function(rectF) {
		var height = this.mBottom - this.mTop - this.mPaddingTop - this.mPaddingBottom
		height = height - mAxisCount * mTextHeight
		mSpace = height / (mAxisCount - 1)
	}

	this.setAxisCount = function(count) {
		mAxisCount = count
	}

	this.getAxisCount = function() {
		return mAxisCount
	}

	this.setMinValue = function(value) {
		mMinValue = value
	}

	this.setMaxValue = function(value) {
		mMaxValue = value
	}

	this.setAlign = function(align) {
		mAlign = align
	}

	this.setMinWidth = function(width) {
		mMinWidth = width
	}

	this.setMinWidthString = function(str) {
		mMinWidthStr = str
	}

	this.setOnFormatDataListener = function(callback) {
		mFormatDataCallback = callback
	}

}

function extend(Child, Parent) {
	var F = function(){}
	var parent = new Parent()
	F.prototype = parent
	Child.prototype = new F()
	Child.prototype.constructor = Child
	Child.uber = parent
}

extend(YAxisLayer, ChartLayer)

module.exports = YAxisLayer
