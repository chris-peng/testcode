var detailData = [
  {"channelPackageName": "lechuang_android_lechuang16","month": "2024-07","newUserNum": 95,"cheatUserNum": 34,"payUserNum": 61,"price": 10.48,"amount": 639},
  {"channelPackageName": "lechuang_android_lechuang14","month": "2024-07","newUserNum": 311,"cheatUserNum": 91,"payUserNum": 220,"price": 13.87,"amount": 3050.5},
  {"channelPackageName": "lechuang_android_lechuang09","month": "2024-08","newUserNum": 587,"cheatUserNum": 189,"payUserNum": 398,"price": 12.93,"amount": 5146.7},
  {"channelPackageName": "lechuang_android_lechuang05","month": "2024-08","newUserNum": 152,"cheatUserNum": 28,"payUserNum": 124,"price": 17.04,"amount": 2113.4},
  {"channelPackageName": "lechuang_android_lechuang02","month": "2024-08","newUserNum": 633,"cheatUserNum": 111,"payUserNum": 522,"price": 15.71,"amount": 8200.4},
  {"channelPackageName": "lechuang_android_lechuang01","month": "2024-08","newUserNum": 538,"cheatUserNum": 164,"payUserNum": 374,"price": 12.99,"amount": 4858.7},
  {"channelPackageName": "jr7983","month": "2024-07","newUserNum": 96,"cheatUserNum": 14,"payUserNum": 82,"price": 8.16,"amount": 669},
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
