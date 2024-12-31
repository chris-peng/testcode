var detailData = [
  {"channelPackageName": "lechuang_android_lechuang17","month": "2024-11","newUserNum": 751,"cheatUserNum": 121,"payUserNum": 630,"price": 9.39,"amount": 5915.7},
  {"channelPackageName": "lechuang_android_lechuang16","month": "2024-11","newUserNum": 1142,"cheatUserNum": 345,"payUserNum": 797,"price": 7.72,"amount": 6152.8},
  {"channelPackageName": "lechuang_android_lechuang15","month": "2024-11","newUserNum": 11517,"cheatUserNum": 3397,"payUserNum": 8120,"price": 8.16,"amount": 66259.2},
  {"channelPackageName": "lechuang_android_lechuang13","month": "2024-11","newUserNum": 1110,"cheatUserNum": 288,"payUserNum": 822,"price": 9.48,"amount": 7792.6},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2024-11","newUserNum": 5533,"cheatUserNum": 848,"payUserNum": 4685,"price": 9.65,"amount": 45210.3},
  {"channelPackageName": "lechuang_android_lechuang11","month": "2024-11","newUserNum": 3119,"cheatUserNum": 533,"payUserNum": 2586,"price": 12.57,"amount": 32506},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2024-11","newUserNum": 9545,"cheatUserNum": 2077,"payUserNum": 7468,"price": 7.67,"amount": 57279.6},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2024-11","newUserNum": 1054,"cheatUserNum": 190,"payUserNum": 864,"price": 9.83,"amount": 8493.1},
  {"channelPackageName": "lechuang_android_lechuang06","month": "2024-11","newUserNum": 942,"cheatUserNum": 145,"payUserNum": 797,"price": 9.59,"amount": 7643.2},
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
