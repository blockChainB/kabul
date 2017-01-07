var Service = require('./service.js')
var Promise = Service.Promise
var StaticStrings = Service.StaticStrings
var parser = require('./parsers/stock-parser.js')
var Util = require('../utils/util.js')
var GoodsParams = require('../models/GoodsParams.js')
var optionalUtil = require('../utils/optionalUtil.js')

var mainStockIndex = [1, 1399001, 300, 1399005, 1399006, 1399106, 2, 3, 1399003, 9, 10, 16, 1399004]

// 搜索股票
function search({key = ""} = {}) {

    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'GET',
        data: {
            key: key,
        },
        url: `${Service.BaseUrl}web/stock/search`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            if (res.data.result.code == 0) {
                var results = parser.parseSearchData(res.data.detail)
                return results
            } else {
                return Promise.reject(StaticStrings.kGetDataErrorInfo)
            }
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });

    return promise;
}

/**
 * id:股票ID
 * last_update_market_date:上次更新日期
 * last_recv_time:时间
 * request_mmp:是否请求买卖盘(5档行情)
 */
function getMinutes({id, date, time, mmp = false} = {}) {
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            goods_id: id,
            last_update_market_date: date,
            last_recv_time: time,
            request_mmp: mmp
        },
        url: `${Service.BaseQuotaUrl}20300`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('get minute result data ', res.data)
            var result = parser.parseMinutesData(res.data)
            return result
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

/** 
 * id:股票ID
 * begin:请求起始位置(日期YYYYMMDD或时间YYMMDDXX, XX表示5分钟序号，从9:30为第一个点)
 * size:请求根数 ， > 0 从右往左，< 0从左往右
 * period:周期 <=60  为分钟线，如60分钟线即为60 , 30分钟线即为30 ；日K线100、周K线101、月K线102
 * time:上次更新时间，初始填0
 * ma:1：5日，2：10日，4：20日，7：5、10、20日都包含
 */
function getKLines({id, begin, size, period, time = 0, ma = 7} = {}) {
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            goods_id: id,
            req_begin: begin,
            req_size: size,
            req_period: period,
            last_update_market_time: time,
            req_ma: ma
        },
        url: `${Service.BaseQuotaUrl}20400`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('get kline result data ' , res.data)
            var results = parser.parseKLinesData(res.data.k_lines)
            return results
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

// 十日净流数据
function requestFundData({goods_id} = {}) {
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            goods_id: goods_id
        },
        url: `${Service.BaseQuotaUrl}20700`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            return res.data
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

// 获取自选股
function requestOptionals() {
    console.log("sky uid:", getApp().globalData.uid);
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            uid: getApp().globalData.uid
        },
        url: `${Service.BaseOptionalUrl}28100`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            if (res.data.result.code == 0) {
                return res.data.detail;
            } else {
                return Promise.reject(StaticStrings.kGetDataErrorInfo)
            }
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

// 更新自选股
function commitOptionals({goodsId} = {}) {
    if (goodsId <= 0) {
        return Promise.reject("goodid invaliate");
    }

    var tOptionals = optionalUtil.tempOptionals(goodsId);
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            uid: getApp().globalData.uid,
            GoodsId: tOptionals
        },
        url: `${Service.BaseOptionalUrl}28000`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            console.log('commitOptionals get raw result', res)
            optionalUtil.updateOptional(goodsId)
            return res.data.result.code
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise
}

/** 
 * id 股票Id，字符串
 * cls 新闻类型，字符串  (0/1/2)
*/
function getNews({id, cls} = {}) {
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            stock: id + '',
            cls: cls + ''
        },
        url: `${Service.BaseInfoUrl}6301`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('stock news raw: ', res.data)

            var result = parser.parseNewsData(res.data)
            return result
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

/**
 * 获取个股行情
 */
function getQuotation({id} = {}) {
    var reqFileds = []
    reqFileds.push(GoodsParams.ZXJ); // 最新价
    reqFileds.push(GoodsParams.ZDF); // 涨跌幅
    reqFileds.push(GoodsParams.ZHANGDIE); // 涨跌

    reqFileds.push(GoodsParams.OPEN); // 开盘价
    reqFileds.push(GoodsParams.HiGH); // 最高价
    reqFileds.push(GoodsParams.LOW); // 最低价

    reqFileds.push(GoodsParams.HSL); // 换手率
    reqFileds.push(GoodsParams.SYL); // 市盈率
    reqFileds.push(GoodsParams.SJL); // 市净率

    reqFileds.push(GoodsParams.VOLUME); // 成交量
    reqFileds.push(GoodsParams.JL); // 净流
    reqFileds.push(GoodsParams.ZSZ); // 总市值

    reqFileds.push(GoodsParams.AMOUNT); // 成交额
    reqFileds.push(GoodsParams.LB); // 量比
    reqFileds.push(GoodsParams.LTSZ); // 流通市值

    reqFileds.push(GoodsParams.SUSPENSION); // 停牌信息

    var reqIds = []
    reqIds.push(id)

    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            class_type: 4,
            group_type: 0,
            goods_id: reqIds,
            req_fields: reqFileds,
            sort_field: -9999,
            sort_order: true,
            req_begin: 0,
            req_size: 0,
            last_update_market_time: 0,
            last_update_market_date: 0
        },
        url: `${Service.BaseQuotaUrl}20200`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('stock quotation raw : ',res.data)
            var result = parser.parseStockQuotationValue(res.data)
            return result
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

