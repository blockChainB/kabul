var canvasUtil = require('../../../utils/canvasUtil.js');
var stockreq = require('../../../api/stock.js');


var mValue_per_ypx = 0;
var mPer_item_w = 0;

//饼图
var mBuyLarge = 0;
var mSaleLarge = 0;
var mBuySmall = 0;
var mSaleSmall = 0;

//十日资金图
var tenDayInFlow = "[]";


const UNITS = 10000.0;
//请求标志
var mRequestSuccess = false;

var fundData = {
    dayinflow: '--',
    dayinflowUnit: '元',
    bLarge_proportion: '--',
    bSmall_proportion: '--',
    sLarge_proportion: '--',
    sSmall_proportion: '--',
    firstDate: "--",
    lastDate: "--"
};

function init(that) {
    updateDatabinding(that);
}

/**
 * dayinflow 净流 格式化后的值
 * unit 单位 万元/亿元 等
 */
function setJLValue(that) {
    var value = that.data.quotation.jl
    var dayinflow = '--'
    var unit = '--'
    if (value != null && value.length > 1) {
        var end = value.substr(value.length - 1, 1)
        if (end == '万' || end == '亿') {
            dayinflow = value.substr(0, value.length - 1)
            unit = end + '元'
        } else {
            dayinflow = value
            unit = '元'
        }
    }
    if (dayinflow && unit) {
        fundData.dayinflow = dayinflow;
        fundData.dayinflowUnit = unit;
        updateDatabinding(that);
    }
}

function show(that) {
    console.log('FundView show', mRequestSuccess)
    if (!mRequestSuccess) {
        // 如果数据已请求完成，不再请求
        if (that.getIsInfoLoad()) return

        requestFundData(that)
            .then(
            function (res) {
                if (res == 0) {
                    drawOneDayPie(that);
                    drawTenDayTrend(that);

                    updateDatabinding(that);
                    // 记录资金已请求完成，以后不再请求
                    that.setIsInfoLoad('1')
                }

            },
            function (fail) {

            }
            );
    }
    else {
        drawOneDayPie(that);
        drawTenDayTrend(that);
    }
}

function updateDatabinding(that) {
    that.setData({
        fundViewData: fundData
    });
}

function requestFundData(that) {
    var goodsId = that.data.goodsId
    console.log('fund reqest id ', goodsId)

    return stockreq.requestFundData({
        goods_id: goodsId
    })
        .then(
        function (res) {
            console.log(JSON.stringify(res));
            praseFundResponse(res);
            mRequestSuccess = true;
            return 0;
        },
        function (err) {
            mRequestSuccess = false;
            return -1;
        }
        )

};

function praseFundResponse(res) {
    console.log("sky funview praseFundResponse:", res);
    /**
     * {
    "currentday_inflow": "{\"Date\":20161230,\"bHuge\":1286844,\"sHuge\":0,\"bLarge\":15733365,\"sLarge\":13739223,\"bMiddle\":19535744,\"sMiddle\":16295416,\"bLittle\":12165874,\"sLittle\":18687188}",
    "day_net_inflow": [
        {
            "date": 20161219,
            "net_inflow": 9130835
        },
        {
            "date": 20161220,
            "net_inflow": 13326
        },
        {
            "date": 20161221,
            "net_inflow": -1876618
        },
        {
            "date": 20161222,
            "net_inflow": -143355
        },
        {
            "date": 20161223,
            "net_inflow": -1449148
        },
        {
            "date": 20161226,
            "net_inflow": -5615002
        },
        {
            "date": 20161227,
            "net_inflow": 396329
        },
        {
            "date": 20161228,
            "net_inflow": 1334201
        },
        {
            "date": 20161229,
            "net_inflow": -4326613
        },
        {
            "date": 20161230,
            "net_inflow": 3280986
        }
    ],
    "goods_id": 600600,
    "last_update_market_time": 150924
}
     */

    var currentday_inflow_str = res.currentday_inflow;
    var currentday_inflow_obj = JSON.parse(currentday_inflow_str);

    mBuyLarge = currentday_inflow_obj.bHuge + currentday_inflow_obj.bLarge;
    mSaleLarge = currentday_inflow_obj.sHuge + currentday_inflow_obj.sLarge;

    mBuySmall = currentday_inflow_obj.bMiddle + currentday_inflow_obj.bLittle;
    mSaleSmall = currentday_inflow_obj.sMiddle + currentday_inflow_obj.sLittle;

    tenDayInFlow = res.day_net_inflow;
}

