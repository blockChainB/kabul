// 解析热门版块
function parseHotBKData(data) {
    var news = data.news
    var array = []

    for (var i = 0; i < news.length; i++) {
        var item = news[i]
        var newsItem = new NewsItem(item.content_url, item.from, item.new_id, item.pt, item.sortid, item.title)
        array.push(newsItem)
    }

    var result = {}
    result.cls = data.cls
    result.stock = data.stock
    result.news = array

    return result
}

module.exports = {
    parseSearchData: parseHotBKData,
}
