var detailData = [
  {"stime": "2023-05", "activeNum": 2125, "avgActivePrice": 2.36, "cheatNum":254, "cheatRate": 11.95, "normalNum": 1871, "statementCost": 4414.61, "totalRewardAmount":0},
  {"stime": "2023-07-01", "activeNum": 62, "avgActivePrice": 5.6, "cheatNum":11, "cheatRate": 17.74, "normalNum": 51, "statementCost": 285.8, "totalRewardAmount":0},
  {"stime": "2023-07-02", "activeNum": 153, "avgActivePrice": 1.68, "cheatNum":12, "cheatRate": 7.84, "normalNum": 141, "statementCost": 236.8, "totalRewardAmount":0},
  {"stime": "2023-07-03", "activeNum": 129, "avgActivePrice": 3.55, "cheatNum":23, "cheatRate": 17.83, "normalNum": 106, "statementCost": 376.78, "totalRewardAmount":0},
  {"stime": "2023-07-04", "activeNum": 120, "avgActivePrice": 4.15, "cheatNum":17, "cheatRate": 14.17, "normalNum": 103, "statementCost": 427.56, "totalRewardAmount":0},
  {"stime": "2023-07-05", "activeNum": 130, "avgActivePrice": 2.39, "cheatNum":20, "cheatRate": 15.38, "normalNum": 110, "statementCost": 263.14, "totalRewardAmount":0},
  {"stime": "2023-07-06", "activeNum": 158, "avgActivePrice": 1.28, "cheatNum":28, "cheatRate": 17.72, "normalNum": 130, "statementCost": 166.86, "totalRewardAmount":0},
  {"stime": "2023-07-07", "activeNum": 115, "avgActivePrice": 2.36, "cheatNum":17, "cheatRate": 14.78, "normalNum": 98, "statementCost": 231.33, "totalRewardAmount":0},
  {"stime": "2023-07-08", "activeNum": 169, "avgActivePrice": 1.69, "cheatNum":21, "cheatRate": 12.43, "normalNum": 148, "statementCost": 250.79, "totalRewardAmount":0},
  {"stime": "2023-07-09", "activeNum": 166, "avgActivePrice": 2.89, "cheatNum":28, "cheatRate": 16.87, "normalNum": 138, "statementCost": 398.61, "totalRewardAmount":0},
  {"stime": "2023-07-10", "activeNum": 220, "avgActivePrice": 1.23, "cheatNum":30, "cheatRate": 13.64, "normalNum": 190, "statementCost": 233.28, "totalRewardAmount":0},
  {"stime": "2023-07-11", "activeNum": 263, "avgActivePrice": 2.24, "cheatNum":18, "cheatRate": 6.84, "normalNum": 245, "statementCost": 548.99, "totalRewardAmount":0},
  {"stime": "2023-07-12", "activeNum": 275, "avgActivePrice": 1.36, "cheatNum":13, "cheatRate": 4.73, "normalNum": 262, "statementCost": 355.96, "totalRewardAmount":0},
  {"stime": "2023-07-13", "activeNum": 165, "avgActivePrice": 4.29, "cheatNum":16, "cheatRate": 9.7, "normalNum": 149, "statementCost": 638.71, "totalRewardAmount":0},
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
        row.activeNum = 2125;
        row.activeNumPer = -64.58;
        row.normalNum = 1871;
        row.normalNumPer = -64.73;
        row.cheatRate = 11.95;
        row.cheatRatePer = 3.28;
        row.statementCost = 4414.61;
        row.statementCostPer = -83.84;
        row.avgActivePrice = 2.36;
        row.avgActivePricePer = -54.17;
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
