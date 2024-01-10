var detailData = [
  {"stime": "2023-12", "activeNum": 6862, "avgActivePrice": 7.18, "cheatNum":18, "cheatRate": 0.26, "normalNum": 6844, "statementCost": 49137.06, "totalRewardAmount":0},
  {"stime": "2023-12-01", "activeNum": 42, "avgActivePrice": 2.05, "cheatNum":3, "cheatRate": 7.14, "normalNum": 39, "statementCost": 80.05, "totalRewardAmount":0},
  {"stime": "2023-12-02", "activeNum": 267, "avgActivePrice": 2.36, "cheatNum":1, "cheatRate": 0.37, "normalNum": 266, "statementCost": 627.53, "totalRewardAmount":0},
  {"stime": "2023-12-03", "activeNum": 134, "avgActivePrice": 7.97, "cheatNum":0, "cheatRate": 0, "normalNum": 134, "statementCost": 1067.76, "totalRewardAmount":0},
  {"stime": "2023-12-04", "activeNum": 67, "avgActivePrice": 4.82, "cheatNum":0, "cheatRate": 0, "normalNum": 67, "statementCost": 323.17, "totalRewardAmount":0},
  {"stime": "2023-12-05", "activeNum": 21, "avgActivePrice": 0.62, "cheatNum":0, "cheatRate": 0, "normalNum": 21, "statementCost": 12.96, "totalRewardAmount":0},
  {"stime": "2023-12-06", "activeNum": 12, "avgActivePrice": 0.26, "cheatNum":0, "cheatRate": 0, "normalNum": 12, "statementCost": 3.13, "totalRewardAmount":0},
  {"stime": "2023-12-07", "activeNum": 796, "avgActivePrice": 6.35, "cheatNum":1, "cheatRate": 0.13, "normalNum": 795, "statementCost": 5049.31, "totalRewardAmount":0},
  {"stime": "2023-12-08", "activeNum": 1755, "avgActivePrice": 8.28, "cheatNum":4, "cheatRate": 0.23, "normalNum": 1751, "statementCost": 14492.68, "totalRewardAmount":0},
  {"stime": "2023-12-09", "activeNum": 1817, "avgActivePrice": 6.94, "cheatNum":6, "cheatRate": 0.33, "normalNum": 1811, "statementCost": 12560.93, "totalRewardAmount":0},
  {"stime": "2023-12-10", "activeNum": 1951, "avgActivePrice": 7.66, "cheatNum":3, "cheatRate": 0.15, "normalNum": 1948, "statementCost": 14919.54, "totalRewardAmount":0},
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
      var newDataArray = [];
      var ignoreTotal = 0;
      for(var i = 0; i < data.length; i++){
        var row = detailData[detailData.length - i];
        newDataArray.push(row);
        /*var newData = detailDataMap[row.stime];
        if(newData){
          for(field in newData){
            row[field] = newData[field];
          }
        }
        // 只保留这些数据
        if(row.stime < '2023-12-11') {
          newDataArray.push(row);
        } else {
          ignoreTotal++;
        }*/
      }
      json.data.result = newDataArray;
      json.data.total = detailData.length;
      console.log('json', json);
      return JSON.stringify(json);
    } else if(resp.url.indexOf('/statement/info?') >= 0){
      // 总览
      var json = JSON.parse(content);
      var data = json.data;
        var row = data;
        row.activeNum = 6862;
        row.activeNumPer = 353.24;
        row.normalNum = 6844;
        row.normalNumPer = 367.81;
        row.cheatRate = 0.26;
        row.cheatRatePer = -92.21;
        row.statementCost = 49137.06;
        row.statementCostPer = 557.43;
        row.avgActivePrice = 7.18;
        row.avgActivePricePer = 40.51;
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
