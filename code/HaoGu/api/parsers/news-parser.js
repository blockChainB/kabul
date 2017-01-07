
function parseDetailData(data) {
    var content = data.content

    if (data.type == "个股公告") {
        content = content.replace(/&ldquo;/g, "\"")
        content = content.replace(/&rdquo;/g, "\"")
        content = content.replace(/&nbsp;/g, "")
        content = content.replace(/<\/p>[\n]{2,}<p>/g, "</p>\n<p>")
        content = content.replace(/<p>/g, "")
        content = content.replace(/<\/p>/g, "")
        content = content.replace(/<br \/>/g, "")
        content = content.replace(/<script.*<\/script>/g, "")
        content = content.replace(/<img.*\/>/g, "")
        content = content.replace(/<a.*\/a>/g, "")
    } else {
        content = content.replace(/&ldquo;/g, "\"")
        content = content.replace(/&rdquo;/g, "\"")
        content = content.replace(/&nbsp;/g, " ")
        content = content.replace(/<\/p><p>/g, "</p>\n\n<p>")
        content = content.replace(/<p>/g, "")
        content = content.replace(/<\/p>/g, "")
        content = content.replace(/<br \/>/g, "")
        content = content.replace(/<script.*<\/script>/g, "")
        content = content.replace(/<img.*\/>/g, "")
        content = content.replace(/<a.*\/a>/g, "")
    }

    return {
        title: data.title,
        content: content
    }
}

module.exports = {
    parseDetailData: parseDetailData
}