function drawOneDayPie(that) {
    // 页面渲染完成
    var ctx = wx.createCanvasContext('fundinflow_pie');
    var x = canvasUtil.getLengthByRpx(750) / 2;
    var y = canvasUtil.getLengthByRpx(320) / 2;
    var r = canvasUtil.getLengthByRpx(131);

    var width1 = canvasUtil.getLengthByRpx(9);
    var r1 = r - width1 / 2.0;
    ctx.arc(x, y, r1, 0, 2 * Math.PI);
    ctx.setStrokeStyle('#ebebeb');
    ctx.setLineCap('butt');
    ctx.setLineWidth(width1);
    ctx.stroke();

    var total = Math.abs(mBuyLarge) + Math.abs(mSaleLarge) + Math.abs(mBuySmall) + Math.abs(mSaleSmall);

    var bLarge_p = Math.abs(mBuyLarge) / total;
    var bSmall_p = 0.5 - bLarge_p;

    var sLarge_p = Math.abs(mSaleLarge) / total;
    var sSmall_p = 0.5 - sLarge_p;

    var p1 = sSmall_p * 2 * Math.PI;
    var p2 = Math.PI;
    var p3 = Math.PI + bLarge_p * 2 * Math.PI;
    var p4 = Math.PI * 2;

    var width2 = canvasUtil.getLengthByRpx(31);
    var r2 = r - width1 - width2 / 2.0;

    //4 sSmall
    ctx.beginPath();
    ctx.arc(x, y, r2, 0, p1);
    ctx.setStrokeStyle('#1dbf60');
    ctx.setLineCap('butt');
    ctx.setLineWidth(width2);
    ctx.stroke();

    //2 sLarge
    ctx.beginPath();
    ctx.arc(x, y, r2, p1, p2);
    ctx.setStrokeStyle('#009600');
    ctx.setLineCap('butt');
    ctx.setLineWidth(width2);
    ctx.stroke();


    //1 bLarge
    ctx.beginPath();
    ctx.arc(x, y, r2, p2, p3);
    ctx.setStrokeStyle('#e60012');
    ctx.setLineCap('butt');
    ctx.setLineWidth(width2);
    ctx.stroke();

    //3 bSmall
    ctx.beginPath();
    ctx.arc(x, y, r2, p3, p4);
    ctx.setStrokeStyle('#f95d5b');
    ctx.setLineCap('butt');
    ctx.setLineWidth(width2);
    ctx.stroke();

    var dashlineWidth = canvasUtil.getLengthByRpx(65);

    ctx.beginPath();
    for (var tx = x - r - dashlineWidth; tx < x - r;) {
        ctx.moveTo(tx, y);
        tx += 4;
        ctx.lineTo(tx, y);
        tx += 2;
    }
    ctx.setStrokeStyle('#e4e4e4');
    ctx.setLineWidth(1);
    ctx.stroke();

    ctx.beginPath();
    for (var tx = x + r; tx < x + r + dashlineWidth;) {
        ctx.moveTo(tx, y);
        tx += 4;
        ctx.lineTo(tx, y);
        tx += 2;
    }
    ctx.setStrokeStyle('#e4e4e4');
    ctx.setLineWidth(1);
    ctx.stroke();

    ctx.beginPath();
    ctx.setFontSize(canvasUtil.getLengthByRpx(22));
    ctx.setFillStyle('#b2b2b2');
    ctx.fillText("1", x - r - dashlineWidth / 2.0, y - 8);

    ctx.fillText("2", x - r - dashlineWidth / 2.0, y + 17);

    ctx.fillText("3", x + r + dashlineWidth / 2.0, y - 8);
    ctx.fillText("4", x + r + dashlineWidth / 2.0, y + 17);

    ctx.draw();


    fundData.bLarge_proportion = (bLarge_p * 100).toFixed(0) + "%";
    fundData.sLarge_proportion = (sLarge_p * 100).toFixed(0) + "%";
    fundData.bSmall_proportion = (bSmall_p * 100).toFixed(0) + "%";
    fundData.sSmall_proportion = (sSmall_p * 100).toFixed(0) + "%";



}



