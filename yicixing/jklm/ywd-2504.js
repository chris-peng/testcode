var detailData = [
  {"channelPackageName": "lechuang_android_lechuang16","month": "2025-04","newUserNum": 818,"cheatUserNum": 62,"payUserNum": 756,"price": 10.88,"amount": 8225},
  {"channelPackageName": "lechuang_android_lechuang15","month": "2025-04","newUserNum": 3922,"cheatUserNum": 213,"payUserNum": 3709,"price": 10.28,"amount": 38488},
  {"channelPackageName": "lechuang_android_lechuang13","month": "2025-04","newUserNum": 780,"cheatUserNum": 53,"payUserNum": 727,"price": 7.09,"amount": 5154},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2025-04","newUserNum": 1435,"cheatUserNum": 62,"payUserNum": 1373,"price": 13.01,"amount": 17865},
  {"channelPackageName": "lechuang_android_lechuang10","month": "2025-04","newUserNum": 856,"cheatUserNum": 57,"payUserNum": 799,"price": 9.6,"amount": 7670},
  {"channelPackageName": "lechuang_android_lechuang09","month": "2025-04","newUserNum": 861,"cheatUserNum": 71,"payUserNum": 790,"price": 13.83,"amount": 10927},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2025-04","newUserNum": 3913,"cheatUserNum": 311,"payUserNum": 3602,"price": 6.91,"amount": 24895},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2025-04","newUserNum": 814,"cheatUserNum": 68,"payUserNum": 746,"price": 9.02,"amount": 6729},
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
