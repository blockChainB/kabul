var ColumnarAtom = require('ColumnarAtom.js')
var LineLayer = require('LineLayer.js')
var StackLayer = require('StackLayer.js')
var RectF = require('RectF.js')
var ChartView = require('ChartView.js')
var ColumnarLayer = require('ColumnarLayer.js')
var YAxisLayer = require('YAxisLayer.js')
var XAxisLayer = require('XAxisLayer.js')
var GroupLayer = require('GroupLayer.js')
var draw = require('../../../../utils/canvasUtil.js')
var util = require('../../../../utils/util.js')

function KLineCanvas(period) {
	this.mIsInit = false;    // 是否已初始化K线绘图区域布局结构和设置

	this.kLineAxisLayer = null
	this.kLineLayer = null
	this.ma5Layer = null
	this.ma10Layer = null
	this.ma20Layer = null
	this.kLineStackLayer = null
	this.kLineGroupLayer = null
	this.mVolumeLayer = null
	this.volumnGroupLayer = null
	this.mXAxisLayer = null
	this.chartView = null

	this.canvasWidth = 750     // 画布宽度，单位rpx
	this.canvasHeight = 412    // 画布高度，单位rpx
    this.mPeriod = period      // K线类型
}

// 初始化K线绘图布局
KLineCanvas.prototype.initLayers = function() {
	if (this.mIsInit == false) {

		var that = this
		var widthPerRpx = draw.getLengthByRpx(1)

		var strokeWidth = draw.getLengthByRpx(2)    // 影线宽度
		var columnWidth = draw.getLengthByRpx(7)    // K线宽度
		var baseWidth = draw.getLengthByRpx(10)    // K线中1个K线和它相邻的1个space的宽度和
		this.windowWidth = draw.getLengthByRpx(750)
		var columnCount = Math.floor(this.windowWidth / baseWidth)    // K线个数

		// 初始化
		this.kLineAxisLayer = new YAxisLayer();
        this.kLineAxisLayer.setAxisCount(2);
        this.kLineAxisLayer.setMaxValue(0.00);
        this.kLineAxisLayer.setMinValue(0.00);
        this.kLineAxisLayer.setColor('828282');
        this.kLineAxisLayer.setAlign(0);
        this.kLineAxisLayer.setPaddings(2, 17 + 2, 2, 2);
        this.kLineAxisLayer.setLengthPerRpx(widthPerRpx)
        this.kLineAxisLayer.setMinWidthString('1000.00亿');
        this.kLineAxisLayer.setTextSize(10);
        this.kLineAxisLayer.setOnFormatDataListener(function(data) {
			return (data / 1000.0).toFixed(2)
		})

		this.kLineLayer = new ColumnarLayer()
        this.kLineLayer.setPaddings(4 * widthPerRpx, 0, 4 * widthPerRpx, 0);
        this.kLineLayer.setMaxCount(columnCount);
        this.kLineLayer.setColumnarWidth(columnWidth);
        this.kLineLayer.setStrokeWidth(strokeWidth);
        this.kLineLayer.setOnDrawCallback(function(context, pos) {
        	var atom = that.kLineLayer.getValue(pos)
        	var color = '#e64340'

        	var zdFlag = 0
        	if (atom.mClose > atom.mOpen) {
        		zdFlag = 1    // 当期上涨
        	} else if (atom.mClose < atom.mOpen) {
        		zdFlag = -1    // 当期下跌
        	}

        	if (zdFlag == 0) {
        		// 当天平价
        		if (pos >= 1) {
        			var preAtom = that.kLineLayer.getValue(pos)
        			var preClose = preAtom.mClose
        			if (atom.mClose < preClose) {
        				zdFlag = -1
        			}
        		}
        	}

        	if (zdFlag < 0) {
        		color = '#09bb07'
        	}

        	context.setStrokeStyle(color)
        	context.setFillStyle(color)
		})

		this.ma5Layer = new LineLayer()
        this.ma5Layer.setPaddings(4 * widthPerRpx, 0, 4 * widthPerRpx, 0);
		this.ma5Layer.setColor('#febe00');
        this.ma5Layer.setMaxCount(columnCount);
        this.ma5Layer.setStrokeWidth(widthPerRpx);
        this.ma5Layer.setFloorValue(0, false);

        this.ma10Layer = new LineLayer()
        this.ma10Layer.setPaddings(4 * widthPerRpx, 0, 4 * widthPerRpx, 0);
        this.ma10Layer.setColor('#4084d2');
        this.ma10Layer.setMaxCount(columnCount);
        this.ma10Layer.setFloorValue(0, false);
        this.ma10Layer.setStrokeWidth(widthPerRpx);

        this.ma20Layer = new LineLayer()
        this.ma20Layer.setPaddings(4 * widthPerRpx, 0, 4 * widthPerRpx, 0);
        this.ma20Layer.setColor('#e319a3');
        this.ma20Layer.setMaxCount(columnCount);
        this.ma20Layer.setFloorValue(0, false);
        this.ma20Layer.setStrokeWidth(widthPerRpx);

        this.kLineStackLayer = new StackLayer();
        this.kLineStackLayer.setPaddings(0, 17, 0, 0);
        this.kLineStackLayer.setBorderWidth(widthPerRpx);
        this.kLineStackLayer.setBorderColor('#dddddd');
        this.kLineStackLayer.setIsShowHPaddingLine(true);
        this.kLineStackLayer.showHGrid(2);
        this.kLineStackLayer.switchAvgLineIdentifyOn(true)
        this.kLineStackLayer.setLengthPerRpx(widthPerRpx)
        this.kLineStackLayer.setShowSide(this.kLineStackLayer.SIDE_LEFT_V | this.kLineStackLayer.SIDE_TOP_H | this.kLineStackLayer.SIDE_RIGHT_V | this.kLineStackLayer.SIDE_BOTTOM_H);
        this.kLineStackLayer.addLayer(this.kLineLayer);
        this.kLineStackLayer.addLayer(this.ma5Layer);
        this.kLineStackLayer.addLayer(this.ma10Layer);
        this.kLineStackLayer.addLayer(this.ma20Layer);

        this.kLineGroupLayer = new GroupLayer()
		this.kLineGroupLayer.setLeftLayer(this.kLineAxisLayer);
		this.kLineGroupLayer.setCenterLayer(this.kLineStackLayer);
		this.kLineGroupLayer.setHeightPercent(0.72);

		this.mVolumeLayer = new ColumnarLayer();
        this.mVolumeLayer.setPaddings(4 * widthPerRpx, 2, 4 * widthPerRpx, 0);
        this.mVolumeLayer.setBorderWidth(widthPerRpx);
        this.mVolumeLayer.setBorderColor('#dddddd');
		this.mVolumeLayer.showHGrid(1);
        this.mVolumeLayer.setShowSide(this.mVolumeLayer.SIDE_LEFT_V | this.mVolumeLayer.SIDE_RIGHT_V | this.mVolumeLayer.SIDE_BOTTOM_H);
        this.mVolumeLayer.setMaxCount(columnCount);
        this.mVolumeLayer.setColumnarWidth(columnWidth);
        this.mVolumeLayer.setOnDrawCallback(function(context, pos) {
			var atom = that.kLineLayer.getValue(pos)
        	var color = '#e64340'

        	var zdFlag = 0
        	if (atom.mClose > atom.mOpen) {
        		zdFlag = 1    // 当期上涨
        	} else if (atom.mClose < atom.mOpen) {
        		zdFlag = -1    // 当期下跌
        	}

        	if (zdFlag == 0) {
        		// 当天平价
        		if (pos >= 1) {
        			var preAtom = that.kLineLayer.getValue(pos)
        			var preClose = preAtom.mClose
        			if (atom.mClose < preClose) {
        				zdFlag = -1
        			}
        		}
        	}

        	if (zdFlag < 0) {
        		color = '#09bb07'
        	}

        	context.setStrokeStyle(color)
        	context.setFillStyle(color)
		})

		this.volumnGroupLayer = new GroupLayer()
		this.volumnGroupLayer.setCenterLayer(this.mVolumeLayer);
		this.volumnGroupLayer.setHeightPercent(0.28);

		this.mXAxisLayer = new XAxisLayer()
		this.mXAxisLayer.setLengthPerRpx(widthPerRpx)

		var width = draw.getLengthByRpx(this.canvasWidth)
		var height = draw.getLengthByRpx(this.canvasHeight)
		this.chartView = new ChartView(0, 0, width * 1.0, height * 1.0)

		// console.log('width: ' + width + ', height: ' + height + ', perWidth: ' + widthPerRpx + ', strokeWidth: ' 
		// 	+ strokeWidth + ', columnWidth: ' + columnWidth + ', baseWidth: ' + baseWidth)

		this.chartView.addLayer(this.kLineGroupLayer)
		this.chartView.addLayer(this.volumnGroupLayer)
		this.chartView.addLayer(this.mXAxisLayer)

		this.mIsInit = true;
	}
}

