var oldfetch = fetch;
fetch = function (url, options={}) {
  return new Promise((resolve, reject) => {
    oldfetch(url, options)
        .then((res)=>{
            var oldjson = res.json;
            res.json=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldjson.call(this).then((j)=>{
                        // resolvej.call(this,interceptintercept(j, this));
                        resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
            var oldclone = res.clone;
            res.clone=function(){
                var newRes = oldclone.call(this);
                newRes.clone = this.clone;
                var oldjsonc = newRes.json;
                newRes.json=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldjsonc.call(this).then((j)=>{
                        resolvej.call(this,interceptintercept(j, this));
                        // resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
                var oldtextc = newRes.text;
                newRes.text=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldtextc.call(this).then((j)=>{
                        try {
                            j = JSON.parse(j);
                        } catch (error) {
                            resolvej.call(this,j);
                        }
                        resolvej.call(this,JSON.stringify(interceptintercept(j, this)));
                    })
                .catch(errj=>{rejectj(errj)})})};
                return newRes;
            };
            resolve(res);
        })
        .catch(err => {
            reject(err)
        });

  });
}

function interceptintercept(json, resp){
    console.log(json, resp);
    if(resp.url.indexOf('/statement/info?')>=0) {
        var data = json.data;
        var row = data;
        row.activeNum = 85926;
        row.activeNumPer = 10.21;
        row.normalNum = 83310;
        row.normalNumPer = 11.58;
        row.cheatRate = 3.04;
        row.cheatRatePer = -28.13;
        row.statementCost = 813528.25;
        row.statementCostPer = 19.35;
        row.avgActivePrice = 9.77;
        row.avgActivePricePer = 7.01;
        console.log('json', json);
        return json;
    } else if(resp.url.indexOf('/statement/list?') >= 0){
        var result = json.data.result;
        for(var i = 0; i < result.length; i++){
            var row = result[i];

            var active = row.activeNum;
            var normalAc = row.normalNum;
            var fakeAc = row.cheatNum;
            var fackPercent = row.cheatRate;
            var fee = row.statementCost;
            var price = row.avgActivePrice;
            var realPrice = row.statementCost / row.normalNum;

            if(active >= activeCountLimit){
                price = price - (price * priceDeductPercent);
                active = active - Math.round(active * activeDeductPercent);
                fakeAc = fakeAc + Math.round(fakeAc * fackAcIncPercent);
                normalAc = active - fakeAc;
                fackPercent = Math.round((fakeAc / active) * 10000) / 100;
                fee = Math.round(realPrice * normalAc * 100) / 100;

                if(active > fakeAc){
                    row.activeNum = active;
                    row.normalNum = normalAc;
                    row.cheatNum = fakeAc;
                    row.cheatRate = (Math.round(fackPercent.toFixed(2)*100)/100);
                    row.statementCost = Math.round(fee.toFixed(2) * 100)/100;
                    row.avgActivePrice = Math.round(price.toFixed(2)*100)/100;
                }
            }
        }
        return json;
    }
}

var activeDeductPercent, priceDeductPercent, fackAcIncPercent;
var activeCountLimit = -1;

function runrun(){
    var percents = prompt('输入扣除百分比（激活数,平均激活单价,+作弊数）:', '10,0,0');
    if(percents == null){
        return;
    }
    percents = percents.split(',');
    activeDeductPercent = parseFloat(percents[0]) / 100;
    priceDeductPercent = parseFloat(percents[1]) / 100;
    fackAcIncPercent = parseFloat(percents[2]) / 100;
}
