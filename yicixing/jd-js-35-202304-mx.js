var detailData = [
  {"stime": "2023-04", "activeNum": 8707, "avgActivePrice": 6.93, "cheatNum":973, "cheatRate": 11.17, "normalNum": 7734, "statementCost": 53583.68, "totalRewardAmount":0},
  {"stime": "2023-04-01", "activeNum": 39, "avgActivePrice": 1.5, "cheatNum":2, "cheatRate": 5.13, "normalNum": 37, "statementCost": 55.38, "totalRewardAmount":0},
  {"stime": "2023-04-02", "activeNum": 34, "avgActivePrice": 1.31, "cheatNum":2, "cheatRate": 5.88, "normalNum": 32, "statementCost": 41.77, "totalRewardAmount":0},
  {"stime": "2023-04-03", "activeNum": 23, "avgActivePrice": 2.04, "cheatNum":2, "cheatRate": 8.7, "normalNum": 21, "statementCost": 42.84, "totalRewardAmount":0},
  {"stime": "2023-04-04", "activeNum": 28, "avgActivePrice": 0.82, "cheatNum":2, "cheatRate": 7.14, "normalNum": 26, "statementCost": 21.36, "totalRewardAmount":0},
  {"stime": "2023-04-05", "activeNum": 28, "avgActivePrice": 1.6, "cheatNum":2, "cheatRate": 7.14, "normalNum": 26, "statementCost": 41.64, "totalRewardAmount":0},
  {"stime": "2023-04-06", "activeNum": 410, "avgActivePrice": 6.09, "cheatNum":133, "cheatRate": 32.44, "normalNum": 277, "statementCost": 1687.65, "totalRewardAmount":0},
  {"stime": "2023-04-07", "activeNum": 80, "avgActivePrice": 4.53, "cheatNum":28, "cheatRate": 35, "normalNum": 52, "statementCost": 235.73, "totalRewardAmount":0},
  {"stime": "2023-04-08", "activeNum": 235, "avgActivePrice": 4.79, "cheatNum":107, "cheatRate": 45.53, "normalNum": 128, "statementCost": 612.95, "totalRewardAmount":0},
  {"stime": "2023-04-09", "activeNum": 289, "avgActivePrice": 4.1, "cheatNum":157, "cheatRate": 54.33, "normalNum": 132, "statementCost": 	541.69, "totalRewardAmount":0},
  {"stime": "2023-04-10", "activeNum": 198, "avgActivePrice": 4.66, "cheatNum":92, "cheatRate": 46.46, "normalNum": 106, "statementCost": 493.76, "totalRewardAmount":0},
  {"stime": "2023-04-11", "activeNum": 337, "avgActivePrice": 4.08, "cheatNum":152, "cheatRate": 45.1, "normalNum": 185, "statementCost": 754.4, "totalRewardAmount":0},
  {"stime": "2023-04-12", "activeNum": 257, "avgActivePrice": 5.69, "cheatNum":120, "cheatRate": 46.69, "normalNum": 137, "statementCost": 780.02, "totalRewardAmount":0},
  {"stime": "2023-04-13", "activeNum": 300, "avgActivePrice": 6.14, "cheatNum":146, "cheatRate": 48.67, "normalNum": 154, "statementCost": 945.36, "totalRewardAmount":0},
  {"stime": "2023-04-14", "activeNum": 336, "avgActivePrice": 3.77, "cheatNum":157, "cheatRate": 46.73, "normalNum": 179, "statementCost": 674.55, "totalRewardAmount":0},
  {"stime": "2023-04-15", "activeNum": 372, "avgActivePrice": 5.75, "cheatNum":188, "cheatRate": 50.54, "normalNum": 184, "statementCost": 1058, "totalRewardAmount":0},
  {"stime": "2023-04-16", "activeNum": 269, "avgActivePrice": 3.73, "cheatNum":138, "cheatRate": 51.3, "normalNum": 131, "statementCost": 489.03, "totalRewardAmount":0},
  {"stime": "2023-04-17", "activeNum": 283, "avgActivePrice": 8.45, "cheatNum":113, "cheatRate": 39.93, "normalNum": 170, "statementCost": 1437, "totalRewardAmount":0},
  {"stime": "2023-04-18", "activeNum": 246, "avgActivePrice": 2.84, "cheatNum":102, "cheatRate": 41.46, "normalNum": 144, "statementCost": 409.1, "totalRewardAmount":0},
  {"stime": "2023-04-19", "activeNum": 29, "avgActivePrice": 0.07, "cheatNum":15, "cheatRate": 51.72, "normalNum": 14, "statementCost": 1.05, "totalRewardAmount":0},
  {"stime": "2023-04-20", "activeNum": 37, "avgActivePrice": 6.98, "cheatNum":14, "cheatRate": 37.84, "normalNum": 23, "statementCost": 160.61, "totalRewardAmount":0},
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
        row.activeNum = 8707;
        row.activeNumPer = 397.26;
        row.normalNum = 7734;
        row.normalNumPer = 405.16;
        row.cheatRate = 11.17;
        row.cheatRatePer = -11.07;
        row.statementCost = 53583.68;
        row.statementCostPer = 572.32;
        row.avgActivePrice = 6.93;
        row.avgActivePricePer = 33.01;
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
