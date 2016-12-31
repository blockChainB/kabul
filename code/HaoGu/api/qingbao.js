import Promise from './lib/es6-promise-min';

var Service = require('./service.js')

var parser = require("./parsers/qingbao-parser.js")

// 情报列表
function getInfos() {
    var promise = new Promise(function (resolve, reject) {
        Service.request({
            showLoading: true,
            showFailMsg: true,
            method: 'GET',
            data: {
                url: "http://mobiletest.emoney.cn/wx/home.json"
            },
            url: `${Service.BaseUrl}`,
            // url: `${Service.BaseUrl}/wx/home.json`,
        }).then(function (res) {
            console.log(res)
            if (res.statusCode == 200) {
                var result = parser.infomations(res.data.data)
                resolve(result);
            } else {
                resolve([]);
            }
        }, function (res) {
            reject(res);
        });
    });
    return promise;
}

module.exports = {
    getInfos: getInfos,
}