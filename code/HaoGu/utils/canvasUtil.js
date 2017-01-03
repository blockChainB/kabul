
function getLengthByRpx(rpxLength) {
	var perWidth = getApp().globalData.screenWidth / 750
	return perWidth * rpxLength
}

module.exports.getLengthByRpx = getLengthByRpx
