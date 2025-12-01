var detailData = [
  {"channelPackageName": "lechuang_android_lechuang18","month": "2025-09","newUserNum": 21,"cheatUserNum": 17,"payUserNum": 4,"price": 6,"amount": 24},
  {"channelPackageName": "lechuang_android_lechuang16","month": "2025-09","newUserNum": 3678,"cheatUserNum": 3231,"payUserNum": 447,"price": 6,"amount": 2682},
  {"channelPackageName": "lechuang_android_lechuang15","month": "2025-09","newUserNum": 3807,"cheatUserNum": 3217,"payUserNum": 590,"price": 6,"amount": 3540},
  {"channelPackageName": "lechuang_android_lechuang13","month": "2025-09","newUserNum": 3790,"cheatUserNum": 3285,"payUserNum": 505,"price": 6,"amount": 3030},
  {"channelPackageName": "lechuang_android_lechuang11","month": "2025-09","newUserNum": 1860,"cheatUserNum": 454,"payUserNum": 1406,"price": 6,"amount": 8436},
  {"channelPackageName": "lechuang_android_lechuang10","month": "2025-09","newUserNum": 3662,"cheatUserNum": 3282,"payUserNum": 380,"price": 6,"amount": 2280},
  {"channelPackageName": "lechuang_android_lechuang09","month": "2025-09","newUserNum": 3760,"cheatUserNum": 3194,"payUserNum": 566,"price": 6,"amount": 3396},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2025-09","newUserNum": 2138,"cheatUserNum": 815,"payUserNum": 1323,"price": 6,"amount": 7938},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2025-09","newUserNum": 3611,"cheatUserNum": 3139,"payUserNum": 472,"price": 6,"amount": 2832},
  {"channelPackageName": "lechuang_android_lechuang04","month": "2025-09","newUserNum": 3761,"cheatUserNum": 3308,"payUserNum": 453,"price": 6,"amount": 2718},
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