/**
 * 获取版块行情
 */
function getBkQuotation({id} = {}) {
    var reqFileds = []
    reqFileds.push(GoodsParams.ZXJ); // 最新价
    reqFileds.push(GoodsParams.ZDF); // 涨跌幅
    reqFileds.push(GoodsParams.ZHANGDIE); // 涨跌

    reqFileds.push(GoodsParams.OPEN); // 开盘价
    reqFileds.push(GoodsParams.HiGH); // 最高价
    reqFileds.push(GoodsParams.LOW); // 最低价

    reqFileds.push(GoodsParams.HSL); // 换手率
    reqFileds.push(GoodsParams.RISE); // 涨数
    reqFileds.push(GoodsParams.FALL); // 跌数

    reqFileds.push(GoodsParams.VOLUME); // 成交量
    reqFileds.push(GoodsParams.JL); // 净流
    reqFileds.push(GoodsParams.EQUAL); // 平均

    reqFileds.push(GoodsParams.AMOUNT); // 成交额
    reqFileds.push(GoodsParams.LB); // 量比
    reqFileds.push(GoodsParams.ZHENFU); // 振幅

    reqFileds.push(GoodsParams.SUSPENSION); // 停牌信息

    var reqIds = []
    reqIds.push(id)

    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            class_type: 4,
            group_type: 0,
            goods_id: reqIds,
            req_fields: reqFileds,
            sort_field: -9999,
            sort_order: true,
            req_begin: 0,
            req_size: 0,
            last_update_market_time: 0,
            last_update_market_date: 0
        },
        url: `${Service.BaseQuotaUrl}20200`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('bk quotation raw : ',res.data)
            var result = parser.parseBkQuotationValue(res.data)
            return result
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

/**
 * 获取关联个股、版块
 */
function getRelatives({id, classType = 0, order = false} = {}) {
    var reqFileds = []
    reqFileds.push(GoodsParams.GOODS_NAME);   // 股票名称
    reqFileds.push(GoodsParams.ZXJ);          // 最新价
    reqFileds.push(GoodsParams.ZDF);          // 涨跌幅
    reqFileds.push(GoodsParams.ZHANGDIE);     // 涨跌

    var reqIds = []
    reqIds.push(id)

    var reqData = {
        sort_field: GoodsParams.ZDF,
        sort_order: order,
        req_begin: 0,
        req_size: 20,
        last_update_market_time: 0,
        last_update_market_date: 0,
        req_fields: reqFileds
    }

    if (classType == 3) {
        reqData.class_type = 4
        reqData.group_type = 0
        reqData.goods_id = mainStockIndex
    } else {
        reqData.class_type = classType
        reqData.group_type = id
    }

    var req = {
        showLoading: false,
        showFailMsg: false,
        data: reqData,
        url: `${Service.BaseQuotaUrl}20200`,
    }
    // console.log('getRelative req', req, id, classType, order)

    var promise = Service.request(req).then(function (res) {
        if (res.statusCode == 200) {
            console.log('stock relatives raw : ', res.data)
            var result = parser.parseRelativeItem(res.data)
            return result
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (res) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}

function getCustomDetail(aryGoodsId = []) {
    if (!aryGoodsId) {
        return
    }
    var reqFileds = []
    reqFileds.push(GoodsParams.GOODS_NAME);   // 股票名称
    reqFileds.push(GoodsParams.ZXJ);          // 最新价
    reqFileds.push(GoodsParams.ZDF);          // 涨跌幅
    reqFileds.push(GoodsParams.ZHANGDIE);          // 涨跌
    reqFileds.push(GoodsParams.SUSPENSION);          // 停牌


    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            class_type: 4,
            group_type: 0,
            goods_id: aryGoodsId,
            req_fields: reqFileds,
            sort_field: -9999,
            sort_order: true,
            req_begin: 0,
            req_size: aryGoodsId.length,
            last_update_market_time: 0,
            last_update_market_date: 0
        },
        url: `${Service.BaseQuotaUrl}20200`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            var result = parser.parseCustomDetail(res.data)
            return result
        } else {
            return Promise.reject(StaticStrings.kGetDataErrorInfo)
        }
    }, function (err) {
        return Promise.reject(StaticStrings.kGetDataErrorInfo)
    });
    return promise;
}


module.exports = {
    search: search,
    getKLines: getKLines,
    getMinutes: getMinutes,
    getNews: getNews,
    requestFundData: requestFundData,
    getQuotation: getQuotation,
    getBkQuotation: getBkQuotation,
    requestOptionals: requestOptionals,
    commitOptionals: commitOptionals,
    getRelatives: getRelatives,
    getCustomDetail: getCustomDetail
}
