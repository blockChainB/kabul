
var RectF = require('RectF.js')

function ChartLayer() {

	this.mIsShow = true

	this.mLeft = 0
	this.mTop = 0
	this.mRight = 0
	this.mBottom = 0

	this.mPaddingLeft = 0
	this.mPaddingTop = 0
	this.mPaddingRight = 0
	this.mPaddingBottom = 0

	this.mColor = '#000000'    // 分时线颜色
	this.mTextSize = 10    // 字体大小

	// 边框
	this.mBorderColor = '#676872'   // GRAY
	this.mBorderWidth = 0.5
	this.mShowSide = 0
	this.SIDE_LEFT_V = 1
	this.SIDE_MIDDLE_V = 2
	this.SIDE_RIGHT_V = 4
	this.SIDE_TOP_H = 8
	this.SIDE_BOTTOM_H = 16

	// 横竖分隔线
	this.mIsHLineSolid = true       // 横平线是否画成实线
	this.mHLineNum = 0
	this.mVLineNum = 0
	this.mIsShowHGrid = false
	this.mIsShowVGrid = false

	this.mHeightPercent = 0

	this.mLengthPerRpx = 0    // 每单位rpx对应的像素长度

	this.mIsShowHPaddingLine = false    // K线上方的水平分隔虚线是否显示

	this.mMaxValue = 0
	this.mMinValue = 0

	this.setColor = function(color) {
		this.mColor = color
	}

	this.getColor = function() {
		return this.mColor
	}

	this.setBorderColor = function(color) {
		this.mBorderColor = color
	}

	this.getBorderColor = function() {
		return this.mBorderColor
	}

	this.setBorderWidth = function(width) {
		this.mBorderWidth = width
	}

	this.getBorderWidth = function() {
		return this.mBorderWidth
	}

	this.getBorderWidthLeft = function() {
		return this.isShowSideLeft() ? this.mBorderWidth : 0;
	}

	this.getBorderWidthTop = function() {
		return this.isShowSideTop() ? this.mBorderWidth : 0;
	}

	this.getBorderWidthRight = function() {
		return this.isShowSideRight() ? this.mBorderWidth : 0;
	}

	this.getBorderWidthBottom = function() {
		return this.isShowSideBottom() ? this.mBorderWidth : 0;
	}

	this.setShowSide = function(side) {
		this.mShowSide = side
	}

	this.isShowSideLeft = function() {
		return (this.mShowSide & this.SIDE_LEFT_V) == this.SIDE_LEFT_V
	}

	this.isShowSideTop = function() {
		return (this.mShowSide & this.SIDE_TOP_H) == this.SIDE_TOP_H
	}

	this.isShowSideRight = function() {
		return (this.mShowSide & this.SIDE_RIGHT_V) == this.SIDE_RIGHT_V
	}

	this.isShowSideBottom = function() {
		return (this.mShowSide & this.SIDE_BOTTOM_H) == this.SIDE_BOTTOM_H
	}

	this.onDrawSide = function(context) {
		context.beginPath()
		context.setStrokeStyle(this.getBorderColor())
		context.setLineWidth(this.getBorderWidth())

		if (this.isShowSideLeft()) {
			context.moveTo(this.mLeft, this.mTop)
			context.lineTo(this.mLeft, this.mBottom)
		}

		if (this.isShowSideTop()) {
			context.moveTo(this.mLeft, this.mTop)
			context.lineTo(this.mRight, this.mTop)
		}

		if (this.isShowSideRight()) {
			context.moveTo(this.mRight, this.mTop)
			context.lineTo(this.mRight, this.mBottom)
		}

		if (this.isShowSideBottom()) {
			context.moveTo(this.mLeft, this.mBottom)
			context.lineTo(this.mRight, this.mBottom)
		}

		context.stroke()
		context.closePath()
	}

	this.setPaddings = function(left, top, right, bottom) {
		this.mPaddingLeft = left
		this.mPaddingTop = top
		this.mPaddingRight = right
		this.mPaddingBottom = bottom
	}

	this.getRectF = function() {
		return new RectF.RectF(this.mLeft, this.mTop, this.mRight, this.mBottom)
	}

	// 获取内容左边界
	this.getContentLeft = function() {
		return this.mLeft + this.getBorderWidthLeft() + this.mPaddingLeft
	}

	// 获取内容上边界
	this.getContentTop = function() {
		return this.mTop + this.getBorderWidthTop() + this.mPaddingTop
	}

	// 获取内容右边界
	this.getContentRight = function() {
		return this.mRight - this.getBorderWidthRight() - this.mPaddingRight
	}

	// 获取内容下边界
	this.getContentBottom = function() {
		return this.mBottom - this.getBorderWidthBottom() - this.mPaddingBottom
	}

	// 内容、边框、padding的总宽度
	this.getWidth = function() {
		return this.mRight - this.mLeft
	}

	// 内容宽度
	this.getContentWidth = function() {
		return this.getWidth() - this.getBorderWidthLeft() - this.getBorderWidthRight() - this.mPaddingLeft - this.mPaddingRight
	}

	// 内容、边框、padding的总高度
	this.getHeight = function() {
		return this.mBottom - this.mTop
	}

	// 内容高度
	this.getContentHeight = function() {
		return this.getHeight() - this.getBorderWidthTop() - this.getBorderWidthBottom() - this.mPaddingTop - this.mPaddingBottom
	}

	this.setIsShow = function(isShow) {
		this.mIsShow = isShow
	}

	this.isShow = function() {
		return this.mIsShow
	}

	this.doDraw = function() {
		// 所有子类都必须实现
	}

	this.prepareBeforeDraw = function(rectF) {
		// 所有子类都必须实现
		// 1. 先让各级子layer的边界与charView相同，然后再在layout()时修改。
		// 2. 确定坐标layer的宽度或高度
	}

	this.layout = function(left, top, right, bottom) {
		this.mLeft = left
		this.mTop = top
		this.mRight = right
		this.mBottom = bottom
		// 1. 设置本layer的边界
		// 2. 初始化本layer的一些不会动态变化的数据
	}

	this.rePrepareWhenDrawing = function() {
		// 所有子类都必须实现
		// 修改绘制时可能会动态变化的数据
	}

	this.setIsMiddleHLineSolid = function(isFull) {
		this.mIsHLineSolid = isFull
	}

	this.getIsMiddleHLineSolid = function() {
		return this.mIsHLineSolid
	}

	this.isShowHGrid = function() {
		return this.mIsShowHGrid
	}

	this.getHLineCount = function() {
		return this.mHLineNum
	}

	this.isShowVGrid = function() {
		return this.mIsShowVGrid
	}

	this.getVLineCount = function() {
		return this.mVLineNum
	}

	this.showHGrid = function(num) {
		this.mHLineNum = num
		this.mIsShowHGrid = num > 0
	}

	this.showVGrid = function(num) {
		this.mVLineNum = num
		this.mIsShowVGrid = num > 0
	}

	this.setHeightPercent = function(percent) {
		this.mHeightPercent = percent
	}

	this.getHeightPercent = function() {
		return this.mHeightPercent
	}

	this.getLeft = function() {
		return this.mLeft
	}

	this.getTop = function() {
		return this.mTop
	}

	this.getRight = function() {
		return this.mRight
	}

	this.getBottom = function() {
		return this.mBottom
	}

	this.setLengthPerRpx = function(value) {
		this.mLengthPerRpx = value
	}

	this.getLengthPerRpx = function() {
		return this.mLengthPerRpx
	}

	// 绘制水平虚线
	this.drawHDashLine = function(context, left, right, y) {
		context.beginPath()
		context.setStrokeStyle(this.getBorderColor())
		context.setLineWidth(this.getBorderWidth())

		var width = right - left

		context.moveTo(left, y)
		while (left + 3 <= width) {
			context.lineTo(left + 3, y)
			left = left + 3

			if (left + 2 <= width) {
				left = left + 2
				context.moveTo(left, y)
			} else {
				break
			}
		}

		context.stroke()
		context.closePath()
	}

	// 绘制垂直虚线
	this.drawVDashLine = function(context, top, bottom, x) {
		context.beginPath()
		context.setStrokeStyle(this.getBorderColor())
		context.setLineWidth(this.getBorderWidth())

		var height = bottom - top

		context.moveTo(x, top)
		while (top + 3 <= height) {
			context.lineTo(x, top + 3)
			top = top + 3

			if (top + 2 <= height) {
				top = top + 2
				context.moveTo(x, top)
			} else {
				break
			}
		}

		context.stroke()
		context.closePath()
	}

	// 绘制水平实线
	this.drawHLine = function(context, left, right, y) {
		context.beginPath()
		context.setStrokeStyle(this.getBorderColor())
		context.setLineWidth(this.getBorderWidth())

		context.moveTo(left, y)
		context.lineTo(right, y)

		context.stroke()
		context.closePath()
	}

	// 绘制垂直实线
	this.drawVLine = function(context, top, bottom, x) {
		context.beginPath()
		context.setStrokeStyle(this.getBorderColor())
		context.setLineWidth(this.getBorderWidth())

		context.moveTo(x, top)
		context.lineTo(x, bottom)

		context.stroke()
		context.closePath()
	}

	// 绘制横竖分隔线。
	this.drawGridLine = function(context) {
		if (this.isShowHGrid()) {
			var lineNum = this.getHLineCount()
			var height = this.getContentHeight()
			var perHeight = height / (lineNum + 1)
            var top = this.getContentTop()

			var middleIndex = -1;
            if (this.getIsMiddleHLineSolid()) {
                if (lineNum >= 3 && lineNum % 2 == 1) {
                    middleIndex = Math.floor(lineNum / 2);
                }
            }

            for (var i = 0; i < lineNum; i++) {
                top += perHeight;

				if (middleIndex == i) {
					this.drawHLine(context, this.getContentLeft(), this.getContentRight(), top)
				} else {
					this.drawHDashLine(context, this.getContentLeft(), this.getContentRight(), top)
				}
            }
		}
		if (this.isShowVGrid()) {
			var lineNum = this.getVLineCount()
			var width = this.getContentWidth()
			var perWidth = width / (lineNum + 1)
			var left = this.getContentLeft()

			for (var i = 0; i < lineNum; i++) {
				left += perWidth
				this.drawVDashLine(context, this.getContentTop(), this.getContentBottom(), left)
			}
		}
	}

	this.setIsShowHPaddingLine = function(value) {
		this.mIsShowHPaddingLine = value
	}

	this.isShowHPaddingLine = function() {
		return this.mIsShowHPaddingLine
	}

	this.setMaxValue = function(value) {
		this.mMaxValue = value
	}

	this.getMaxValue = function() {
		return this.mMaxValue
	}

	this.setMinValue = function(value) {
		this.mMinValue = value
	}

	this.getMinValue = function() {
		return this.mMinValue
	}

	this.setTextSize = function(size) {
		this.mTextSize = size
	}

	this.getTextSize = function() {
		return this.mTextSize
	}

	this.measureTextWidth = function(text) {
		// 12为fontSize为10时，每个数字对应的的rpx宽度。计算出总rpx宽度后，乘以单位rpx对应的像素宽度，得到总像素宽度
		// console.log(that.getLengthPerRpx())
		text = text + ''
		return this.getTextSize() * text.length * this.getLengthPerRpx()
	}

	this.measureTextHeight = function() {
		return this.getTextSize() * this.getLengthPerRpx()
	}

}

module.exports = ChartLayer
