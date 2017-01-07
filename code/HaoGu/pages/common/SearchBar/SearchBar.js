
function init(placeholder, that, callback) {
    var tempData = Object.assign({
        searchData: {
            searchContent: '',
            placeholder: placeholder,
            showClearButton: false,
        }
    }, that.data)
    that.setData(tempData)
    if (typeof (callback) == 'function') {
        callback()
    }
}

function onSearchBarClearEvent(e, that, callback) {
    that.data.searchData.showClearButton = false
    that.data.searchData.searchContent = ""

    that.setData(that.data)

    if (typeof (callback) == 'function') {
        callback()
    }
}

function onSearchBarChangedEvent(e, that, callback) {
    that.data.searchData.showClearButton = e.detail.value.length > 0

    that.setData(that.data)
    that.data.searchData.searchContent = e.detail.value

    if (typeof (callback) == 'function') {
        callback()
    }
}

module.exports = {
    init: init,
    onSearchBarClearEvent: onSearchBarClearEvent,
    onSearchBarChangedEvent: onSearchBarChangedEvent
}