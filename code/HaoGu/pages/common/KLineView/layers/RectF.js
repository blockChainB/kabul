
function RectF(left, top, right, bottom) {
	this.left = left
	this.top = top
	this.right = right
	this.bottom = bottom

	this.getLeft = function() {
		return this.left
	}

	this.getTop = function() {
		return this.top
	}
	
	this.getRight = function() {
		return this.right
	}

	this.getBottom = function() {
		return this.bottom
	}

	this.toString = function() {
		return '[left: ' + this.left + ', top: ' + this.top + ', right: ' + this.right + ', bottom: ' + this.bottom + ']';
	}

}

module.exports = RectF
