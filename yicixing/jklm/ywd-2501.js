var detailData = [
  {"channelPackageName": "lechuang_android_lechuang15","month": "2025-01","newUserNum": 963,"cheatUserNum": 301,"payUserNum": 662,"price": 7.74,"amount": 5121},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2025-01","newUserNum": 382,"cheatUserNum": 21,"payUserNum": 361,"price": 16.22,"amount": 5855},
  {"channelPackageName": "lechuang_android_lechuang10","month": "2025-01","newUserNum": 715,"cheatUserNum": 119,"payUserNum": 596,"price": 9.15,"amount": 5452},
  {"channelPackageName": "lechuang_android_lechuang09","month": "2025-01","newUserNum": 738,"cheatUserNum": 60,"payUserNum": 678,"price": 10.1,"amount": 6849},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2025-01","newUserNum": 7223,"cheatUserNum": 969,"payUserNum": 6254,"price": 8.69,"amount": 54362},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2025-01","newUserNum": 728,"cheatUserNum": 136,"payUserNum": 592,"price": 8.84,"amount": 5234},
  {"channelPackageName": "lechuang_android_lechuang05","month": "2025-01","newUserNum": 645,"cheatUserNum": 104,"payUserNum": 541,"price": 7.5,"amount": 4056},
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
