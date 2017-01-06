
var SearchItem = require('../../models/SearchItem.js')

function getDefaultData() {
    var results = []

    results.push(new SearchItem("上证指数", 1))
    results.push(new SearchItem("深证成指", 1399001))
    results.push(new SearchItem("中小板指", 1399005))
    results.push(new SearchItem("创业板指", 1399006))

    return results
}

module.exports = {
    getDefaultData: getDefaultData
}