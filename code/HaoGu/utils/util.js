
var Color = require('../models/Color.js')

// 数字格式化
function formateNumber(num, length) {
  return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

// 时间格式化 formate：格式，如yyyy-MM-dd HH:mm:ss.hhh
function formateTime(date, formate) {
  var result = formate

  result = result.replace("yyyy", date.getFullYear())
  result = result.replace("yy", formateNumber(date.getYear(), 2))
  result = result.replace("MM", formateNumber(date.getMonth() + 1, 2))
  result = result.replace("dd", formateNumber(date.getDate(), 2))
  result = result.replace("HH", formateNumber(date.getHours(), 2))
  result = result.replace("mm", formateNumber(date.getMinutes(), 2))
  result = result.replace("ss", formateNumber(date.getSeconds(), 2))
  result = result.replace("hhh", formateNumber(date.getMilliseconds(), 3))

  return result;
}

// 转换时间显示格式  20140601 --> 2014-06-01
function formatDateYYYYmmdd(originDate, seperator) {
  var result = ''

  var tSeperator = '-'
  if (seperator != null && seperator != '') {
    tSeperator = seperator
  }

  originDate = originDate + ''
  var length = originDate.length
  if (length >= 8) {
    var year = originDate.substr(0, 4)
    var month = originDate.substr(4, 2)
    var day = originDate.substr(6, 2)
    result = year + tSeperator + month + tSeperator + day
  }

  return result
}

/**
* 保留两位小数
*/
function formatPrice(value) {
    value = value / 1000
    return value.toFixed(2)
}

/**
* 保留两位小数
*/
function formatZd(value) {
    value = value / 1000
    return value.toFixed(2)
}

function formatZdf(value) {
    value = value / 100
    return value.toFixed(2) + '%'
}

// 格式化换手率
function formatHsl(value) {
    value = value / 100
    return value.toFixed(2) + '%'
}

// 格式化市盈率、市净率、量比
function formatSyl(value) {
    value = value / 100
    if (value == 0) {
        return '--'
    } else {
        return value.toFixed(2)
    }
}

// 格式化成交量
function formatVolumn(val) {
    if (val < 100000) {
        return val.toFixed(0)
    } else if (val >= 100000 && val < 1000000) {
        val = val / 10000;
        return val.toFixed(2) + '万'
    } else if (val >= 1000000 && val < 10000000) {
        val = val / 10000;
        return val.toFixed(1) + '万'
    } else if (val >= 10000000 && val < 100000000) {
        val = val / 10000;
        return val.toFixed(0) + '万'
    } else {
        val = val / 100000000;
        return val.toFixed(2) + '亿'
    }
}

// 格式化净流
function formatJl(val) {
    var flag = ''
    if (val < 0) {
        flag = '-'
        val = -val
    }

    if (val < 10000) {
        return flag + val
    } else if (val < 100000000) {
        val = val / 10000;
        return flag + val.toFixed(0) + '万'
    } else if (val < 100000000000) {
        val = val / 100000000
        return flag + val.toFixed(1) + '亿'
    } else {
        val = val / 100000000
        return flag + val.toFixed(0) + '亿'
    }
}

// 格式化总值
function formatAmount(val) {
    var flag = ''
    if (val < 0) {
        flag = '-'
        val = -val
    }

    if (val < 100000) {
        return flag + val.toFixed(0)
    } else if (val >= 100000 && val < 1000000) {
        val = val / 10000;
        return flag + val.toFixed(2) + '万';
    } else if (val >= 1000000 && val < 10000000) {
        val = val / 10000;
        return flag + val.toFixed(1) + '万';
    } else if (val >= 10000000 && val < 100000000) {
        val = val / 10000;
        return flag + val.toFixed(1) + '万';
    } else if (val >= 100000000 && val < 1000000000) {
        val = val / 100000000;
        return flag + val.toFixed(2) + '亿';
    } else if (val >= 1000000000 && val < 10000000000) {
        val = val / 100000000;
        return flag + val.toFixed(1) + '亿';
    } else {
        val = val / 100000000;
        return flag + val.toFixed(1) + '亿';
    }
}

function getColorByZd(zd) {
    if (zd >= 0) {
        return Color.c1
    } else {
        return Color.c2
    }
}

module.exports = {
  formateTime: formateTime,
  formateNumber: formateNumber,
  formatDateYYYYmmdd: formatDateYYYYmmdd,
  formatPrice: formatPrice,
  formatZd: formatZd,
  formatZdf: formatZdf,
  getColorByZd: getColorByZd,
  formatHsl: formatHsl,
  formatSyl: formatSyl,
  formatVolumn: formatVolumn,
  formatJl: formatJl,
  formatAmount: formatAmount
}