function drawTenDayTrend(that) {
    prepareDrawTendayInflow(tenDayInFlow);

    var ctx = wx.createCanvasContext('fundinflow_tenday');
    var y1 = canvasUtil.getLengthByRpx(110);
    ctx.setLineWidth(mPer_item_w * 0.6);
    for (var i = 0; i < tenDayInFlow.length; i++) {
        var t_x1 = getX1PositionByIndex(i);
        var t_y2 = getY2PositionByValue(tenDayInFlow[i].net_inflow / UNITS);
        ctx.beginPath();
        ctx.setStrokeStyle(getZDPColor(tenDayInFlow[i].net_inflow / UNITS));
        ctx.moveTo(t_x1, y1);
        ctx.lineTo(t_x1, t_y2);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.setStrokeStyle('#e4e4e4');
    ctx.setLineWidth(1);
    ctx.moveTo(0, y1);
    ctx.lineTo(getApp().globalData.screenWidth, y1);
    ctx.stroke();


    ctx.draw();


    fundData.firstDate = formatDateM_D(tenDayInFlow[0].date + "");
    fundData.lastDate = formatDateM_D(tenDayInFlow[tenDayInFlow.length - 1].date + "");
}

function prepareDrawTendayInflow(datas) {
    var max = 0;
    for (var i = 0; i < datas.length; i++) {
        if (Math.abs(datas[i].net_inflow / UNITS) > max) {
            max = Math.abs(datas[i].net_inflow / UNITS);
        }
    }

    var ctx_h = canvasUtil.getLengthByRpx(220);
    mValue_per_ypx = ctx_h / (max * 2);

    var ctx_w = getApp().globalData.screenWidth - canvasUtil.getLengthByRpx(60);
    mPer_item_w = ctx_w / datas.length;




}

function getY2PositionByValue(value) {
    var t_h = Math.abs(value) * mValue_per_ypx;
    var middle_y = canvasUtil.getLengthByRpx(110);
    if (value >= 0) {
        return middle_y - t_h;
    }
    else {
        return middle_y + t_h;
    }
}

function getX1PositionByIndex(index) {
    var x1 = mPer_item_w * index + mPer_item_w / 2;

    return x1;
}

function getZDPColor(value) {
    if (value >= 0)
        return "#f24957";
    else
        return "#1dbf60";
}

function formatDateM_D(orgDate, separator) {
    var fixDate = "";
    var t_separator = "/";
    if (separator) {
        t_separator = separator;
    }

    var nlen = orgDate.length;
    if (nlen >= 8) {
        var tMonth = orgDate.substring(4, 6);
        if (tMonth.startsWith("0")) {
            tMonth = tMonth.replace("0", "");
        }

        var tDay = orgDate.substring(6, 8);
        if (tDay.startsWith("0")) {
            tDay = tDay.replace("0", "");
        }

        fixDate = tMonth + t_separator + tDay;
    }

    return fixDate;
}

module.exports = {
    init: init,
    show: show,
    setJLValue: setJLValue
}