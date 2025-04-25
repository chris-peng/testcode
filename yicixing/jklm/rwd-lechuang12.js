var detailData = [
  {"channelPackageName": "lechuang_android_lechuang12","day": "2025-04-17","users0": 71,"cheatUsers": 4,"cheatUserRatio":0.06,"users": 67,"price": 6,"amount": 402},
  {"channelPackageName": "lechuang_android_lechuang12","day": "2025-04-18","users0": 170,"cheatUsers": 22,"cheatUserRatio":0.13,"users": 148,"price": 15.37,"amount": 2274.76},
  {"channelPackageName": "lechuang_android_lechuang12","day": "2025-04-19","users0": 147,"cheatUsers": 17,"cheatUserRatio":0.12,"users": 130,"price": 17.44,"amount": 2267.2},
  {"channelPackageName": "lechuang_android_lechuang12","day": "2025-04-20","users0": 37,"cheatUsers": 6,"cheatUserRatio":0.16,"users": 31,"price": 15.89,"amount": 492.59},
  {"channelPackageName": "lechuang_android_lechuang12","day": "2025-04-22","users0": 100,"cheatUsers": 3,"cheatUserRatio":0.03,"users": 97,"price": 6.36,"amount": 616.92},
  {"channelPackageName": "lechuang_android_lechuang12","day": "2025-04-23","users0": 242,"cheatUsers": 31,"cheatUserRatio":0.13,"users": 211,"price": 13.36,"amount": 2818.96},
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
