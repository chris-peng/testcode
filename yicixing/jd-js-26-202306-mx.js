var detailData = [
  {"stime": "2023-06", "activeNum": 623, "avgActivePrice": 2, "cheatNum":56, "cheatRate": 24.72, "normalNum": 469, "statementCost": 940.02, "totalRewardAmount":0},
  {"stime": "2023-06-13", "activeNum": 76, "avgActivePrice": 2.68, "cheatNum":3, "cheatRate": 3.95, "normalNum": 73, "statementCost": 195.61, "totalRewardAmount":0},
  {"stime": "2023-06-14", "activeNum": 77, "avgActivePrice": 2.35, "cheatNum":2, "cheatRate": 2.6, "normalNum": 75, "statementCost": 176.34, "totalRewardAmount":0},
  {"stime": "2023-06-15", "activeNum": 103, "avgActivePrice": 1.73, "cheatNum":0, "cheatRate": 0, "normalNum": 103, "statementCost": 178.57, "totalRewardAmount":0},
  {"stime": "2023-06-16", "activeNum": 108, "avgActivePrice": 1.72, "cheatNum":0, "cheatRate": 0, "normalNum": 108, "statementCost": 185.85, "totalRewardAmount":0},
  {"stime": "2023-06-17", "activeNum": 205, "avgActivePrice": 2.47, "cheatNum":126, "cheatRate": 61.46, "normalNum": 79, "statementCost": 195.29, "totalRewardAmount":0},
  {"stime": "2023-06-18", "activeNum": 54, "avgActivePrice": 0.27, "cheatNum":23, "cheatRate": 42.59, "normalNum": 31, "statementCost": 8.36, "totalRewardAmount":0},
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
        row.activeNum = 623;
        row.activeNumPer = 198.75;
        row.normalNum = 469;
        row.normalNumPer = 133.56;
        row.cheatRate = 24.72;
        row.cheatRatePer = 197.07;
        row.statementCost = 940.02;
        row.statementCostPer = -21.61;
        row.avgActivePrice = 2;
        row.avgActivePricePer = -66.44;
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
