
function getLengthPerRpx(){
	return getApp().globalData.screenWidth / 750;
}


function getLengthByRpx(rpxLength) {
	return (getLengthPerRpx() * rpxLength)
}

function getScreenWidthPx() {
	if (getApp().globalData.screenWidth != 0) {
		return getApp().globalData.screenWidth;
	}
	wx.getSystemInfo({
		success: function (res) {
			getApp().globalData.screenWidth = res.windowWidth;
		}
	})
}

module.exports.getLengthByRpx = getLengthByRpx
module.exports.getScreenWidthPx = getScreenWidthPx
