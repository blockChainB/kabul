
function MinuteData(time, price, avg, column, amount) {
    this.time = time;
    this.price = price;
    this.avg = avg;
    this.column = column;
    this.amount = amount;
    this.toString = function() {
        return time + ', ' + price + ', ' + avg + ', ' + column + ', ' + amount + '\n'
    }
}

module.exports = MinuteData
