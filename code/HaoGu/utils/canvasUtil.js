
/**
* 获取每rpx对应的屏幕像素单位长度
*/
function getLengthPerRpx(screenWidth) {
	return (screenWidth / 750)
}

/**
* 获取画布屏幕宽度
* @param screenWidth 屏幕宽度 px
* @param canvasWidth 画布宽度 rpx
*
* @return 画布屏幕宽度 px 取两位小数
*/
function getCanvasWidth(screenWidth, canvasWidth) {
	return (getLengthPerRpx(screenWidth) * canvasWidth)
}

/**
* 获取画布屏幕高度
* @param screenWidth 屏幕宽度 px
* @param canvasHeight 画布高度 rpx
*
* @return 画布屏幕高度 px 取两位小数
*/
function getCanvasHeight(screenWidth, canvasHeight) {
	return (getLengthPerRpx(screenWidth) * canvasHeight)
}

/**
 * 获取输入rpx长度对应的屏幕宽度
 * @param screenWidth，屏幕像素总宽度，以此可获取单位rpx对应的长度
 * @param rpxLength, rpx单位长度
 */
function getLengthByRpx(screenWidth, rpxLength) {
	return (getLengthPerRpx(screenWidth) * rpxLength)
}

module.exports.getCanvasWidth = getCanvasWidth
module.exports.getCanvasHeight = getCanvasHeight
module.exports.getLengthPerRpx = getLengthPerRpx
module.exports.getLengthByRpx = getLengthByRpx
