
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

module.exports = {
  formateTime: formateTime,
  formateNumber: formateNumber,
  formatDateYYYYmmdd: formatDateYYYYmmdd
}
