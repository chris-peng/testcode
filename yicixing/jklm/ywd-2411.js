var detailData = [
  {"channelPackageName": "lechuang_android_lechuang17","month": "2024-11","newUserNum": 751,"cheatUserNum": 61,"payUserNum": 690,"price": 9.39,"amount": 6481.8},
  {"channelPackageName": "lechuang_android_lechuang16","month": "2024-11","newUserNum": 1142,"cheatUserNum": 79,"payUserNum": 1063,"price": 7.52,"amount": 7989.7},
  {"channelPackageName": "lechuang_android_lechuang15","month": "2024-11","newUserNum": 9545,"cheatUserNum": 1518,"payUserNum": 8027,"price": 7.56,"amount": 60675.8},
  {"channelPackageName": "lechuang_android_lechuang13","month": "2024-11","newUserNum": 1110,"cheatUserNum": 85,"payUserNum": 1025,"price": 9.08,"amount": 9302.1},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2024-11","newUserNum": 5533,"cheatUserNum": 545,"payUserNum": 4988,"price": 8.5,"amount": 42403.6},
  {"channelPackageName": "lechuang_android_lechuang05","month": "2024-10","newUserNum": 783,"cheatUserNum": 206,"payUserNum": 577,"price": 8.23,"amount": 4749},
  {"channelPackageName": "lechuang_android_lechuang03","month": "2024-10","newUserNum": 536,"cheatUserNum": 115,"payUserNum": 421,"price": 9.67,"amount": 4071},
  {"channelPackageName": "lechuang_android_lechuang02","month": "2024-10","newUserNum": 601,"cheatUserNum": 131,"payUserNum": 470,"price": 8.38,"amount": 3938},
  {"channelPackageName": "jr7983","month": "2024-10","newUserNum": 223,"cheatUserNum": 49,"payUserNum": 174,"price": 9.83,"amount": 1710},
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
