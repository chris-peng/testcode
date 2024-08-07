var detailData = [
  {"channelPackageName": "lechuang_android_lechuang12","month": "2024-06","newUserNum": 2381,"cheatUserNum": 1078,"payUserNum": 1303,"price": 16.21,"amount": 21116.6},
  {"channelPackageName": "lechuang_android_lechuang10","month": "2024-06","newUserNum": 1636,"cheatUserNum": 532,"payUserNum": 1104,"price": 14.31,"amount": 15796.7},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2024-06","newUserNum": 2340,"cheatUserNum": 760,"payUserNum": 1580,"price": 15.25,"amount": 24092.8},
  {"channelPackageName": "lechuang_android_lechuang05","month": "2024-06","newUserNum": 2257,"cheatUserNum": 723,"payUserNum": 1534,"price": 12.81,"amount": 19657.7},
  {"channelPackageName": "lechuang_android_lechuang03","month": "2024-06","newUserNum": 2333,"cheatUserNum": 740,"payUserNum": 1593,"price": 16.21,"amount": 25815.9},
  {"channelPackageName": "lechuang_android_lechuang02","month": "2024-06","newUserNum": 3556,"cheatUserNum": 1136,"payUserNum": 2420,"price": 12.17,"amount": 29454.5},
  {"channelPackageName": "lechuang_android_lechuang01","month": "2024-06","newUserNum": 2632,"cheatUserNum": 1192,"payUserNum": 1440,"price": 13.05,"amount": 18795.6},
];

var detailDataMap = {};
for(index in detailData){
  detailDataMap[detailData[index].channelPackageName + '_' + detailData[index].month] = detailData[index];
}

function interceptintercept(content, resp){
    console.log(content, resp);
    if(resp.url.indexOf('/cpaorder/queryCpaOrderMonthForAgent') >= 0){
      var json = JSON.parse(content);
      var data = json.resultData.data.rows;
      for(var i = 0; i < data.length; i++){
        var row = data[i];
        var newData = detailDataMap[row.channelPackageName + '_' + row.month];
        if(newData){
          for(field in newData){
            row[field] = newData[field];
          }
        }
      }
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
