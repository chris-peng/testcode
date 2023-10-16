var detailData = [
  {"stime": "2023-09", "activeNum": 963, "avgActivePrice": 5, "cheatNum":3, "cheatRate": 0.31, "normalNum": 960, "statementCost": 4802.94, "totalRewardAmount":0},
  {"stime": "2023-09-21", "activeNum": 42, "avgActivePrice": 5.55, "cheatNum":0, "cheatRate": 0, "normalNum": 42, "statementCost": 232.97, "totalRewardAmount":0},
  {"stime": "2023-09-22", "activeNum": 52, "avgActivePrice": 2.27, "cheatNum":0, "cheatRate": 0, "normalNum": 52, "statementCost": 118.21, "totalRewardAmount":0},
  {"stime": "2023-09-23", "activeNum": 48, "avgActivePrice": 5.55, "cheatNum":0, "cheatRate": 0, "normalNum": 48, "statementCost": 266.45, "totalRewardAmount":0},
  {"stime": "2023-09-24", "activeNum": 61, "avgActivePrice": 3.92, "cheatNum":0, "cheatRate": 0, "normalNum": 61, "statementCost": 238.96, "totalRewardAmount":0},
  {"stime": "2023-09-25", "activeNum": 64, "avgActivePrice": 4.39, "cheatNum":0, "cheatRate": 0, "normalNum": 64, "statementCost": 281.05, "totalRewardAmount":0},
  {"stime": "2023-09-26", "activeNum": 73, "avgActivePrice": 7.09, "cheatNum":0, "cheatRate": 0, "normalNum": 0, "statementCost": 517.44, "totalRewardAmount":0},
  {"stime": "2023-09-27", "activeNum": 92, "avgActivePrice": 4.86, "cheatNum":1, "cheatRate": 1.09, "normalNum": 91, "statementCost": 441.9, "totalRewardAmount":0},
  {"stime": "2023-09-28", "activeNum": 185, "avgActivePrice": 5.73, "cheatNum":1, "cheatRate": 0.54, "normalNum": 184, "statementCost": 1054.6, "totalRewardAmount":0},
  {"stime": "2023-09-29", "activeNum": 179, "avgActivePrice": 3.81, "cheatNum":0, "cheatRate": 0, "normalNum": 179, "statementCost": 681.57, "totalRewardAmount":0},
  {"stime": "2023-09-30", "activeNum": 167, "avgActivePrice": 5.84, "cheatNum":1, "cheatRate": 0.6, "normalNum": 166, "statementCost": 969.79, "totalRewardAmount":0},
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
        row.activeNum = 963;
        row.activeNumPer = 23975;
        row.normalNum = 960;
        row.normalNumPer = 95900;
        row.cheatRate = 0.31;
        row.cheatRatePer = -99.58;
        row.statementCost = 4802.94;
        row.statementCostPer = 141162.94;
        row.avgActivePrice = 5;
        row.avgActivePricePer = 47.06;
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