// 分时布局添加数据
KLineCanvas.prototype.addValues = function(values) {
	if (this.mIsInit == false) {
		this.initLayers();
	}

	if (this.mIsInit && values != null) {
		for (var i = 0; i < values.length; i++) {
			var data = values[i]

			var kLineValue = new ColumnarAtom(data.open, data.high, data.low, data.price)
			kLineValue.mTag = data.time
			this.kLineLayer.addValue(kLineValue);
			this.mVolumeLayer.addValue(new ColumnarAtom(0, 0, 0, data.amount));
            this.ma5Layer.addValue(data.ma5);
            this.ma10Layer.addValue(data.ma10);
            this.ma20Layer.addValue(data.ma20);
		}
	}

	// console.log('add values finish, kline values ' + this.ma20Layer.getValues() + ', value count ' + this.ma20Layer.getValueCount())
}

// 分时布局添加数据
KLineCanvas.prototype.addValue = function(value) {
	if (this.mIsInit == false) {
		this.initLayers();
	}

	if (this.mIsInit && value != null) {
		var data = value

		var kLineValue = new ColumnarAtom(data.open, data.high, data.low, data.price)
		kLineValue.mTag = data.time
		this.kLineLayer.addValue(kLineValue);
		this.mVolumeLayer.addValue(new ColumnarAtom(0, 0, 0, data.amount));
        this.ma5Layer.addValue(data.ma5);
        this.ma10Layer.addValue(data.ma10);
        this.ma20Layer.addValue(data.ma20);
	}
}

