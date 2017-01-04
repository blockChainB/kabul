var Service = require('./service.js')
var parser = require('./parsers/kanpan-parser.js')

//热门板块
function getHotBK({key = ""} = {}) {
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'GET',
        data: {
            key: key,
        },
        url: `${Service.BaseUrl}27200`,
    }).then(function (res) {
        console.log("***********xie,",res)
        if (res.statusCode == 200) {
            var results =parser.parseHotBKData(res.data.detail);
               console.log("***********xie results,",results)
            return results
        } else {
            return []
        }
    }, function (res) {
        return res
    });

    return promise;
}


module.exports = {
    getHotBK: getHotBK,
}
