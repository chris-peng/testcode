var detailData = [
  {"stime": "2023-04", "activeNum": 8707, "avgActivePrice": 6.93, "cheatNum":973, "cheatRate": 11.17, "normalNum": 7734, "statementCost": 53583.68, "totalRewardAmount":0},
  {"stime": "2023-04-01", "activeNum": 299, "avgActivePrice": 4.87, "cheatNum":30, "cheatRate": 10.03, "normalNum": 269, "statementCost": 1310.3, "totalRewardAmount":0},
  {"stime": "2023-04-02", "activeNum": 369, "avgActivePrice": 7.4, "cheatNum":41, "cheatRate": 11.11, "normalNum": 328, "statementCost": 2426.99, "totalRewardAmount":0},
  {"stime": "2023-04-03", "activeNum": 328, "avgActivePrice": 10.04, "cheatNum":64, "cheatRate": 19.51, "normalNum": 264, "statementCost": 2650.21, "totalRewardAmount":0},
  {"stime": "2023-04-04", "activeNum": 300, "avgActivePrice": 8.76, "cheatNum":34, "cheatRate": 11.33, "normalNum": 266, "statementCost": 2330.94, "totalRewardAmount":0},
  {"stime": "2023-04-05", "activeNum": 360, "avgActivePrice": 6.36, "cheatNum":94, "cheatRate": 26.11, "normalNum": 266, "statementCost": 1690.45, "totalRewardAmount":0},
  {"stime": "2023-04-06", "activeNum": 322, "avgActivePrice": 3.97, "cheatNum":35, "cheatRate": 10.87, "normalNum": 287, "statementCost": 1139.72, "totalRewardAmount":0},
  {"stime": "2023-04-07", "activeNum": 274, "avgActivePrice": 4.09, "cheatNum":17, "cheatRate": 6.2, "normalNum": 257, "statementCost": 1051.62, "totalRewardAmount":0},
  {"stime": "2023-04-08", "activeNum": 155, "avgActivePrice": 6.22, "cheatNum":10, "cheatRate": 6.45, "normalNum": 145, "statementCost": 901.49, "totalRewardAmount":0},
  {"stime": "2023-04-09", "activeNum": 162, "avgActivePrice": 4.11, "cheatNum":15, "cheatRate": 9.26, "normalNum": 147, "statementCost": 	604.81, "totalRewardAmount":0},
  {"stime": "2023-04-10", "activeNum": 314, "avgActivePrice": 10.08, "cheatNum":22, "cheatRate": 7.01, "normalNum": 292, "statementCost": 2943.31, "totalRewardAmount":0},
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
