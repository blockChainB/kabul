var Service = require('./service.js')

var parser = require('./parsers/stock-parser.js')
var Util = require('../utils/util.js')

// 搜索股票
function search({key = ""} = {}) {

    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        method: 'GET',
        data: {
            key: key,
        },
        url: 'http://m.emoney.cn/getinfo/search.aspx',
    }).then(function (res) {
        if (res.statusCode == 200) {
            var results = parser.parseSearchData(res.data.data)
            return results
        } else {
            return []
        }
    }, function (res) {
        return res
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
        url: `${Service.BaseUrl}20300`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('get minute result data ' , res.data)
            var result = parser.parseMinutesData(res.data)
            return result
        } else {
            return []
        }
    }, function (res) {
        return res
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
        url: `${Service.BaseUrl}20400`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('get kline result data ' , res.data)
            var results = parser.parseKLinesData(res.data.k_lines)
            return results
        } else {
            return []
        }
    }, function (res) {
        return res
    });
    return promise;
}

/**
 * class_type:0 概念,1 行业,2地区,3 系统板块类（沪深A等）,4 自定义上传股票ID
 * group_type:class_type==4, 为0; 
 *            0 =< class_type <= 2,板块代码，如不发或者为0，class类别下的所有板块；
 *            class_type==3时候，该字段为 如//@@@@@@@@@@@定义 的 值按位或的结果
 * goods_id：当class_type 为 4 时 ,为上传的股票ID列表
 * req_fields：字段列表 定义如//$$$$$$$$$$$$$$$$$$：
 * sort_field：排序字段 -9999为无排序字段，按上传股票ID顺序，无上传ID则按名字顺序
 * sort_order：升序或降序，true为降序，false为升序
 * req_begin：请求起始位置，初始填0（排序后）
 * req_size：请求个数，按客户端显示分页大小
 * last_update_market_time：上次更新时间，初始填0
 * last_update_market_date：上次更新日期，初始填0
 */
function requestDynaValueData({clazz, group = 0, codes, req_fields, sort_field = -9999, sort_order = true, begin = 0, size, date = 0, time = 0} = {}) {
    var promise = Service.request({
        showLoading: false,
        showFailMsg: false,
        data: {
            class_type: clazz,
            group_type: group,
            goods_id: codes,
            req_fields: req_fields,
            sort_field: sort_field,
            sort_order: sort_order,
            req_begin: 0,
            req_size: size,
            last_update_market_time: time,
            sort_orlast_update_market_dateder: date
        },
        url: `${Service.BaseUrl}20200`,
    }).then(function (res) {
        if (res.statusCode == 200) {
            return res.data
        } else {
            return []
        }
    }, function (res) {
        return res
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
        url: `${Service.BaseUrl}20700`,
    }).then(function (res) {
        console.log("=====res:", res)
        if (res.statusCode == 200) {
            return res.data
        } else {
            return {}
        }
    }, function (res) {
        return res
    });
    return promise;
}

// 动态行情req_fields的可能值
let DynamicValueRequireField = {
    None: -9999,	  //不排序
    CLOSE: 0,		  //昨收
    OPEN: 1,		  //开盘
    HIGH: 2,		  //最高
    LOW: 3,		      //最低
    PRICE: 4,		  //成交
    NAME: -1,		  //名称
    CODE: -2,	      //股票代码
    ZDF: -140,        //涨跌幅
    SYL: -161,        //市盈率 **
    BIGAMT: -165,     //主力净流 **
    ZDF5: -142,       //5日涨跌
    CPXDAY: -153,	  //操盘线-日线
    CPXMIN60: -156,	  //操盘线-60分钟线
    ZHANGDIE: -120,	  //涨跌
    HSL: -162,        //换手率
    RISE: -201,	      //涨家
    FALL: -202,	      //跌家
    EQUAL: -203,	  //平家
    GROUPHY: -704,	  //行业板块
    ZGB: 504,		  //总股本
    LTG: 505,		  //流通股
    SJL: -164,	      //市净率 **
    ZSZ: -601,        // 总市值 **
    VOLUME: 500,	  //成交量
    AMOUNT: 501,	  //成交额
    RiseHeadGoodsID: 678,	   // 当日强势股
    FallHeadGoodsID: 680,	   // 当日弱势股
    RiseHeadGoodsZDF: -20001,  // 板块领涨股涨跌幅
    FallHeadGoodsZDF: -20002,  // 板块领跌股涨跌幅
    RiseHeadGoodsName: -20003, // 板块领涨股名称
    FallHeadGoodsName: -20004, // 板块领跌股名称
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
            stock: id,
            cls: cls
        },
        url: `${Service.BaseUrl}6300`
    }).then(function (res) {
        if (res.statusCode == 200) {
            // console.log('stock news: ',res.data)
            var result = parser.parseNewsData(res.data)
            return result
        } else {
            return []
        }
    }, function (res) {
        return res
    });
    return promise;
}

module.exports = {
    search: search,
    getKLines: getKLines,
    getMinutes: getMinutes,
    requestDynaValueData: requestDynaValueData,
    DynamicValueRequireField: DynamicValueRequireField,
    getNews: getNews,
    requestFundData: requestFundData
}

