
// models
function BroadcastItem(title, desp, time, tags) {
    this.title = title
    this.time = time
    this.desp = desp
    this.tags = tags
}

// parse
function broadcasts(array) {
    var results = []
    for (var i = 0; i < array.length; i++) {
        let date = new Date(Date.parse(array[i].createTime.replace(/-/g, "/")))
        var time = date.getHours() + ":" + date.getMinutes()
        var tags = i % 2 == 0 ? ["长江证券", "合众思壮"] : ["长江证券", "合众思壮", "上证指数"]

        var item = new BroadcastItem(array[i].title, array[i].summary, time, tags)

        results.push(item)
    }
    return results
}

module.exports = {
    broadcasts: broadcasts
}