
var ChartLayer = require('ChartLayer.js')

function ColumnarLayer() {
	this.mValues = []
	this.mMaxCount = 0
	this.mColumnarWidth = 1
	this.mStartPos = 0
	var mSpace = 0
	var mHeightPerValue = 0
	var mOnDrawCallback = null
	var that = this
	this.mStrokeWidth = 0    // K线上下影线宽度
	this.mHasDataState = 0    // 标记是否设置过startPos的值，若未初始化过startPos的值，为0，初始化过之后，值为1

	this.setColumnarWidth = function(width) {
		this.mColumnarWidth = width
	}

	this.getColumnarWidth = function() {
		return this.mColumnarWidth
	}

	this.addValue = function(value) {
		this.mValues.push(value)
	}

	this.setValue = function(index, value) {
		if (index >= 0 && index <= this.mValues.length - 1) {
			this.mValues[index] = value
		} else if(index == this.mValues.length) {
			this.addValue(value)
		}
	}

	this.getValue = function(pos) {
		return this.mValues[pos]
	}

	this.getValues = function(pos) {
		return this.mValues
	}

    this.clear = function() {
        this.mValues = []
        this.mMinValue = 0
        this.mMaxValue = 0
    }

	this.getLastValue = function() {
        if (this.getValueCount() > 0) {
            return this.getValue(this.getValueCount() - 1);
        }
        return null;
    }

	this.getDisplayFirstValue = function() {
        if (this.getValueCount() > this.mStartPos) {
            return this.getValue(this.mStartPos);
        }
        return null;
    }

	this.getValueCount = function() {
		return this.mValues.length
	}

	this.calMinAndMaxValue = function() {
		var size = this.mStartPos + this.mMaxCount > this.mValues.length ? this.mValues.length : this.mStartPos + this.mMaxCount

		for (var i = this.mStartPos; i < size; i++) {
			var value = this.mValues[i]

			if (i == this.mStartPos) {
				// 初始化this.mMinValue & this.mMaxValue
				this.mMaxValue = value.mHigh;
				if (this.mMaxValue < value.mClose) {
					this.mMaxValue = value.mClose;
				}
				if (this.mMaxValue < value.mOpen) {
					this.mMaxValue = value.mOpen;
				}
				if (this.mMaxValue < value.mLow) {
					this.mMaxValue = value.mLow;
				}

				this.mMinValue = value.mLow;
                if (this.mMinValue > value.mClose) {
                    this.mMinValue = value.mClose;
                }
                if (this.mMinValue > value.mOpen) {
                    this.mMinValue = value.mOpen;
                }
                if (this.mMinValue > value.mHigh) {
                    this.mMinValue = value.mHigh;
                }
			} else {
				if (this.mMaxValue < value.mHigh) {
                    this.mMaxValue = value.mHigh;
                }
                if (this.mMaxValue < value.mClose) {
                    this.mMaxValue = value.mClose;
                }
                if (this.mMaxValue < value.mOpen) {
                    this.mMaxValue = value.mOpen;
                }
                if (this.mMaxValue < value.mLow) {
                    this.mMaxValue = value.mLow;
                }

                if (this.mMinValue > value.mLow) {
                    this.mMinValue = value.mLow;
                }
                if (this.mMinValue > value.mClose) {
                    this.mMinValue = value.mClose;
                }
                if (this.mMinValue > value.mOpen) {
                    this.mMinValue = value.mOpen;
                }
                if (this.mMinValue > value.mHigh) {
                    this.mMinValue = value.mHigh;
                }
			}
		}

		return [this.mMinValue, this.mMaxValue]
	}

	this.prepareBeforeDraw = function(rectF) {
		this.mLeft = rectF.left
        this.mTop = rectF.top
        this.mRight = rectF.right
        this.mBottom = rectF.bottom
	}

	this.rePrepareWhenDrawing = function(rectF) {
		var totalWidth = this.getContentWidth() - this.mColumnarWidth * this.mMaxCount
		mSpace = (totalWidth / (this.mMaxCount - 1))

		var totalHeight = this.getContentHeight()
		mHeightPerValue = totalHeight / (this.mMaxValue - this.mMinValue)
	}

	this.doDraw = function(context) {
        this.onDrawSide(context)

        this.drawGridLine(context)
        
		var index = 0

		for (var i = this.mStartPos; i < this.mValues.length; i++) {
			if (i - this.mStartPos >= this.mMaxCount) break;

			context.beginPath()
			context.setLineWidth(this.mStrokeWidth)

			if (mOnDrawCallback != null) {
				mOnDrawCallback(context, i)
			}

			var x = pos2X(index, this)
			var value = this.mValues[i]
			drawOneColumnar(i, x, value, context, this)

			context.closePath()

			index++;
		}
	}

	this.setOnDrawCallback = function(callback) {
		mOnDrawCallback = callback
	}

	function pos2X(index, that) {
		var x = that.getContentLeft() + that.mColumnarWidth * index + mSpace * index + that.mColumnarWidth / 2
		return x
	}

	function value2Y(that, value) {
		return that.getContentBottom() - mHeightPerValue * (value - that.mMinValue)
	}

	function drawOneColumnar(index, centerX, value, context, that) {
		var halfColumnWidth = that.mColumnarWidth / 2
		var left = centerX - halfColumnWidth
		var right = centerX + halfColumnWidth
		var lineX = centerX     // 影线X坐标位置，绘制线时，从线的宽度的中间开始画

		if (value.mOpen > value.mClose) {
            if (value.mHigh != value.mOpen) {
            	// 绘制上出线
            	context.moveTo(lineX, value2Y(that, value.mHigh))
            	context.lineTo(lineX, value2Y(that, value.mOpen))
            	context.stroke()
            }
            if (value.mClose != value.mLow) {
            	// 绘制下出线
            	context.moveTo(lineX, value2Y(that, value.mClose))
            	context.lineTo(lineX, value2Y(that, value.mLow))
            	context.stroke()
            }
            // 绘制柱状部分
            var openY = value2Y(that, value.mOpen)
            var closeY = value2Y(that, value.mClose)
            context.rect(left, openY, (right - left), (closeY - openY))
            context.fill()
        } else if (value.mOpen < value.mClose) {
            if (value.mHigh != value.mClose && value.mHigh > value.mClose) {
            	// 绘制上影线
            	context.moveTo(lineX, value2Y(that, value.mHigh))
            	context.lineTo(lineX, value2Y(that, value.mClose))
            	context.stroke()
            }
            if (value.mOpen != value.mLow && value.mOpen > value.mLow) {
            	// 绘制下影线
            	context.moveTo(lineX, value2Y(that, value.mOpen))
            	context.lineTo(lineX, value2Y(that, value.mLow))
            	context.stroke()
            }
            // 绘制柱状部分
            var openY = value2Y(that, value.mOpen)
            var closeY = value2Y(that, value.mClose)
            var width = right - left
            var height = openY - closeY
            // console.log('left: ' + left.toFixed(2) + ', width: ' + width + ', height: ' + height.toFixed(2))
            context.rect(left, closeY, Math.abs(right - left), Math.abs(openY - closeY))
            context.fill()
        } else {
        	// 平盘
            if (value.mHigh != value.mLow) {
            	// 绘制上下影线
            	context.moveTo(lineX, value2Y(that, value.mHigh))
            	context.lineTo(lineX, value2Y(that, value.mLow))
            	context.stroke()
            }
            context.moveTo(left, value2Y(that, value.mClose))
            context.lineTo(right, value2Y(that, value.mClose))
            context.stroke()
        }
	}

	// 设置K线上下影线宽度
	this.setStrokeWidth = function(width) {
		this.mStrokeWidth = width
	}

	this.setStartPos = function(pos) {
        if (this.getValueCount() <= 0) {
            this.mStartPos = 0;
            return;
        }

        if (pos < 0) {
            this.mStartPos = 0;
        } else if (pos > getValueCount() - this.mMaxCount) {
            this.mStartPos = getValueCount() - this.mMaxCount;
        } else {
            this.mStartPos = pos;
        }
    }

	/**
	* 设置显示的最大根数
	* @param count 最大根数
	* @param direction 0:从第一根显示; 1:从倒数第count根显示
	*/
	this.setMaxCount = function(count) {
        if (this.getValueCount() <= 0) {
            this.mMaxCount = count;
            this.mStartPos = 0;
        } else {
            if (this.mHasDataState == 0) {
                this.mHasDataState = 1;

                this.mStartPos = 0;
                if (this.getValueCount() > count) {
                    this.mStartPos = this.getValueCount() - count;
                }

                this.mMaxCount = count;
            } else {
                if (this.getValueCount() > count) {
                    if (count < this.mMaxCount)/* 放大 */{
                        this.mStartPos += (this.mMaxCount - count);
                        if (this.mStartPos > this.getValueCount() - count) {
                            this.mStartPos = this.getValueCount() - count;
                        }
                    } else if (count > this.mMaxCount)/* 缩小 */{
                        this.mStartPos -= (count - this.mMaxCount);
                        if (this.mStartPos < 0) {
                            this.mStartPos = 0;
                        }
                    }
                } else {
                    this.mStartPos = 0;
                }
                this.mMaxCount = count;
            }
        }
    }

	this.getMaxCount = function() {
		return this.mMaxCount
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

extend(ColumnarLayer, ChartLayer)

module.exports = ColumnarLayer