// 计算最大最小值
KLineCanvas.prototype.calculate = function() {
	// 添加value之后，需要重新设置maxCount，以确定startPos位置
	var baseWidth = draw.getLengthByRpx(10)    // K线中1个K线和它相邻的1个space的宽度和
	var columnCount = Math.floor(this.windowWidth / baseWidth)    // K线个数
	this.kLineLayer.setMaxCount(columnCount);
	this.ma5Layer.setMaxCount(columnCount);
	this.ma10Layer.setMaxCount(columnCount);
	this.ma20Layer.setMaxCount(columnCount);
	this.mVolumeLayer.setMaxCount(columnCount);

	this.kLineStackLayer.calMinAndMaxValue()
	this.kLineLayer.setMaxValue(this.kLineStackLayer.getMaxValue());
    this.ma5Layer.setMaxValue(this.kLineStackLayer.getMaxValue());
    this.ma10Layer.setMaxValue(this.kLineStackLayer.getMaxValue());
    this.ma20Layer.setMaxValue(this.kLineStackLayer.getMaxValue());
    this.kLineAxisLayer.setMaxValue(this.kLineStackLayer.getMaxValue());

    this.kLineLayer.setMinValue(this.kLineStackLayer.getMinValue());
    this.ma5Layer.setMinValue(this.kLineStackLayer.getMinValue());
    this.ma10Layer.setMinValue(this.kLineStackLayer.getMinValue());
    this.ma20Layer.setMinValue(this.kLineStackLayer.getMinValue());
    this.kLineAxisLayer.setMinValue(this.kLineStackLayer.getMinValue());

	this.mVolumeLayer.calMinAndMaxValue();
    this.mVolumeLayer.setMaxValue(this.mVolumeLayer.getMaxValue());
    this.mVolumeLayer.setMinValue(this.mVolumeLayer.getMinValue());

	// 计算时间坐标起始终止值
	var atomFirst = this.kLineLayer.getDisplayFirstValue();
    var atomLast = this.kLineLayer.getLastValue();
    var dateFirst = 0;
    var dateLast = 0;
    if (atomFirst != null && atomLast != null) {
        dateFirst = atomFirst.mTag;
        dateLast = atomLast.mTag;
    }
	
    
    var strDateFirst = '';
    var strDateLast = '';

    if (this.mPeriod == 60 || this.mPeriod == 30 || this.mPeriod == 15) {
        var tDate = util.formatDateY_M_D_HHmm(dateFirst + '', '/');
        var aryDate = tDate.split('/');
        if (aryDate != null && aryDate.length == 4) {
            strDateFirst = aryDate[1] + "-" + aryDate[2] + " " + aryDate[3];
        }
        tDate = util.formatDateY_M_D_HHmm(dateLast + '', '/');
        aryDate = tDate.split('/');
        if (aryDate != null && aryDate.length == 4) {
            strDateLast = aryDate[1] + "-" + aryDate[2] + " " + aryDate[3];
        }
    } else {
        strDateFirst = util.formatDateYYYYmmdd(dateFirst, '-');
        strDateLast = util.formatDateYYYYmmdd(dateLast, '-');
    }
    
	console.log('kline canvas get datatime ', atomLast, dateLast, strDateLast)
    
    this.mXAxisLayer.clearValue();
    this.mXAxisLayer.addValue(strDateFirst);
    this.mXAxisLayer.addValue(strDateLast);
}

// 分时布局开始绘制
KLineCanvas.prototype.invalidate = function(id) {
	if (this.mIsInit == true) {
		this.calculate()

		const context = wx.createCanvasContext(id)
		this.chartView.onDraw(context)
		context.draw()
	}
}

KLineCanvas.prototype.setHeight = function(height) {
	this.canvasHeight = height
}

KLineCanvas.prototype.setWidth = function(width) {
	this.canvasWidth = width
}

module.exports = KLineCanvas
