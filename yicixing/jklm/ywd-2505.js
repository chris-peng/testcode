var detailData = [
  {"channelPackageName": "lechuang_android_lechuang16","month": "2025-05","newUserNum": 3447,"cheatUserNum": 427,"payUserNum": 3020,"price": 6.51,"amount": 19646},
  {"channelPackageName": "lechuang_android_lechuang15","month": "2025-05","newUserNum": 2304,"cheatUserNum": 91,"payUserNum": 2213,"price": 8.55,"amount": 18926},
  {"channelPackageName": "lechuang_android_lechuang13","month": "2025-05","newUserNum": 3439,"cheatUserNum": 334,"payUserNum": 3105,"price": 6,"amount": 18630},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2025-05","newUserNum": 2799,"cheatUserNum": 110,"payUserNum": 2689,"price": 9.1,"amount": 24471},
  {"channelPackageName": "lechuang_android_lechuang10","month": "2025-05","newUserNum": 3331,"cheatUserNum": 356,"payUserNum": 2975,"price": 7.04,"amount": 20944},
  {"channelPackageName": "lechuang_android_lechuang09","month": "2025-05","newUserNum": 3438,"cheatUserNum": 422,"payUserNum": 3016,"price": 6.18,"amount": 18630},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2025-05","newUserNum": 1016,"cheatUserNum": 62,"payUserNum": 954,"price": 9.1,"amount": 8681},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2025-05","newUserNum": 3390,"cheatUserNum": 328,"payUserNum": 3062,"price": 6.42,"amount": 19643},
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
