import Promise from './lib/es6-promise-min';

var Service = require('./service.js')

var parser = require("./parsers/market-parser.js")

// 获取直播数据
function getBroadcasts() {
    var promise = new Promise(function (resolve, reject) {
        Service.request({
            showLoading: false,
            showFailMsg: false,
            method: 'GET',
            data: {
                url: "http://mnews.emoney.cn/info/information/broadcast"
            },
            url: `${Service.TranferUrl}`,
        }).then(function (res) {
            if (res.statusCode == 200) {
                let results = parser.broadcasts(res.data.data)
                resolve(results);
            } else {
                resolve([]);
            }
        }, function (res) {
            reject(res);
        });
    });
    return promise;
}

function getHotIdeas() {
    
}

module.exports = {
    getBroadcasts: getBroadcasts,
}