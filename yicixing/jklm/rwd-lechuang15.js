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
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-09","users0":60,"cheatUsers": 2,"cheatUserRatio":0.03,"users": 58,"price": 6,"amount": 348},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-10","users0":90,"cheatUsers": 2,"cheatUserRatio":0.02,"users": 88,"price": 9.21,"amount": 810.48},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-11","users0":63,"cheatUsers": 9,"cheatUserRatio":0.14,"users": 54,"price": 13.44,"amount": 725.76},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-12","users0":129,"cheatUsers": 5,"cheatUserRatio":0.04,"users": 124,"price": 6.47,"amount": 802.28},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-13","users0":97,"cheatUsers": 2,"cheatUserRatio":0.02,"users": 95,"price": 6.09,"amount": 578.55},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-14","users0":132,"cheatUsers": 20,"cheatUserRatio":0.15,"users": 112,"price": 16.38,"amount": 1834.56},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-15","users0":109,"cheatUsers": 2,"cheatUserRatio":0.02,"users": 107,"price": 6.01,"amount": 643.07},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-16","users0":75,"cheatUsers": 9,"cheatUserRatio":0.12,"users": 66,"price": 13.33,"amount": 879.78},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-17","users0":114,"cheatUsers": 5,"cheatUserRatio":0.04,"users": 109,"price": 8.44,"amount": 919.96},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-18","users0":92,"cheatUsers": 12,"cheatUserRatio":0.13,"users": 80,"price": 15.83,"amount": 1266.4},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-19","users0":94,"cheatUsers": 51,"cheatUserRatio":0.54,"users": 43,"price": 6,"amount": 258},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-20","users0":82,"cheatUsers": 13,"cheatUserRatio":0.16,"users": 69,"price": 12.78,"amount": 881.82},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-21","users0":97,"cheatUsers": 14,"cheatUserRatio":0.14,"users": 83,"price": 13.74,"amount": 1140.42},
  {"channelPackageName": "lechuang_android_lechuang15","day": "2025-03-22","users0":71,"cheatUsers": 4,"cheatUserRatio":0.05,"users": 67,"price": 6,"amount": 402},
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
