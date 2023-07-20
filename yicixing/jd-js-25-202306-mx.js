var detailData = [
  {"stime": "2023-06", "activeNum": 472, "avgActivePrice": 8.82, "cheatNum":56, "cheatRate": 11.86, "normalNum": 416, "statementCost": 3667.46, "totalRewardAmount":0},
  {"stime": "2023-06-08", "activeNum": 19, "avgActivePrice": 3, "cheatNum":4, "cheatRate": 21.05, "normalNum": 15, "statementCost": 44.96, "totalRewardAmount":0},
  {"stime": "2023-06-09", "activeNum": 47, "avgActivePrice": 9.96, "cheatNum":4, "cheatRate": 8.51, "normalNum": 43, "statementCost": 428.14, "totalRewardAmount":0},
  {"stime": "2023-06-10", "activeNum": 49, "avgActivePrice": 9.12, "cheatNum":3, "cheatRate": 6.12, "normalNum": 46, "statementCost": 419.61, "totalRewardAmount":0},
  {"stime": "2023-06-11", "activeNum": 36, "avgActivePrice": 12.41, "cheatNum":4, "cheatRate": 11.11, "normalNum": 32, "statementCost": 397.17, "totalRewardAmount":0},
  {"stime": "2023-06-12", "activeNum": 39, "avgActivePrice": 20, "cheatNum":4, "cheatRate": 10.26, "normalNum": 35, "statementCost": 700, "totalRewardAmount":0},
  {"stime": "2023-06-13", "activeNum": 25, "avgActivePrice": 1.31, "cheatNum":1, "cheatRate": 4, "normalNum": 24, "statementCost": 31.53, "totalRewardAmount":0},
  {"stime": "2023-06-14", "activeNum": 53, "avgActivePrice": 12.88, "cheatNum":3, "cheatRate": 5.66, "normalNum": 50, "statementCost": 643.8, "totalRewardAmount":0},
  {"stime": "2023-06-15", "activeNum": 72, "avgActivePrice": 7.59, "cheatNum":6, "cheatRate": 8.33, "normalNum": 66, "statementCost": 500.95, "totalRewardAmount":0},
  {"stime": "2023-06-16", "activeNum": 68, "avgActivePrice": 3.35, "cheatNum":14, "cheatRate": 20.59, "normalNum": 54, "statementCost": 180.81, "totalRewardAmount":0},
  {"stime": "2023-06-17", "activeNum": 42, "avgActivePrice": 8.77, "cheatNum":9, "cheatRate": 21.43, "normalNum": 33, "statementCost": 289.29, "totalRewardAmount":0},
  {"stime": "2023-06-18", "activeNum": 22, "avgActivePrice": 1.73, "cheatNum":4, "cheatRate": 18.18, "normalNum": 18, "statementCost": 31.2, "totalRewardAmount":0},
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
        row.activeNum = 472;
        row.activeNumPer = -18.74;
        row.normalNum = 416;
        row.normalNumPer = -29.69;
        row.cheatRate = 11.86;
        row.cheatRatePer = 1663.92;
        row.statementCost = 3667.46;
        row.statementCostPer = 14.01;
        row.avgActivePrice = 8.82;
        row.avgActivePricePer = 62.16;
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
