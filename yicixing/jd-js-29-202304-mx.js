var detailData = [
  {"stime": "2023-04", "activeNum": 8707, "avgActivePrice": 6.93, "cheatNum":973, "cheatRate": 11.17, "normalNum": 7734, "statementCost": 53583.68, "totalRewardAmount":0},
  {"stime": "2023-04-11", "activeNum": 262, "avgActivePrice": 9.63, "cheatNum":26, "cheatRate": 9.92, "normalNum": 236, "statementCost": 2272.09, "totalRewardAmount":0},
  {"stime": "2023-04-12", "activeNum": 289, "avgActivePrice": 7.12, "cheatNum":62, "cheatRate": 21.45, "normalNum": 227, "statementCost": 1616.39, "totalRewardAmount":0},
  {"stime": "2023-04-13", "activeNum": 291, "avgActivePrice": 8.4, "cheatNum":35, "cheatRate": 12.03, "normalNum": 256, "statementCost": 2150.57, "totalRewardAmount":0},
  {"stime": "2023-04-14", "activeNum": 235, "avgActivePrice": 4.27, "cheatNum":11, "cheatRate": 4.68, "normalNum": 224, "statementCost": 956.92, "totalRewardAmount":0},
  {"stime": "2023-04-15", "activeNum": 273, "avgActivePrice": 8.69, "cheatNum":57, "cheatRate": 20.88, "normalNum": 216, "statementCost": 1877.02, "totalRewardAmount":0},
  {"stime": "2023-04-16", "activeNum": 275, "avgActivePrice": 7.87, "cheatNum":18, "cheatRate": 6.55, "normalNum": 257, "statementCost": 2022.31, "totalRewardAmount":0},
  {"stime": "2023-04-17", "activeNum": 272, "avgActivePrice": 4.97, "cheatNum":36, "cheatRate": 13.24, "normalNum": 236, "statementCost": 1172.11, "totalRewardAmount":0},
  {"stime": "2023-04-18", "activeNum": 184, "avgActivePrice": 6.88, "cheatNum":10, "cheatRate": 5.43, "normalNum": 174, "statementCost": 1197.21, "totalRewardAmount":0},
  {"stime": "2023-04-19", "activeNum": 154, "avgActivePrice": 2.68, "cheatNum":12, "cheatRate": 7.79, "normalNum": 142, "statementCost": 380.19, "totalRewardAmount":0},
  {"stime": "2023-04-20", "activeNum": 304, "avgActivePrice": 5.22, "cheatNum":27, "cheatRate": 8.88, "normalNum": 277, "statementCost": 1446.7, "totalRewardAmount":0},
  {"stime": "2023-04-21", "activeNum": 211, "avgActivePrice": 4.23, "cheatNum":14, "cheatRate": 6.64, "normalNum": 197, "statementCost": 833.49, "totalRewardAmount":0},
  {"stime": "2023-04-22", "activeNum": 235, "avgActivePrice": 4.67, "cheatNum":23, "cheatRate": 9.79, "normalNum": 212, "statementCost": 990.43, "totalRewardAmount":0},
  {"stime": "2023-04-23", "activeNum": 229, "avgActivePrice": 5.03, "cheatNum":12, "cheatRate": 5.24, "normalNum": 217, "statementCost": 1091.51, "totalRewardAmount":0},
  {"stime": "2023-04-24", "activeNum": 225, "avgActivePrice": 3.29, "cheatNum":15, "cheatRate": 6.67, "normalNum": 210, "statementCost": 690.94, "totalRewardAmount":0},
  {"stime": "2023-04-25", "activeNum": 227, "avgActivePrice": 3, "cheatNum":19, "cheatRate": 8.37, "normalNum": 208, "statementCost": 624.04, "totalRewardAmount":0},
  {"stime": "2023-04-26", "activeNum": 218, "avgActivePrice": 2.2, "cheatNum":30, "cheatRate": 13.76, "normalNum": 188, "statementCost": 413.43, "totalRewardAmount":0},
  {"stime": "2023-04-27", "activeNum": 135, "avgActivePrice": 2.68, "cheatNum":11, "cheatRate": 8.15, "normalNum": 124, "statementCost": 332.48, "totalRewardAmount":0},
  {"stime": "2023-04-28", "activeNum": 21, "avgActivePrice": 1.27, "cheatNum":6, "cheatRate": 28.57, "normalNum": 15, "statementCost": 19.01, "totalRewardAmount":0},
  {"stime": "2023-04-29", "activeNum": 15, "avgActivePrice": 0.81, "cheatNum":3, "cheatRate": 20, "normalNum": 12, "statementCost": 9.69, "totalRewardAmount":0},
  {"stime": "2023-04-30", "activeNum": 10, "avgActivePrice": 1.7, "cheatNum":2, "cheatRate": 20, "normalNum": 8, "statementCost": 13.54, "totalRewardAmount":0},
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
