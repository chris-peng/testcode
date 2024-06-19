var detailData = [
  {"channelPackageName": "lechuang_android_lechuang12","month": "2024-05","newUserNum": 2649,"cheatUserNum": 1050,"payUserNum": 1599,"price": 18.15,"amount": 29027.3},
  {"channelPackageName": "lechuang_android_lechuang10","month": "2024-05","newUserNum": 2749,"cheatUserNum": 1125,"payUserNum": 1624,"price": 9.4,"amount": 15268.8},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2024-05","newUserNum": 2681,"cheatUserNum": 1076,"payUserNum": 1605,"price": 12.28,"amount": 19705.1},
  {"channelPackageName": "lechuang_android_lechuang06","month": "2024-05","newUserNum": 2772,"cheatUserNum": 1139,"payUserNum": 1633,"price": 12.49,"amount": 20395.7},
  {"channelPackageName": "lechuang_android_lechuang05","month": "2024-05","newUserNum": 1834,"cheatUserNum": 759,"payUserNum": 1075,"price": 14.14,"amount": 15203},
  {"channelPackageName": "lechuang_android_lechuang02","month": "2024-05","newUserNum": 2324,"cheatUserNum": 947,"payUserNum": 1377,"price": 13.62,"amount": 18757.8},
  {"channelPackageName": "lechuang_android_lechuang03","month": "2024-05","newUserNum": 2710,"cheatUserNum": 1203,"payUserNum": 1507,"price": 11.73,"amount": 17680.4},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2024-05","newUserNum": 3569,"cheatUserNum": 1408,"payUserNum": 2161,"price": 14.29,"amount": 30877.3},
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
