
function parseDetailData(data) {
    var content = data.content
    content = content.replace(/&nbsp;/g, " ")
    content = content.replace(/<p>/g, "")
    content = content.replace(/<\/p>/g, "\n\n")
    content = content.replace(/<script.*<\/script>/g, "")

    return {
        title: data.title,
        content: content
    }
}

module.exports = {
    parseDetailData: parseDetailData
}