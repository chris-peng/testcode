var detailData = [
  {"channelPackageName": "lechuang_android_lechuang16","month": "2025-04","newUserNum": 732,"cheatUserNum": 59,"payUserNum": 673,"price": 6.52,"amount": 4386.9},
  {"channelPackageName": "lechuang_android_lechuang15","month": "2025-04","newUserNum": 3922,"cheatUserNum": 415,"payUserNum": 2840,"price": 6.53,"amount": 18542.3},
  {"channelPackageName": "lechuang_android_lechuang13","month": "2025-04","newUserNum": 796,"cheatUserNum": 62,"payUserNum": 734,"price": 7.14,"amount": 5242.6},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2025-04","newUserNum": 1435,"cheatUserNum": 62,"payUserNum": 734,"price": 7.14,"amount": 5242.6},
  {"channelPackageName": "lechuang_android_lechuang10","month": "2025-04","newUserNum": 762,"cheatUserNum": 69,"payUserNum": 693,"price": 7.88,"amount": 5460},
  {"channelPackageName": "lechuang_android_lechuang09","month": "2025-04","newUserNum": 793,"cheatUserNum": 74,"payUserNum": 719,"price": 6,"amount": 4314},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2025-04","newUserNum": 3913,"cheatUserNum": 311,"payUserNum": 5069,"price": 6.14,"amount": 31123.7},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2025-04","newUserNum": 790,"cheatUserNum": 49,"payUserNum": 741,"price": 8.56,"amount": 6339.8},
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
