
var Util = require('../../utils/util.js')

// models
function InfoItem(title, image, grade, time, id) {
    this.title = title
    this.image = image
    this.grade = grade
    this.time = time
    this.id = id
}

// parse
function infomations(array) {
    var results = []
    for (var i = 0; i < array.length; i++) {
        let date = new Date(Date.parse(array[i].date.replace(/-/g, "/")))
        var time = Util.formateTime(date, "HH:mm:ss")

        var item = new InfoItem(array[i].title, "", array[i].type, time, array[i].id)

        results.push(item)
    }
    return results
}

module.exports = {
    infomations: infomations
}

