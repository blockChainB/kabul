
var ChartLayer = require('ChartLayer.js')

function GroupLayer() {

	var mLeftLayer = null
	var mCenterLayer = null
	var mRightLayer = null

	this.prepareBeforeDraw = function(rectF) {
		this.mLeft = rectF.left
		this.mTop = rectF.top
		this.mRight = rectF.right
		this.mBottom = rectF.bottom

		if (mLeftLayer != null)
			mLeftLayer.prepareBeforeDraw(rectF)
		if (mCenterLayer != null)
			mCenterLayer.prepareBeforeDraw(rectF)
		if (mRightLayer != null)
			mRightLayer.prepareBeforeDraw(rectF)
	}

	this.layout = function(left, top, right, bottom) {
		this.mLeft = left
		this.mTop = top
		this.mRight = right
		this.mBottom = bottom

		if (mLeftLayer != null)
			mLeftLayer.layout(this.getContentLeft(), this.getContentTop(), this.getContentLeft() + mLeftLayer.getWidth(), this.getContentBottom());
        if (mCenterLayer != null)
        	mCenterLayer.layout(this.getContentLeft(), this.getContentTop(), this.getContentRight(), this.getContentBottom());
        if (mRightLayer != null)
        	mRightLayer.layout(this.getContentRight() - mCenterLayer.getWidth(), this.getContentTop(), this.getContentRight(), this.getContentBottom());
	}

	this.rePrepareWhenDrawing = function() {
		if (mLeftLayer != null)
			mLeftLayer.rePrepareWhenDrawing()
		if (mCenterLayer != null)
			mCenterLayer.rePrepareWhenDrawing()
		if (mRightLayer != null)
			mRightLayer.rePrepareWhenDrawing()
	}

	this.doDraw = function(context) {
		this.onDrawSide(context)

		this.drawGridLine(context)

		if (mCenterLayer != null && mCenterLayer.isShow()) {
			mCenterLayer.doDraw(context)
		}

		if (mLeftLayer != null && mLeftLayer.isShow()) {
			mLeftLayer.doDraw(context)
		}

		if (mRightLayer != null && mRightLayer.isShow()) {
			mRightLayer.doDraw(context)
		}
	}

	this.setLeftLayer = function(layer) {
		mLeftLayer = layer;
	}

	this.setRightLayer = function(layer) {
		mRightLayer = layer
	}

	this.setCenterLayer = function(layer) {
		mCenterLayer = layer
	}

	this.isShow = function() {
		var result = false

		if (mLeftLayer != null) {
			result = result || mLeftLayer.isShow()
		}
		if (mCenterLayer != null) {
			result = result || mCenterLayer.isShow()
		}
		if (mRightLayer != null) {
			result = result || mRightLayer.isShow()
		}

		return result
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

extend(GroupLayer, ChartLayer)

module.exports = GroupLayer
