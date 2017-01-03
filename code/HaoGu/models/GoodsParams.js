
module.exports = {
	CLOSE: 0,// 昨收

	// 请求字段
	GOODS_NAME: -1,                   // 股票名称
	GOODS_CODE: -2,                   // 股票代码
	ZXJ: 4,                   // 最新价（成交价）
	ZDF: -140,                   // 涨跌幅
	JL: -165,                   // 净流
	HSL: -162,                   // 换手率
	FIVEZDF: -142,                   // 5日涨跌

	CPX_DAY: -153,              // 操盘线-日线
	CPX_60M: -156,             // 操盘线-60分钟线
	GROUP_HY: -704,           // 行业板块

	// k线界面头部
	ZHANGDIE: -120,                   // 涨跌
	OPEN: 1,                   // 开盘
	HiGH: 2,                   // 最高
	LOW: 3,                   // 最低
	SYL: -161,                   // 市盈率
	ZGB: 504,                   // 总股本
	LTG: 505,                   // 流通股
	ZSZ: -601,                   // 总市值
	LTSZ: -602,                   // 流通市值
	SJL: -164,                   // 市净率
	LB: -160,                // 量比
	ZHENFU: -145,             // 振幅

	VOLUME: 500,                   // 成交量（总手）
	AMOUNT: 501,                   // 成交额（金额）
	RISE: -201,                   // 涨家（上涨）
	EQUAL: -203,                   // 平家（平盘）
	FALL: -202,                   // 跌家（下跌）

	RISE_HEAD_GOODSID: 678,          // 板块领涨股id
	RISE_HEAD_GOODSZDF: -20001,          // 板块领涨股涨跌幅
	RISE_HEAD_GOODSNAME: -20003,          // 板块领涨股名称
	FALL_HEAD_GOODSID: 680,          // 板块领跌股id
	FALL_HEAD_GOODSZDF: -20002,          // 板块领跌股涨跌幅
	FALL_HEAD_GOODSNAME: -20004,          // 板块领跌股名称
	SUSPENSION: -20005          // 停牌信息
}
