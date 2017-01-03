
var ChartLayer = require('ChartLayer.js')

function LineLayer() {
	this.values = []
	this.mMaxCount = 0
	this.mSpace = 0
	this.mHeightPerValue = 0    // 单位值对应的高度
	this.mCurrentPos = -1
	this.mStrokeWidth = 1    // 画笔宽度
	this.mStartPos = 0
	this.mFloorValue = -1000    // 允许的最小值
	this.mIsIncludeFloor = true    // 是否绘制小于floorValue的值
	this.mHasDataState = 0
	this.mIsShowShadow = false    // 是否显示阴影
	this.mShadowColor = 'rgba(70, 144, 239, 0.13)'    // 阴影颜色

	this.prepareBeforeDraw = function(rectF) {
		this.mLeft = rectF.left
		this.mTop = rectF.top
		this.mRight = rectF.right
		this.mBottom = rectF.bottom

		var totalWidth = this.getContentWidth()
		this.mSpace = totalWidth / (this.mMaxCount - 1)

		var totalHeight = this.getContentHeight()
		this.mHeightPerValue = totalHeight / (this.mMaxValue - this.mMinValue)
	}

	this.calMinAndMaxValue = function() {
		var size = this.mStartPos + this.mMaxCount > this.values.length ? this.values.length : this.mStartPos + this.mMaxCount
		
		var isFirst = true
		for (var i = this.mStartPos; i < this.values.length; i++) {
			var value = this.values[i]
			
			if (this.mIsIncludeFloor) {
				if (value < this.mFloorValue) {
					continue
				}
			} else {
				if (value <= this.mFloorValue) {
					continue
				}
			}

			if (isFirst) {
				this.mMinValue = value
				this.mMaxValue = value
				isFirst = false
			} else {
				if (this.mMinValue > value) {
					this.mMinValue = value
				}
				if (this.mMaxValue < value) {
					this.mMaxValue = value
				}
			}
		}
		

		return [this.mMinValue, this.mMaxValue]
	}

	this.doDraw = function(context) {
		this.onDrawSide(context)

		this.drawGridLine(context)
		
		var size = this.values.length

		if (this.mIsIncludeFloor) {
			context.beginPath()
			context.setStrokeStyle(this.getColor())
			context.setLineWidth(this.mStrokeWidth)

			var index = 0
			var lastX = -9999
			var lastY = -9999

			for (var i = this.mStartPos; i < size; i++) {
				var gap = 1    // ???
				if (i - this.mStartPos >= this.mMaxCount - 1) break;    // 已遍历完所有点数
				var x = this.pos2X(index)
				if (i >= 0 && i < size - 1) {
					var val1 = this.values[i]
					var val2 = 0
					while(i + gap < this.values.length) {
						val2 = this.values[i + gap]
						if (val2 != NaN) {
							break
						}
						gap++;
					}

					if (val2 != NaN) {
						i += (gap - 1)    // 正常情况下，gap等于1，也就是连接每一个pos的值
						if (val1 >= this.mFloorValue && val2 >= this.mFloorValue) {
							lastX = x + this.mSpace * gap
							lastY = this.value2Y(val2)
							context.moveTo(x, this.value2Y(val1))
							context.lineTo(lastX, lastY)
						}
					}
				}

				index += gap
			}
			context.stroke()
			context.closePath()

			// draw shadow
			if (this.mIsShowShadow) {
				context.beginPath()
				context.setFillStyle(this.mShadowColor)
				context.moveTo(this.pos2X(0), this.getContentBottom())

				var index = 0
				var lastX = -9999
				var lastY = -9999

				for (var i = this.mStartPos; i < size; i++) {
					var gap = 1    // ???
					if (i - this.mStartPos >= this.mMaxCount - 1) break;    // 已遍历完所有点数
					var x = this.pos2X(index)
					if (i >= 0 && i < size - 1) {
						var val1 = this.values[i]
						var val2 = 0
						while(i + gap < this.values.length) {
							val2 = this.values[i + gap]
							if (val2 != NaN) {
								break
							}
							gap++;
						}

						if (val2 != NaN) {
							i += (gap - 1)    // 正常情况下，gap等于1，也就是连接每一个pos的值
							if (val1 >= this.mFloorValue && val2 >= this.mFloorValue) {
								lastX = x + this.mSpace * gap
								lastY = this.value2Y(val2)
								context.lineTo(x, this.value2Y(val1))
							}
						}
					}

					index += gap
				}

				if (lastX != -9999 && lastY != -9999) {
                    context.lineTo(lastX, lastY);
                    context.lineTo(lastX, this.getContentBottom());
                }

				context.fill()
				context.closePath()
			}
		} else {
			context.beginPath()
			context.setStrokeStyle(this.getColor())
			context.setLineWidth(this.mStrokeWidth)

			var index = 0
			var lastX = -9999
			var lastY = -9999

			for (var i = this.mStartPos; i < size; i++) {
				var gap = 1    // ???
				if (i - this.mStartPos >= this.mMaxCount - 1) break;    // 已遍历完所有点数
				var x = this.pos2X(index)
				if (i >= 0 && i < size - 1) {
					var val1 = this.values[i]
					var val2 = 0
					while(i + gap < this.values.length) {
						val2 = this.values[i + gap]
						if (val2 != NaN) {
							break
						}
						gap++;
					}

					if (val2 != NaN) {
						i += (gap - 1)    // 正常情况下，gap等于1，也就是连接每一个pos的值
						if (val1 > this.mFloorValue && val2 > this.mFloorValue) {
							lastX = x + this.mSpace * gap
							lastY = this.value2Y(val2)
							context.moveTo(x, this.value2Y(val1))
							context.lineTo(lastX, lastY)
						}
					}
				}

				index += gap
			}
			context.stroke()
			context.closePath()

			// draw shadow
			if (this.mIsShowShadow) {
				context.beginPath()
				context.setFillStyle(this.mShadowColor)
				context.moveTo(this.pos2X(0), this.getContentBottom())

				var index = 0
				var lastX = -9999
				var lastY = -9999

				for (var i = this.mStartPos; i < size; i++) {
					var gap = 1    // ???
					if (i - this.mStartPos >= this.mMaxCount - 1) break;    // 已遍历完所有点数
					var x = this.pos2X(index)
					if (i >= 0 && i < size - 1) {
						var val1 = this.values[i]
						var val2 = 0
						while(i + gap < this.values.length) {
							val2 = this.values[i + gap]
							if (val2 != NaN) {
								break
							}
							gap++;
						}

						if (val2 != NaN) {
							i += (gap - 1)    // 正常情况下，gap等于1，也就是连接每一个pos的值
							if (val1 > this.mFloorValue && val2 > this.mFloorValue) {
								lastX = x + this.mSpace * gap
								lastY = this.value2Y(val2)
								context.lineTo(x, this.value2Y(val1))
							}
						}
					}

					index += gap
				}

				if (lastX != -9999 && lastY != -9999) {
                    context.lineTo(lastX, lastY);
                    context.lineTo(lastX, this.getContentBottom());
                }

				context.fill()
				context.closePath()
			}
		}
	}

	this.pos2X = function(pos) {
		return this.mLeft + this.mPaddingLeft + this.mSpace * pos
	}

	this.x2Pos = function(x) {
		return (x - this.mLeft - this.mPaddingLeft) / this.mSpace
	}

	this.value2Y = function(value) {
		return this.getContentBottom() - this.mHeightPerValue * (value - this.mMinValue)
	}

	this.setShowShadow = function(isShow) {
		this.mIsShowShadow = isShow
	}

	this.setShadowColor = function(color) {
		this.mShadowColor = color
	}

	this.setStrokeWidth = function(width) {
		this.mStrokeWidth = width
	}

	this.setFloorValue = function(value, isInclude) {
		this.mFloorValue = value
		this.mIsIncludeFloor = isInclude
	}

	this.rePrepareWhenDrawing = function(rectF) {
		var totalWidth = this.getContentWidth()
		this.mSpace = totalWidth / (this.mMaxCount - 1)

		var totalHeight = this.getContentHeight()
		this.mHeightPerValue = totalHeight / (this.mMaxValue - this.mMinValue)
	}

	this.setValue = function(index, value) {
		if (index >= 0 && index <= this.values.length - 1) {
			this.values[index] = value
		} else if (index == this.values.length) {
			this.addValue(value)
		}
	}

	this.addValue = function(value) {
		this.values.push(value)
	}

	this.getValue = function(pos) {
		return this.values[pos]
	}

	this.getValues = function(pos) {
		return this.values
	}

	this.getValueCount = function() {
		return this.values.length
	}

	this.getLastValue = function() {
		if (this.getValueCount() > 0) {
            return this.getValue(this.getValueCount() - 1);
        }

        return 0;
	}

	this.moveStartPos = function(offset) {
		var newPos = this.mStartPos + offset
		this.setStartPos(newPos)
	}

	this.getStartPos = function() {
		return this.mStartPos
	}

	this.setStartPos = function(pos) {
		if (this.getValueCount() <= 0) {
			this.mStartPos = 0
			return
		}

		if (pos < 0) {
			this.mStartPos = 0
		} else if (pos > this.getValueCount() - this.mMaxCount) {
			this.mStartPos = this.getValueCount() - this.mMaxCount
		} else {
			this.mStartPos = pos
		}
	}

	/**
	* 设置显示的最大根数
	* @param count 显示的最大根数
	* @param direction 0: 从第1根显示  1：从倒数第count根显示
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
                    if (count < this.mMaxCount)/* 放大 */ {
                        this.mStartPos += (this.mMaxCount - count);
                        if (this.mStartPos > this.getValueCount() - count) {
                            this.mStartPos = this.getValueCount() - count;
                        }
                    } else if (count > this.mMaxCount)/* 缩小 */ {
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

	this.resetData = function() {
		this.clear()
		this.mCurrentPos = -1
		this.mMaxCount = 0
		this.mHasDataState = 0
		this.mStartPos = 0
	}

	this.clear = function() {
		this.values = []
		this.mMinValue = 0
		this.mMaxValue = 0
	}

	this.setMinValue = function(value) {
		this.mMinValue = value
	}

	this.setMaxValue = function(value) {
		this.mMaxValue = value
	}

	this.minuteTimeToPos = function(time) {
	    var ret = 0

	    var h = time / 100
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

}

function extend(Child, Parent) {
	var F = function(){}
	var parent = new Parent()
	F.prototype = parent
	Child.prototype = new F()
	Child.prototype.constructor = Child
	Child.uber = parent
}

extend(LineLayer, ChartLayer)

module.exports = LineLayer
