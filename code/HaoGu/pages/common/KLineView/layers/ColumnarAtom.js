
function ColumnarAtom(open, high, low, close) {
	this.mOpen = open
	this.mHigh = high
	this.mLow = low
	this.mClose = close
	this.toString = function() {
		return '[open: ' + open + ', high: ' + high + ', low: ' + low + ', close: ' + close + ']'
	}
}

module.exports = ColumnarAtom
