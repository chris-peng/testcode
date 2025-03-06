var detailData = [
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-02-25","users0": 158,"cheatUsers": 87,"cheatUserRatio":0.55,"users": 71,"price": 6,"amount": 426},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-02-26","users0": 105,"cheatUsers": 3,"cheatUserRatio":0.03,"users": 102,"price": 6,"amount": 612},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-02-27","users0": 140,"cheatUsers": 8,"cheatUserRatio":0.06,"users": 132,"price": 8.14,"amount": 1074.48},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-02-28","users0": 149,"cheatUsers": 19,"cheatUserRatio":0.13,"users": 130,"price": 7.12,"amount": 925.6},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-01","users0": 186,"cheatUsers": 102,"cheatUserRatio":0.55,"users": 84,"price": 6,"amount": 504},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-02","users0": 148,"cheatUsers": 81,"cheatUserRatio":0.55,"users": 67,"price": 6,"amount": 402},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-03","users0": 181,"cheatUsers": 6,"cheatUserRatio":0.03,"users": 175,"price": 11.42,"amount": 1998.5},
  {"channelPackageName": "lechuang_android_lechuang08","day": "2025-03-04","users0": 132,"cheatUsers": 70,"cheatUserRatio":0.53,"users": 62,"price": 6,"amount": 372},
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
