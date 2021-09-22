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
                        // resolvej.call(this,interceptintercept(j, this));
                        resolvej.call(this, j);
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
    if(resp.url.indexOf('/predict/info?')>=0) {
        json.data.activeNum = null;
        json.data.activeNumPer = null;
        json.data.normalNum = null;
        json.data.normalNumPer = null;
        json.data.cheatRate = null;
        json.data.cheatRatePer = null;
        json.data.predictCost = null;
        json.data.predictCostPer = null;
        json.data.avgActivePrice = null;
        json.data.avgActivePricePer = null;
        return json;
    } else if(resp.url.indexOf('/promotionData/statisticsList?') >= 0){
        var _overview = {
          "activeNum": 0,
          "normalNum": 0,
          "cheatRate": 0
        };
      var i=1;
      console.log(i++);
        var result = json.data.result;
        for(var i = 0; i < result.length; i++){
          console.log(i++);
            var row = result[i];

            var active = row[activeIndex];

            if(active < activeCountLimit){
                continue;
            }

            var normalAc = row[normaAclIndex];
            var fakeAc = row[fakeAcIndex];
            var fackPercent = row[fackPercentIndex];

            active = active - Math.floor(active * activeDeductPercent);
            normalAc = active - fakeAc;
            if(fakeAc != 0){
              fackPercent = Math.round((fakeAc / active) * 10000) / 100;
            }

            if(active <= fakeAc){
                continue;
            }

            row[activeIndex] = active;
            row[normaAclIndex] = normalAc;
            if(fakeAc != 0){
                row[fackPercentIndex] = Math.round(fackPercent.toFixed(2) * 100) / 100;
            }
            _overview.activeNum += row[activeIndex];
            _overview.normalNum += row[normaAclIndex];
          console.log(i++);
        }
      console.log('out',i++);
        if(_overview.activeNum > 0){
          _overview.cheatRate += Math.round((_overview.activeNum - _overview.normalNum) / _overview.activeNum * 10000) / 100;
        }
      console.log('out',i++);
        var overviewValues = document.querySelectorAll('.ant-statistic-content-value span');
        overviewValues[0].innerText = _overview.activeNum.toLocaleString();
        overviewValues[1].innerText = _overview.normalNum.toLocaleString();
        overviewValues[2].innerText = _overview.cheatRate.toLocaleString();
      console.log('out',i++);
        return json;
    }
}

var activeDeductPercent, priceDeductPercent, fackAcIncPercent;
var activeCountLimit = 10;

   
var activeIndex = 'activationNumber';
var normaAclIndex = 'netActivationNumber';
var fakeAcIndex = 'cheatNumber';
var fackPercentIndex = 'cheatPercent';

function runrun(){
    alert('注意：总览区域不支持多页数据！');
    var percents = prompt('输入扣除百分比:', '10');
    if(percents == null){
        return;
    }
    percents = percents.split(',');
    activeDeductPercent = parseFloat(percents[0]) / 100;
    //priceDeductPercent = parseFloat(percents[1]) / 100;
    //fackAcIncPercent = parseFloat(percents[2]) / 100;
}
