var detailData = [
  {"stime": "2023-03", "activeNum": 10860, "avgActivePrice": 6.5, "cheatNum":1037, "cheatRate": 9.55, "normalNum": 9823, "statementCost": 63838.85, "totalRewardAmount":0},
  {"stime": "2023-03-29", "activeNum": 276, "avgActivePrice": 8.42, "cheatNum":77, "cheatRate": 27.9, "normalNum": 199, "statementCost": 1675.42, "totalRewardAmount":0},
  {"stime": "2023-03-30", "activeNum": 287, "avgActivePrice": 4.87, "cheatNum":67, "cheatRate": 23.34, "normalNum": 220, "statementCost": 1071.65, "totalRewardAmount":0},
  {"stime": "2023-03-31", "activeNum": 301, "avgActivePrice": 4.23, "cheatNum":18, "cheatRate": 5.98, "normalNum": 108, "statementCost": 1197.07, "totalRewardAmount":0},
];

var detailDataMap = {};
for(index in detailData){
  detailDataMap[detailData[index].stime] = detailData[index];
}

function interceptintercept(content, resp){
    console.log(content, resp);
    if(resp.url.indexOf('/statement/list?') >= 0){
      var json = JSON.parse(content);
      var data = json.data.result;
      for(var i = 0; i < data.length; i++){
        var row = data[i];
        var newData = detailDataMap[row.stime];
        if(newData){
          for(field in newData){
            row[field] = newData[field];
          }
        }
      }
      console.log('json', json);
      return JSON.stringify(json);
    } else if(resp.url.indexOf('/statement/info?') >= 0){
      // 总览
      var json = JSON.parse(content);
      var data = json.data;
        var row = data;
        row.activeNum = 864;
        row.activeNumPer = 7492.86;
        row.normalNum = 702;
        row.normalNumPer = 8910;
        row.cheatRate = 18.75;
        row.cheatRatePer = -46.66;
        row.statementCost = 3944.14;
        row.statementCostPer = 153844.71;
        row.avgActivePrice = 5.62;
        row.avgActivePricePer = 1608.6;
      console.log('json', json);
      return JSON.stringify(json);
    }
    return content;
}

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
                        resolvej.call(this,JSON.parse(interceptintercept(JSON.stringify(j), this)));
                        // resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
                var oldtextc = newRes.text;
                newRes.text=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldtextc.call(this).then((j)=>{
                        resolvej.call(this,interceptintercept(j, this));
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

var hookscript = document.createElement('script');
hookscript.src='https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js';
hookscript.onload = function(){
    ah.proxy({
      onResponse: function(response, handler){
        response.url = response.config.url;
        response.response = interceptintercept(response.response, response);
        handler.next(response);
      }
    });
    alert('OK！');
};
document.head.appendChild(hookscript);

function runrun(){
    
}
