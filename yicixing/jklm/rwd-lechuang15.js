var detailData = [
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-01","users0": 963,"cheatUsers": 301,"cheatUserRatio":0.05,"users": 662,"price": 7.74,"amount": 5121.9},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-02","users0": 382,"cheatUsers": 21,"cheatUserRatio":0.05,"users": 361,"price": 16.22,"amount": 5855},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-03","users0": 715,"cheatUsers": 119,"cheatUserRatio":0.05,"users": 596,"price": 9.15,"amount": 5452},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-04","users0": 738,"cheatUsers": 60,"cheatUserRatio":0.05,"users": 678,"price": 10.1,"amount": 6849},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-05","users0": 7223,"cheatUsers": 969,"cheatUserRatio":0.05,"users": 6254,"price": 8.69,"amount": 54362},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-06","users0": 728,"cheatUsers": 136,"cheatUserRatio":0.05,"users": 592,"price": 8.84,"amount": 5234},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-07","users0": 645,"cheatUsers": 104,"cheatUserRatio":0.05,"users": 541,"price": 7.5,"amount": 4056},
];

var detailDataMap = {};
for(index in detailData){
  detailDataMap[detailData[index].channelPackageName + '_' + detailData[index].day] = detailData[index];
}

function interceptintercept(content, resp){
    console.log(content, resp);
    if(resp.url.indexOf('/channel/queryCpaOrderList') >= 0){
      var json = JSON.parse(content);
      var data = json.resultData.cpaOrderVOList;
      for(var i = 0; i < data.length; i++){
        var row = data[i];
        var newData = detailDataMap[row.channelPackageName + '_' + getDay(row.createDate)];
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

function getDay(datetime){
  var odate = new Date(datetime);
  var imonth = odate.getMonth() + 1;
  var iday = odate.getDate();
  return odate.getFullYear() + '-' + (imonth < 10 ? ('0' + imonth) : ('' + imonth)) + '-' + (iday < 10 ? ('0' + iday) : ('' + iday));
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
