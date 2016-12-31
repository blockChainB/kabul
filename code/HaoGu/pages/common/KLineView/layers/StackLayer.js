
var ChartLayer = require('ChartLayer.js')

function StackLayer() {

	var mIsAvgLineIdentifyShow = false    // 是否显示均线指标
	this.layers = []

	this.addLayer = function(layer) {
		this.layers.push(layer)
	}

	this.clear = function() {
		this.layers = []
		this.mMaxValue = 0
		this.mMinValue = 0
	}

	this.prepareBeforeDraw = function(rectF) {
		this.mLeft = rectF.left
		this.mTop = rectF.top
		this.mRight = rectF.right
		this.mBottom = rectF.bottom

		for (var i = 0; i < this.layers.length; i++) {
			this.layers[i].prepareBeforeDraw(rectF)
		}
	}

	this.layout = function(left, top, right, bottom) {
		this.mLeft = left
		this.mTop = top
		this.mRight = right
		this.mBottom = bottom
		
		for (var i = 0; i < this.layers.length; i++) {
			this.layers[i].layout(this.getContentLeft(), this.getContentTop(), this.getContentRight(), this.getContentBottom())
		}
	}

	this.rePrepareWhenDrawing = function() {
		for (var i = 0; i < this.layers.length; i++) {
			this.layers[i].rePrepareWhenDrawing()
		}
	}

	this.doDraw = function(context) {
		this.onDrawSide(context)

		this.drawGridLine(context)

		// draw image
		if (mIsAvgLineIdentifyShow) {
			this.drawAvgLineIdentify(context, 0, 0)
        }

		// draw top&bottom dash line
		if (this.isShowHPaddingLine()) {
			if (this.mPaddingTop > 0) {
				this.drawHDashLine(context, this.getContentLeft(), this.getContentRight(), this.getContentTop())
			}

			if (this.mPaddingBottom > 0) {
				this.drawHDashLine(context, this.getContentLeft(), this.getContentRight(), this.getContentBottom())
			}
		}

		for (var i = 0; i < this.layers.length; i++) {
			if (this.layers[i].isShow()) {
				this.layers[i].doDraw(context)
			}
		}
	}

	this.drawAvgLineIdentify = function(context, left, top) {
		var yLine = this.mTop + this.getBorderWidthTop() + this.mPaddingTop / 2
		var yText = yLine + this.measureTextHeight() / 2

		var leftSpace = 10
		var rightSpace = 5
		var lineWidth = 10
		var x = left

		left += leftSpace
		context.beginPath()
		context.setLineWidth(0.5)
		context.setStrokeStyle('#febe00')
		context.moveTo(left, yLine)
		context.lineTo(left + lineWidth, yLine)
		context.stroke()
		context.closePath()

		left += lineWidth + rightSpace
		context.beginPath()
		context.setFillStyle('#7a7a7a')
		context.setFontSize(10)
		context.fillText("5MA", left, yText)
		context.fill()
		context.closePath()

		left += leftSpace + this.measureTextWidth("5MA")
		context.beginPath()
		context.setLineWidth(0.5)
		context.setStrokeStyle('#4084d2')
		context.moveTo(left, yLine)
		context.lineTo(left + lineWidth, yLine)
		context.stroke()
		context.closePath()

		left += lineWidth + rightSpace
		context.beginPath()
		context.setFillStyle('#7a7a7a')
		context.setFontSize(10)
		context.fillText("10MA", left, yText)
		context.fill()
		context.closePath()

		left += leftSpace + this.measureTextWidth("10MA")
		context.beginPath()
		context.setLineWidth(0.5)
		context.setStrokeStyle('#e319a3')
		context.moveTo(left, yLine)
		context.lineTo(left + lineWidth, yLine)
		context.stroke()
		context.closePath()

		left += lineWidth + rightSpace
		context.beginPath()
		context.setFillStyle('#7a7a7a')
		context.setFontSize(10)
		context.fillText("20MA", left, yText)
		context.fill()
		context.closePath()
	}

	this.calMinAndMaxValue = function() {
		var isFirst = true

		for (var i = 0; i < this.layers.length; i++) {
			var layer = this.layers[i]
			var minAndMax = layer.calMinAndMaxValue()
			if (minAndMax != null && layer.isShow()) {
				if (isFirst == true) {
					this.mMinValue = minAndMax[0]
					this.mMaxValue = minAndMax[1]
					isFirst = false
				} else {
					if (this.mMinValue > minAndMax[0]) {
						this.mMinValue = minAndMax[0]
					}
					if (this.mMaxValue < minAndMax[1]) {
						this.mMaxValue = minAndMax[1]
					}
				}
			}
		}

		return [this.mMinValue, this.mMaxValue]
	}

	this.isShow = function() {
		for (var i = 0; i < this.layers.length; i++) {
			if (this.layers[i].isShow()) {
				return true
			}
		}

		return false
	}

	this.getLayers = function() {
		return this.layers
	}

	this.switchAvgLineIdentifyOn = function(isOn) {
        mIsAvgLineIdentifyShow = isOn
    }

}

/**
* 1. 实现继承
* 2. 提供指向父类对象的指针uber
*/
function extend(Child, Parent) {
	var F = function(){}
	var parent = new Parent()
	F.prototype = parent
	Child.prototype = new F()
	Child.prototype.constructor = Child
	Child.uber = parent
}

extend(StackLayer, ChartLayer)

module.exports = StackLayer
