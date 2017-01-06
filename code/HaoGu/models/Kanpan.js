function BKInfo(id,code, bkName, goodsName, zxj, zdf,zdfDisplay) {
    this.id = id;
    this.code=code;
    this.bkName = bkName;
    this.goodsName = goodsName;
    this.zxj = zxj;
    this.zdf = zdf;
    this.zdfDisplay=zdfDisplay;
    this.toString = function () {
        return id + ', ' + bkName + ', ' + goodsName + ', ' + zxj + ', ' + zdf + ','+zdfDisplay+'\n'
    }
}

function Goods(id,code, name, price, zdf, zdfDisplay, time,suspension) {
    this.id=id;
    this.code = code;
    this.name = name;
    this.price = price;
    this.zdf = zdf;
    this.zdfDisplay = zdfDisplay;
    this.time = time;
    this.suspension=suspension;
    this.toString = function () {
        return id+','+code + ', ' + name + ', ' + price + ', ' + zdf + ',' + zdfDisplay + ', ' + time + ','+suspension+'\n'
    }
}

module.exports = {
    BKInfo: BKInfo,
    Goods: Goods
}

