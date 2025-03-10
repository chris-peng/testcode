var detailData = [
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-02-25","users0": 78,"cheatUsers": 13,"cheatUserRatio":0.17,"users": 65,"price": 13.22,"amount": 859.3},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-02-26","users0": 113,"cheatUsers": 3,"cheatUserRatio":0.03,"users": 110,"price": 6,"amount": 660},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-02-27","users0": 144,"cheatUsers": 20,"cheatUserRatio":0.14,"users": 124,"price": 13.58,"amount": 1683.92},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-02-28","users0": 122,"cheatUsers": 67,"cheatUserRatio":0.55,"users": 55,"price": 6,"amount": 330},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-01","users0": 181,"cheatUsers": 8,"cheatUserRatio":0.04,"users": 173,"price": 6.19,"amount": 1070.87},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-02","users0": 128,"cheatUsers": 69,"cheatUserRatio":0.54,"users": 59,"price": 6,"amount": 354},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-03","users0": 118,"cheatUsers": 63,"cheatUserRatio":0.53,"users": 55,"price": 6,"amount": 330},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-04","users0": 75,"cheatUsers": 2,"cheatUserRatio":0.03,"users": 73,"price": 6,"amount": 438},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-05","users0": 105,"cheatUsers": 3,"cheatUserRatio":0.03,"users": 102,"price": 6,"amount": 612},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-06","users0": 91,"cheatUsers": 5,"cheatUserRatio":0.05,"users": 86,"price": 12.3,"amount": 1057.8},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-07","users0": 77,"cheatUsers": 1,"cheatUserRatio":0.01,"users": 76,"price": 6,"amount": 456},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-08","users0":103,"cheatUsers": 56,"cheatUserRatio":0.54,"users": 47,"price": 6,"amount": 282},
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
