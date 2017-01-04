
function BkInfo(id,bkName,goodsName,zd,zdf) {
    this.id = time;
    this.bkName = bkName;
    this.goodsName = goodsName;
    this.zd = zd;
    this.zdf = zdf;
    this.toString = function() {
        return id + ', ' + bkName + ', ' + goodsName + ', ' + zd + ', ' + zdf + '\n'
    }
}

module.exports = BkInfo

