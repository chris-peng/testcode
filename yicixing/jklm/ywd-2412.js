var detailData = [
  {"channelPackageName": "lechuang_android_lechuang17","month": "2024-12","newUserNum": 828,"cheatUserNum": 97,"payUserNum": 731,"price": 6,"amount": 4386},
  {"channelPackageName": "lechuang_android_lechuang16","month": "2024-12","newUserNum": 744,"cheatUserNum": 81,"payUserNum": 663,"price": 9.25,"amount": 6135},
  {"channelPackageName": "lechuang_android_lechuang15","month": "2024-12","newUserNum": 269,"cheatUserNum": 33,"payUserNum": 236,"price": 6,"amount": 1416},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2024-12","newUserNum": 737,"cheatUserNum": 30,"payUserNum": 707,"price": 9.84,"amount": 6955},
  {"channelPackageName": "lechuang_android_lechuang09","month": "2024-12","newUserNum": 775,"cheatUserNum": 46,"payUserNum": 729,"price": 9.31,"amount": 6784},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2024-12","newUserNum": 6968,"cheatUserNum": 474,"payUserNum": 6494,"price": 11.17,"amount": 72562},
  {"channelPackageName": "lechuang_android_lechuang05","month": "2024-12","newUserNum": 871,"cheatUserNum": 83,"payUserNum": 788,"price": 7.21,"amount": 5680},
  {"channelPackageName": "jr7983","month": "2024-11","newUserNum": 111,"cheatUserNum": 25,"payUserNum": 86,"price": 10.78,"amount": 927.1},
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
