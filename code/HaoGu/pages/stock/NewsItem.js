
var newsUtil = require('../../utils/newsUtil.js')

function NewsItem(url, from, newsId, pt, sortId, title) {
	this.url = url
	this.from = from
	this.newsId = newsId
	this.time = formatTime(pt)
	this.sortId = sortId
	this.title = title
	this.isRead = false    // 是否已阅读

	if (newsUtil.isNewsRead(newsId)) {
		this.titleColor = "#888888"
	} else {
		this.titleColor = "#353535"
	}

	function formatTime(pt) {
		// 2015-10-19 13:21:00.000  -->  02-13
		var time = pt

		time = time.substr(5, 5)

		return time
	}
}

NewsItem.prototype.setReadStatus = function (isRead) {
	if (isRead) {
		this.titleColor = "#888888"
	} else {
		this.titleColor = "#353535"
	}
}

module.exports = NewsItem
