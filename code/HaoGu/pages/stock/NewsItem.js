
function NewsItem(url, from, newsId, pt, sortId, title) {
	this.url = url
	this.from = from
	this.newsId = newsId
	this.time = formatTime(pt)
	this.sortId = sortId
	this.title = title

	function formatTime(pt) {
		// 2015-10-19 13:21:00.000  -->  02-13
		var time = pt

		time = time.substr(5, 5)

		return time
	}
}

module.exports = NewsItem
