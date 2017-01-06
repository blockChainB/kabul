
function init(placeholder, that, callback) {
    console.log("===init==before", that.data)
    var tempData = Object.assign({
        searchData: {
            searchContent: '',
            placeholder: placeholder,
            showClearButton: false,
        }
    }, that.data)
    that.setData(tempData)
    console.log("===init==after", tempData, that.data)

    if (typeof (callback) == 'function') {
        callback()
    }
}

function onSearchBarClearEvent(e, that, callback) {

    console.log("===onSearchBarClearEvent==", that.data)

    that.data.searchData.showClearButton = false
    that.data.searchData.searchContent = ""

    that.setData(that.data)

    if (typeof (callback) == 'function') {
        callback()
    }
}

function onSearchBarChangedEvent(e, that, callback) {

    console.log("===onSearchBarChangedEvent==", that.data)

    that.data.searchData.showClearButton = e.detail.value.length > 0
    that.data.searchData.searchContent = e.detail.value

    that.setData(that.data)

    if (typeof (callback) == 'function') {
        callback()
    }
}

module.exports = {
    init: init,
    onSearchBarClearEvent: onSearchBarClearEvent,
    onSearchBarChangedEvent: onSearchBarChangedEvent
}