
function KLineData(time, open, high, low, close, ma5, ma10, ma20, amount, price, volume) {
    this.time = time
    this.open = open
    this.high = high
    this.low = low
    this.close = close  
    this.ma5 = ma5
    this.ma10 = ma10
    this.ma20 = ma20
    this.amount = amount
    this.price = price
    this.volume = volume
    
    this.toString = function() {
        return '[time: ' + time + ', open: ' + open + ', high: ' + high + ', low: ' + low 
        + ', close: ' + close + ', ma5: ' + ma5 + ', ma10: ' + ma10 + ', ma20: ' + ma20 + ', amount: ' + amount + ']'
    }
}


module.exports = KLineData
