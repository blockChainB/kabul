
var ChartLayer = require('ChartLayer.js')

function XAxisLayer() {

	var mTextSize = 18
	var mMinLeftPaddingString = ''
	var mMinRightPaddingString = ''
	var mLeftAxisPadding = 0
	var mRightAxisPadding = 0
	var mAxisValues = []
	var mSpace = 0    // 坐标之间的间隔距离
	var mTextHeight = 0

	this.prepareBeforeDraw = function(rectF) {
		mTextHeight = measureTextHeight(this)
		this.mLeft = rectF.left
		this.mTop = rectF.top
		this.mRight = rectF.right
		this.mBottom = rectF.top + mTextHeight + 4    // 4是上下padding

		var ww = measureTextWidth(this, mMinLeftPaddingString)
		if (ww > mLeftAxisPadding) {
			mLeftAxisPadding = ww
		}

		ww = measureTextWidth(this, mMinRightPaddingString)
		if (ww > mRightAxisPadding) {
			mRightAxisPadding = ww
		}

		var leftWidth = this.getWidth() - this.mPaddingLeft - this.mPaddingRight - mLeftAxisPadding - mRightAxisPadding;
		if (mAxisValues.length == 1) {
			mSpace = leftWidth / 2
		} else if (mAxisValues.length > 1) {
			mSpace = leftWidth / (mAxisValues.length - 1)
		}
	}

	this.doDraw = function(context) {
		this.onDrawSide(context)

		this.drawGridLine(context)
		
		context.beginPath()
		context.setFontSize(10)
		context.setFillStyle('#828282')

		var y = this.mTop + (this.mBottom - this.mTop - mTextHeight) / 2 + mTextHeight

		var size = mAxisValues.length
		if (size == 1) {
			var x = this.mLeft + this.mPaddingLeft + mLeftAxisPadding + mSpace
			context.fillText(mAxisValues[0], x, y)
		} else {
			for (var i = 0; i < size; i++) {
				var text = mAxisValues[i]
				var x = this.mLeft + this.mPaddingLeft + mLeftAxisPadding + mSpace * i
				
				if (i == 0) {
					context.fillText(text, x, y)
				} else if (i == size - 1) {
					var w = measureTextWidth(this, text)
					context.fillText(text, x - w, y)
				} else {
					var w = measureTextWidth(this, text) - 6
					context.fillText(text, x - w / 2, y)
				}
			}
		}

		context.stroke()
		context.closePath()
	}

	this.addValue = function(value) {
		mAxisValues.push(value)
	}

	this.clearValue = function() {
		mAxisValues = []
	}

	this.setTextSize = function(size) {
		mTextSize = size
	}

	this.setMinLeftPaddingString = function(str) {
        mMinLeftPaddingString = str
    }

    this.setMinLeftPadding = function(padding) {
    	mLeftAxisPadding = padding
    }

    this.setMinRightPaddingString = function(str) {
        mMinRightPaddingString = str
    }

    this.setMinRightPadding = function(padding) {
    	mRightAxisPadding = padding
    }

    function measureTextWidth(that, text) {
		// 12为fontSize为10时，每个数字对应的的rpx宽度。计算出总rpx宽度后，乘以单位rpx对应的像素宽度，得到总像素宽度
		// console.log(that.getLengthPerRpx())
		text = text + ''
		return 10.8 * text.length * that.getLengthPerRpx()
	}

	function measureTextHeight(that) {
		return 16 * that.getLengthPerRpx()
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

extend(XAxisLayer, ChartLayer)

module.exports = XAxisLayer
