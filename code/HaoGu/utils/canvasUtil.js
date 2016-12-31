
function getLengthPerRpx(){
	return getScreenWidthPx() / 750;
}


function getLengthByRpx(screenWidth, rpxLength) {
	return (getLengthPerRpx(screenWidth) * rpxLength)
}

function getScreenWidthPx() {
	if (getApp().screenWidth != 0) {
		return getApp().screenWidth;
	}
	wx.getSystemInfo({
		success: function (res) {
			getApp().screenWidth = res.windowWidth;
		}
	})
}

module.exports.getLengthPerRpx = getLengthPerRpx
module.exports.getLengthByRpx = getLengthByRpx
module.exports.getScreenWidthPx = getScreenWidthPx
